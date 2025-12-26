import { type FastifyPluginAsync } from 'fastify'
import pool from '@/db/client'
import auth from '@/lib/auth'

export const complaints: FastifyPluginAsync = async (fastify) => {
  
  // 1. ŞİKAYET OLUŞTURMA
  fastify.post('/', async (request, reply) => {
    try {
      // TypeScript Header Hatası Çözümü: Record<string, string> tipine zorlama
      const session = await auth.api.getSession({ 
        headers: request.headers as Record<string, string> 
      })
      
      if (!session) return reply.code(401).send({ message: 'Unauthorized' })

      const { category, room, priority, description } = request.body as any
      
      const userId = session.user.id
      const studentName = session.user.name
      const studentAvatar = session.user.image || `https://ui-avatars.com/api/?name=${studentName}`

      const query = `
        INSERT INTO complaints 
        (user_id, student_name, student_avatar, category, room, priority, description, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
        RETURNING *
      `

      const values = [userId, studentName, studentAvatar, category, room, priority, description]
      const { rows } = await pool.query(query, values)

      return reply.code(201).send({ message: 'Created', data: rows[0] })
    } catch (e: any) {
      return reply.code(500).send({ message: e.message })
    }
  })

  // 2. ADMİN İÇİN LİSTELEME (İsim ve Oda sorununu çözen kısım)
  fastify.get('/admin', async (request, reply) => {
    try {
      const { view } = request.query as { view?: string }

      let query = `SELECT * FROM complaints`
      if (view === 'history') {
        query += ` WHERE status = 'Resolved' ORDER BY created_at DESC`
      } else {
        query += ` WHERE status != 'Resolved' ORDER BY created_at DESC`
      }

      const { rows } = await pool.query(query)

      // Parameter 'row' implicitly has an 'any' type hatası çözümü: (row: any)
      const formatted = rows.map((row: any) => ({
        id: row.id,
        name: row.student_name, // Veritabanındaki gerçek ismi alıyoruz
        img: row.student_avatar || '',
        category: row.category,
        room: row.room || '101', // Boşsa varsayılan veya N/A
        priority: row.priority,
        date: row.created_at ? new Date(row.created_at).toLocaleDateString('tr-TR') : '25.12.2025',
        status: row.status,
        desc: row.description,
      }))

      return reply.send(formatted)
    } catch (e: any) {
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 3. ÖĞRENCİ İÇİN KENDİ ŞİKAYETLERİ
  fastify.get('/my', async (request, reply) => {
    try {
      const session = await auth.api.getSession({ 
        headers: request.headers as Record<string, string> 
      })
      if (!session) return reply.code(401).send({ message: 'Unauthorized' })

      const query = `SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC`
      const { rows } = await pool.query(query, [session.user.id])

      return reply.send(rows.map((row: any) => ({
        id: row.id,
        category: row.category,
        room: row.room,
        priority: row.priority,
        date: new Date(row.created_at).toLocaleDateString('tr-TR'),
        status: row.status,
        desc: row.description,
        rated: row.is_rated,
        rating: row.rating,
      })))
    } catch (e: any) {
      return reply.code(500).send({ message: 'Failed' })
    }
  })
}