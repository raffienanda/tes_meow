// src/routes/forum.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function forumRoutes(fastify, options) {

  // GET THREADS (Ambil Data)
  fastify.get('/', async (request, reply) => {
    try {
      const { category } = request.query;
      console.log(`📥 Request Forum Kategori: ${category || 'Semua'}`);

      const whereClause = category ? { category: category } : {};

      const threads = await prisma.thread.findMany({
        where: whereClause,
        include: {
          user: { select: { nama: true, img_url: true } }
        }
      });
      
      return threads;
    } catch (error) {
      console.error("❌ ERROR GET FORUM:", error);
      reply.code(500).send(error);
    }
  });

  // BUAT THREAD BARU (POST)
  fastify.post('/', {
    onRequest: [async (request) => await request.jwtVerify()]
  }, async (request, reply) => {
    try {
      // ⚠️ PERUBAHAN DI SINI: Gunakan 'title' bukan 'nama'
      const { title, category, teks } = request.body; 
      const username = request.user.username;

      const newThread = await prisma.thread.create({
        data: {
          title,     // Sesuai kolom database kamu
          category,
          teks,
          username
        }
      });

      return newThread;
    } catch (error) {
      console.error("❌ ERROR POST FORUM:", error);
      reply.code(500).send(error);
    }
  });
}

export default forumRoutes;