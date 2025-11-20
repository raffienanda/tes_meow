// src/routes/forum.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function forumRoutes(fastify, options) {

  // GET THREADS (Bisa filter by category)
  fastify.get('/', async (request, reply) => {
    const { category } = request.query;
    const whereClause = category ? { category: category } : {};

    const threads = await prisma.thread.findMany({
      where: whereClause,
      include: {
        user: { select: { nama: true, img_url: true } } // Ambil info pembuat thread
      }
    });
    return threads;
  });

  // BUAT THREAD BARU (Perlu Login -> Pakai JWT)
  fastify.post('/', {
    onRequest: [async (request) => await request.jwtVerify()] // Middleware Cek Login
  }, async (request, reply) => {
    const { nama, category, teks } = request.body;
    const username = request.user.username; // Didapat dari token login

    const newThread = await prisma.thread.create({
      data: {
        nama,      // Judul
        category,
        teks,      // Isi
        username   // Foreign Key ke User
      }
    });

    return newThread;
  });
}

export default forumRoutes;