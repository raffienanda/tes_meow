// src/routes/cats.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function catRoutes(fastify, options) {
  
  // GET SEMUA KUCING (Yang belum diadopsi)
  fastify.get('/', async (request, reply) => {
    try {
      const cats = await prisma.cat.findMany({
        where: { isAdopted: 'false' }, // Asumsi 'false' string sesuai desain DB kamu VARCHAR(50)
        orderBy: { id: 'desc' }
      });
      return cats;
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal mengambil data kucing' });
    }
  });

  // TAMBAH KUCING BARU (Misal dari menu Lapor atau Admin)
  fastify.post('/', async (request, reply) => {
    const { nama, age, gender, ras, karakteristik, img_url, isVaccinated } = request.body;
    
    try {
      const newCat = await prisma.cat.create({
        data: {
          nama,
          age,
          gender,
          ras,
          karakteristik,
          img_url,
          isVaccinated: isVaccinated || "Belum",
          isAdopted: "false" // Default belum diadopsi
        }
      });
      return newCat;
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal menambah kucing', error: error.message });
    }
  });

  // GET DETAIL KUCING
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    const cat = await prisma.cat.findUnique({
      where: { id: Number(id) }
    });
    return cat || reply.code(404).send({ message: 'Kucing tidak ditemukan' });
  });
}

export default catRoutes;