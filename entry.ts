// server.ts
import Fastify from 'fastify'
import path from 'node:path'
import fastifyCookie from '@fastify/cookie'
import fastifyMiddie from '@fastify/middie'
import fastifyStatic from '@fastify/static'
import { apiPlugin } from '@server/api'

// @ts-ignore
import { handler as ssrHandler } from './dist/server/entry.mjs'

const STATIC_EXTS = new Set([
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.map',
  '.json',
])
const isStaticRequest = (url: string) => {
  if (url.startsWith('/_astro') || url.startsWith('/assets')) return true
  const ext = path.extname(url)
  return STATIC_EXTS.has(ext)
}

const app = Fastify({
  trustProxy: true,
  disableRequestLogging: true,
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req: (req) => ({ method: req.method, url: req.url, ip: req.ip }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  },
})

// --- CUSTOM LOGGING HOOKS ---
app.addHook('onRequest', (req, reply, done) => {
  if (!isStaticRequest(req.url)) {
    req.log.debug({ msg: 'Incoming Request', method: req.method, url: req.url, ip: req.ip })
  }
  done()
})

app.addHook('onResponse', (req, reply, done) => {
  if (!isStaticRequest(req.url)) {
    const user = (req as any).user
    const session = (req as any).session
    const userId = user?.id || session?.userId
    const email = user?.email

    const logPayload: any = {
      msg: 'Request Completed',
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    }

    if (userId) logPayload.user = { id: userId, email }

    if (reply.statusCode >= 500) req.log.error(logPayload)
    else if (reply.statusCode >= 400) req.log.warn(logPayload)
    else req.log.info(logPayload)
  }
  done()
})

const start = async () => {
  try {
    // 1. Core Plugins
    await app.register(fastifyCookie)
    await app.register(fastifyMiddie)

    // 2. Static Files
    const distPath = path.join(process.cwd(), 'dist/client')
    app.log.info({ msg: 'Static Files Path', path: distPath })

    await app.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
      wildcard: false,
    })

    await app.register(apiPlugin, { prefix: '/api' })
    app.setNotFoundHandler((request, reply) => {
      if (request.raw.url && request.raw.url.startsWith('/api')) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'This API is not implemented. Supabase client 3.1',
        })
      }
      return reply.redirect('/404')
    })

    app.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api')) {
        next()
      } else {
        ssrHandler(req, res, next)
      }
    })
    const PORT = Number(process.env.PORT) || 4321
    await app.listen({ host: '0.0.0.0', port: PORT })

    app.log.info({ msg: 'Server Started', port: PORT, env: process.env.NODE_ENV })
  } catch (err) {
    app.log.fatal({ msg: 'Server Startup Error', error: err })
    process.exit(1)
  }
}

start()
