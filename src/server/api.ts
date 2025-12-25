import { type FastifyPluginAsync } from 'fastify'
import auth from '@lib/auth'

import { complaints } from './routes/complaints'
import { requestsRoute } from './routes/requests'
import { categories } from './routes/categories'
import { dashboardRoute } from './routes/dashboard'
import { staffRoute } from './routes/staff'

export const apiPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    method: ['GET', 'POST'],
    url: '/auth/*',
    async handler(request, reply) {
      const url = new URL(request.url, `http://${request.headers.host}`)
      request.log.debug({ msg: 'Auth Proxy Request', method: request.method, url: url.pathname })

      try {
        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString())
        })

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })

        const response = await auth.handler(req)

        request.log.debug({ msg: 'Auth Proxy Response', status: response.status })

        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))
        reply.send(response.body ? await response.text() : null)
      } catch (error) {
        request.log.error({ msg: 'Auth Proxy Internal Error', error })
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        })
      }
    },
  })

  await fastify.register(complaints, { prefix: '/complaints' })
  await fastify.register(requestsRoute, { prefix: '/requests' })
  await fastify.register(categories, { prefix: '/categories' })
  await fastify.register(dashboardRoute, { prefix: '/dashboard' })
  await fastify.register(staffRoute, { prefix: '/staff' })

  fastify.log.debug({ msg: 'API Routes Registered' })
}
