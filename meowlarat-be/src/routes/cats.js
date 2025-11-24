import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function catRoutes(fastify, options) {
  
  // GET SEMUA KUCING (Yang belum diadopsi)
  fastify.get('/', async (request, reply) => {
    try {
      const cats = await prisma.cat.findMany({
        where: { 
          // PERBAIKAN: Gunakan huruf kecil 'isadopted' sesuai schema.prisma
          // Pastikan nilainya boolean false (tanpa kutip)
          isAdopted: false 
        }, 
        orderBy: { id: 'desc' }
      });
      return cats;
    } catch (error) {
      fastify.log.error(error); // Log error agar muncul di terminal
      return reply.code(500).send({ message: 'Gagal mengambil data kucing', error: error.message });
    }
  });

  // TAMBAH KUCING BARU
  fastify.post('/', async (request, reply) => {
    // Ambil data dari request body
    const { nama, age, gender, ras, karakteristik, img_url, isVaccinated } = request.body;
    
    // Konversi isVaccinated ke boolean (karena dari form-data biasanya string "true"/"false")
    // Jika user mengirim checkbox/radio, pastikan handling-nya benar.
    // Di sini kita asumsikan inputan bisa string "true" atau boolean true.
    const isVaccinatedBool = String(isVaccinated).toLowerCase() === 'true';

    try {
      const newCat = await prisma.cat.create({
        data: {
          nama,
          age,
          gender,
          ras,
          karakteristik,
          img_url,
          // PERBAIKAN: Nama field harus huruf kecil sesuai schema.prisma
          isVaccinated: isVaccinatedBool, 
          isAdopted: false // Default false saat dibuat
        }
      });
      return newCat;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal menambah kucing', error: error.message });
    }
  });

  // GET DETAIL KUCING
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const cat = await prisma.cat.findUnique({
        where: { id: Number(id) }
      });
      
      if (!cat) {
        return reply.code(404).send({ message: 'Kucing tidak ditemukan' });
      }
      return cat;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Terjadi kesalahan server' });
    }
  });
}

export default catRoutes;