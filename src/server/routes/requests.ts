import { type FastifyPluginAsync } from 'fastify'
import pool from '@/db/client'

export const requestsRoute: FastifyPluginAsync = async (fastify) => {
  // YENİ TALEP OLUŞTUR (CreateRequestForm)
  fastify.post('/', async (request, reply) => {
    try {
      // Session'dan gelmesi gereken veriler (Mock)
      const userId = 'user_123'
      const studentName = 'Ömer Faruk'
      const studentAvatar = 'https://i.pravatar.cc/150?u=1'
      const studentIdNumber = '220001'

      const { category, room, priority, description } = request.body as any

      const query = `
        INSERT INTO requests 
        (user_id, student_name, student_avatar, student_id_number, category, room, priority, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `
      const { rows } = await pool.query(query, [
        userId,
        studentName,
        studentAvatar,
        studentIdNumber,
        category,
        room,
        priority,
        description,
      ])
      return reply.code(201).send(rows[0])
    } catch (e: any) {
      return reply.code(500).send({ message: e.message })
    }
  })

  // ADMİN İÇİN LİSTELEME (RequestTable, NewRequests)
  fastify.get('/admin', async (request, reply) => {
    const { rows } = await pool.query(`
      SELECT r.*, s.name as assigned_staff_name 
      FROM requests r
      LEFT JOIN staff s ON r.assigned_staff_id = s.id
      ORDER BY r.created_at DESC
    `)

    // Frontend formatına çevir
    const formatted = rows.map((r:any) => ({
      id: r.id,
      name: r.student_name,
      img: r.student_avatar,
      studentId: r.student_id_number,
      category: r.category,
      room: r.room,
      priority: r.priority,
      date: new Date(r.created_at).toLocaleDateString('tr-TR'),
      status: r.status,
      desc: r.description,
      assignedTo: r.assigned_staff_name,
    }))
    return reply.send(formatted)
  })

  // PERSONEL ATAMA (AssignStaffModal)
  fastify.patch('/:id/assign', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { staffId } = request.body as { staffId: number }

    await pool.query(
      `UPDATE requests SET assigned_staff_id = $1, status = 'In Progress' WHERE id = $2`,
      [staffId, id]
    )
    return reply.send({ success: true })
  })

  // ÖĞRENCİ KENDİ TALEPLERİ (MyRequestsTable)
  fastify.get('/my', async (request, reply) => {
    const userId = 'user_123' // Session
    const { rows } = await pool.query(
      `SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    )

    const formatted = rows.map((r: any) => ({
      id: r.id,
      category: r.category,
      room: r.room,
      priority: r.priority,
      date: new Date(r.created_at).toLocaleDateString('tr-TR'),
      status: r.status,
      desc: r.description,
      rated: r.is_rated,
      rating: r.rating,
    }))
    return reply.send(formatted)
  })
}