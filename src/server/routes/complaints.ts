import { type FastifyPluginAsync } from 'fastify'
import pg from 'pg'

// Veritabanı bağlantı havuzu (Bunu main dosyanızda oluşturup plugin'e geçebilirsiniz, burada örnek için koydum)
const pool = new pg.Pool({
  connectionString: process.env.DSN!, // .env dosyanızdan gelir
})

export const complaints: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', async (request, reply) => {
    try {
      const userId = 'user_123'
      const studentName = 'Alice Wonderland'
      const studentAvatar = 'https://i.pravatar.cc/150?u=30'

      const { category, room, priority, description } = request.body as any

      const query = `
        INSERT INTO complaints 
        (user_id, student_name, student_avatar, category, room, priority, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `

      const values = [userId, studentName, studentAvatar, category, room, priority, description]
      const { rows } = await pool.query(query, values)

      return reply.code(201).send({ message: 'Complaint created', data: rows[0] })
    } catch (e: any) {
      request.log.error({ msg: 'Create Complaint Failed', error: e })
      return reply.code(500).send({ message: e.message || 'Failed' })
    }
  })

  // 2. ADMİN İÇİN LİSTELEME (ComplaintsTable.tsx)
  // ?view=history veya ?view=active
  fastify.get('/admin', async (request, reply) => {
    try {
      const { view } = request.query as { view?: string }

      let query = `SELECT * FROM complaints`
      const values: any[] = []

      if (view === 'history') {
        // Resolved olanlar geçmiş sayılır
        query += ` WHERE status = 'Resolved' ORDER BY created_at DESC`
      } else {
        // Active olanlar
        query += ` WHERE status != 'Resolved' ORDER BY created_at DESC`
      }

      const { rows } = await pool.query(query, values)

      // Frontend formatına uygun map'leme (frontend'deki interface ile uyumlu)
      const formatted = rows.map((row) => ({
        id: row.id,
        name: row.student_name,
        img: row.student_avatar || '',
        category: row.category,
        room: row.room,
        priority: row.priority,
        date: new Date(row.created_at).toLocaleDateString('tr-TR'),
        status: row.status,
        desc: row.description,
      }))

      return reply.send(formatted)
    } catch (e: any) {
      request.log.error({ msg: 'List Admin Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 3. ÖĞRENCİ İÇİN KENDİ ŞİKAYETLERİ (MyComplaintsTable.tsx)
  fastify.get('/my', async (request, reply) => {
    try {
      const userId = 'user_123' // Session'dan gelmeli

      const query = `SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC`
      const { rows } = await pool.query(query, [userId])

      const formatted = rows.map((row) => ({
        id: row.id,
        category: row.category,
        room: row.room,
        priority: row.priority,
        date: new Date(row.created_at).toLocaleDateString('tr-TR'),
        status: row.status,
        desc: row.description,
        rated: row.is_rated,
        rating: row.rating,
      }))

      return reply.send(formatted)
    } catch (e: any) {
      request.log.error({ msg: 'List My Complaints Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 4. PERSONEL ATAMA (AssignStaffModal.jsx)
  fastify.patch('/:id/assign', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { staffId, staffName } = request.body as { staffId: number; staffName: string }

      // Personel atanınca durumu 'Investigating' yapıyoruz
      const query = `
        UPDATE complaints 
        SET assigned_staff_id = $1, assigned_staff_name = $2, status = 'Investigating'
        WHERE id = $3
        RETURNING *
      `
      const { rows } = await pool.query(query, [staffId, staffName, id])

      if (rows.length === 0) {
        return reply.code(404).send({ message: 'Complaint not found' })
      }

      return reply.send({ message: 'Staff assigned', data: rows[0] })
    } catch (e: any) {
      request.log.error({ msg: 'Assign Staff Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 5. PUANLAMA / FEEDBACK (GiveFeedbackModal.jsx)
  fastify.patch('/:id/rate', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { rating, comment } = request.body as { rating: number; comment?: string }

      const query = `
        UPDATE complaints 
        SET rating = $1, rating_comment = $2, is_rated = TRUE
        WHERE id = $3
        RETURNING *
      `
      const { rows } = await pool.query(query, [rating, comment, id])

      return reply.send({ message: 'Feedback received', data: rows[0] })
    } catch (e: any) {
      request.log.error({ msg: 'Rate Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })
}
