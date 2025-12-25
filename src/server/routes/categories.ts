import { type FastifyPluginAsync } from 'fastify'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export const categories: FastifyPluginAsync = async (fastify) => {
  // 1. KATEGORİLERİ LİSTELE (Type'a göre filtreli)
  // GET /api/categories?type=request
  fastify.get('/', async (request, reply) => {
    try {
      const { type } = request.query as { type: 'request' | 'complaint' }

      if (!type) {
        return reply.code(400).send({ message: 'Type query param is required' })
      }

      // NOT: count değerini hesaplamak için requests veya complaints tablolarına bakıyoruz.
      // Eğer tablolar henüz yoksa count'u 0 döndüren basit sorgu çalışır.
      // İlişkiyi 'category' ismi üzerinden kuruyoruz (Frontend yapısına uygun olarak).

      let query = ''

      if (type === 'request') {
        query = `
          SELECT c.*, 
          (SELECT COUNT(*) FROM requests r WHERE r.category = c.name) as count 
          FROM categories c 
          WHERE c.type = 'request' 
          ORDER BY c.id ASC
        `
      } else {
        query = `
          SELECT c.*, 
          (SELECT COUNT(*) FROM complaints cp WHERE cp.category = c.name) as count 
          FROM categories c 
          WHERE c.type = 'complaint' 
          ORDER BY c.id ASC
        `
      }

      const { rows } = await pool.query(query)

      // Frontend formatına uygun mapping
      const formatted = rows.map((row) => ({
        id: row.id,
        name: row.name,
        iconId: row.icon_id,
        count: parseInt(row.count || '0'), // Count string gelebilir, int'e çeviriyoruz
      }))

      return reply.send(formatted)
    } catch (e: any) {
      request.log.error({ msg: 'Get Categories Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 2. YENİ KATEGORİ EKLE
  // POST /api/categories
  fastify.post('/', async (request, reply) => {
    try {
      const { name, iconId, type } = request.body as { name: string; iconId: string; type: string }

      const query = `
        INSERT INTO categories (name, icon_id, type)
        VALUES ($1, $2, $3)
        RETURNING *
      `
      const { rows } = await pool.query(query, [name, iconId, type])

      return reply.code(201).send({
        message: 'Category created',
        data: {
          id: rows[0].id,
          name: rows[0].name,
          iconId: rows[0].icon_id,
          count: 0,
        },
      })
    } catch (e: any) {
      request.log.error({ msg: 'Create Category Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 3. KATEGORİ GÜNCELLE
  // PUT /api/categories/:id
  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { name, iconId } = request.body as { name: string; iconId: string }

      const query = `
        UPDATE categories 
        SET name = $1, icon_id = $2
        WHERE id = $3
        RETURNING *
      `
      const { rows } = await pool.query(query, [name, iconId, id])

      if (rows.length === 0) {
        return reply.code(404).send({ message: 'Category not found' })
      }

      return reply.send({ message: 'Category updated', data: rows[0] })
    } catch (e: any) {
      request.log.error({ msg: 'Update Category Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })

  // 4. KATEGORİ SİL
  // DELETE /api/categories/:id
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const query = `DELETE FROM categories WHERE id = $1 RETURNING id`
      const { rows } = await pool.query(query, [id])

      if (rows.length === 0) {
        return reply.code(404).send({ message: 'Category not found' })
      }

      return reply.send({ message: 'Category deleted', id: rows[0].id })
    } catch (e: any) {
      request.log.error({ msg: 'Delete Category Failed', error: e })
      return reply.code(500).send({ message: 'Failed' })
    }
  })
}
