import { type FastifyPluginAsync } from 'fastify'
import pool from '@/db/client'

export const dashboardRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/stats', async (request, reply) => {
    const studentsRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'student'`) // User tablosu varsa
    const staffRes = await pool.query(`SELECT COUNT(*) FROM staff`)

    // Basit bir JSON dönüyoruz, StatsRow bunu kullanacak
    return reply.send({
      students: 842, // Mock veya gerçek count
      staff: staffRes.rows[0].count,
      managers: 14,
    })
  })
}
