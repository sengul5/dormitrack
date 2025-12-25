import { type FastifyPluginAsync } from 'fastify'
import pool from '@/db/client'

export const staffRoute: FastifyPluginAsync = async (fastify) => {
  // PERSONEL LİSTELE (StaffManager, AvailableStaff)
  fastify.get('/', async (request, reply) => {
    const { rows } = await pool.query(`SELECT * FROM staff ORDER BY id DESC`)
    return reply.send(rows)
  })

  // PERSONEL EKLE
  fastify.post('/', async (request, reply) => {
    const { name, role, phone } = request.body as any
    const img = `https://i.pravatar.cc/150?u=${Date.now()}`

    const { rows } = await pool.query(
      `INSERT INTO staff (name, role, phone, img, status) VALUES ($1, $2, $3, $4, 'offline') RETURNING *`,
      [name, role, phone, img]
    )
    return reply.code(201).send(rows[0])
  })

  // PERSONEL SİL
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await pool.query(`DELETE FROM staff WHERE id = $1`, [id])
    return reply.send({ success: true })
  })

  // PERSONELİN GÖREVLERİ (MyTasks)
  // Mock staff ID: 1 kabul ediyoruz
  fastify.get('/tasks', async (request, reply) => {
    const staffId = 1
    const { rows } = await pool.query(
      `
          SELECT * FROM requests WHERE assigned_staff_id = $1 ORDER BY created_at DESC
       `,
      [staffId]
    )

    const formatted = rows.map((r) => ({
      id: r.id,
      type: 'Request', // Şikayetler tablosu ayrıysa UNION yapmak gerekir
      title: r.category,
      location: r.room,
      priority: r.priority,
      date: new Date(r.created_at).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: r.status,
      desc: r.description,
    }))
    return reply.send(formatted)
  })

  // GÖREV TAMAMLA
  fastify.patch('/tasks/:id/complete', async (request, reply) => {
    const { id } = request.params as { id: string }
    await pool.query(`UPDATE requests SET status = 'Completed' WHERE id = $1`, [id])
    return reply.send({ success: true })
  })
}
