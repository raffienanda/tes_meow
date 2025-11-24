import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function catRoutes(fastify, options) {
  
  // 1. GET SEMUA KUCING AVAILABLE (Belum diadopsi)
  fastify.get('/', async (request, reply) => {
    try {
      const cats = await prisma.cat.findMany({
        where: { isAdopted: false }, 
        orderBy: { id: 'desc' }
      });
      return cats;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mengambil data', error: error.message });
    }
  });

  // 2. GET LIST "VERIFIKASI ADOPSI" (Pending)
  // Kriteria: isAdopted = true DAN adoptdate = null
  fastify.get('/pending/:username', async (request, reply) => {
    const { username } = request.params;
    try {
      const pendingCats = await prisma.cat.findMany({
        where: { 
          isAdopted: true,
          adopter: username,
          adoptdate: null // Penting: Tanggal masih kosong
        },
        orderBy: { id: 'desc' }
      });
      return pendingCats;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mengambil data pending', error: error.message });
    }
  });

  // 3. GET LIST "SEJARAH ADOPSI" (Selesai)
  // Kriteria: isAdopted = true DAN adoptdate = TIDAK null
  fastify.get('/history/:username', async (request, reply) => {
    const { username } = request.params;
    try {
      const historyCats = await prisma.cat.findMany({
        where: { 
          isAdopted: true,
          adopter: username,
          adoptdate: { not: null } // Penting: Tanggal sudah terisi
        },
        orderBy: { adoptdate: 'desc' }
      });
      return historyCats;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mengambil history', error: error.message });
    }
  });

  // 4. GET DETAIL KUCING
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const cat = await prisma.cat.findUnique({ where: { id: Number(id) } });
      if (!cat) return reply.code(404).send({ message: 'Kucing tidak ditemukan' });
      return cat;
    } catch (error) {
      return reply.code(500).send({ message: 'Error server' });
    }
  });

  // 5. TAMBAH KUCING BARU
  fastify.post('/', async (request, reply) => {
    const { nama, age, gender, ras, karakteristik, img_url, isVaccinated } = request.body;
    const isVaccinatedBool = String(isVaccinated).toLowerCase() === 'true';

    try {
      const newCat = await prisma.cat.create({
        data: {
          nama, age, gender, ras, karakteristik, img_url,
          isVaccinated: isVaccinatedBool, 
          isAdopted: false
        }
      });
      return newCat;
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal menambah kucing', error: error.message });
    }
  });

  // 6. USER REQUEST ADOPSI (Masuk ke Verifikasi)
  fastify.put('/adopt/:id', async (request, reply) => {
    const { id } = request.params;
    const { username } = request.body;

    if (!username) return reply.code(400).send({ message: 'Username wajib diisi' });

    try {
      const currentCat = await prisma.cat.findUnique({ where: { id: Number(id) } });
      if (!currentCat) return reply.code(404).send({ message: 'Kucing tidak ditemukan' });
      if (currentCat.isAdopted) return reply.code(400).send({ message: 'Kucing ini sudah diadopsi/pending' });

      const updatedCat = await prisma.cat.update({
        where: { id: Number(id) },
        data: {
          isAdopted: true,     // Tandai sudah diambil
          adopter: username,   // Siapa yang ambil
          adoptdate: null      // JANGAN ISI TANGGAL DULU (Menunggu Admin)
        }
      });

      return { message: 'Permintaan adopsi dikirim. Menunggu verifikasi admin.', data: updatedCat };
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal memproses adopsi', error: error.message });
    }
  });

  // 7. ADMIN VERIFIKASI ADOPSI (Input Tanggal)
  // Endpoint ini nanti dipakai di halaman Admin untuk menyetujui
  fastify.put('/verify/:id', async (request, reply) => {
    const { id } = request.params;
    // Bisa kirim tanggal custom dari body, atau pakai tanggal sekarang
    const { date } = request.body; 

    try {
      const updatedCat = await prisma.cat.update({
        where: { id: Number(id) },
        data: {
          adoptdate: date ? new Date(date) : new Date() // Isi tanggal, status jadi resmi History
        }
      });
      return { message: 'Adopsi diverifikasi', data: updatedCat };
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal verifikasi', error: error.message });
    }
  });
}

export default catRoutes;