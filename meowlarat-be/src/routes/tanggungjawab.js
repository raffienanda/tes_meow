// HAPUS: import { util } from 'zod'; (Sepertinya ini auto-import yang salah)
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util'; // Import promisify yang benar
import { PrismaClient } from '@prisma/client';

// DEFINISI PUMP YANG BENAR:
const pump = promisify(pipeline); 
const prisma = new PrismaClient();

async function tanggungjawabRoutes(fastify, options) {

  // GET: Ambil status form berdasarkan ID Kucing
  fastify.get('/:catId', async (request, reply) => {
    const { catId } = request.params;
    
    const cat = await prisma.cat.findUnique({
      where: { id: parseInt(catId) },
      include: { tanggungjawab: true } 
    });

    if (!cat || !cat.adoptdate) {
      return reply.status(404).send({ message: 'Kucing belum diadopsi atau tidak ditemukan' });
    }

    const today = new Date();
    const adoptDate = new Date(cat.adoptdate);
    const diffTime = Math.abs(today - adoptDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    const report = cat.tanggungjawab[0] || {};

    return {
      catName: cat.nama,
      catImage: cat.img_url,
      adoptDate: cat.adoptdate,
      daysAdopted: diffDays,
      data: report,
      locks: {
        // REVISI LOGIKA LOCK:
        // Hanya kunci jika "BELUM WAKTUNYA". 
        // Jika sudah lewat (expired), biarkan terbuka (false) agar bisa dilihat isinya.
        
        week1: false, // Minggu 1 selalu terbuka sejak awal
        week2: diffDays < 8, // Terkunci sebelum hari ke-8
        week3: diffDays < 15 // Terkunci sebelum hari ke-15
      }
    };
  });

  // POST: Submit Laporan per Minggu
  fastify.post('/:catId/week/:weekNum', async (request, reply) => {
    const { catId, weekNum } = request.params;
    const parts = request.parts();
    
    let updateData = {};
    
    const folderName = 'img-tanggungjawab';
    const uploadDir = path.join(process.cwd(), 'uploads', folderName);
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
      for await (const part of parts) {
        if (part.file) {
          let ext = path.extname(part.filename);
          if (!ext || ext === '') {
            if (part.mimetype === 'image/jpeg') ext = '.jpg';
            else if (part.mimetype === 'image/png') ext = '.png';
            else if (part.mimetype === 'image/webp') ext = '.webp';
            else ext = '.jpg';
          }

          const filename = `tj-${catId}-w${weekNum}-${part.fieldname}-${Date.now()}${ext}`;
          const savePath = path.join(uploadDir, filename);
          
          await pump(part.file, fs.createWriteStream(savePath));

          const dbColumn = `gambar${part.fieldname}${weekNum}`; 
          updateData[dbColumn] = `/uploads/${folderName}/${filename}`;
        }
      }

      const existing = await prisma.tanggungjawab.findFirst({
          where: { id_cat: parseInt(catId) }
      });

      if (existing) {
          await prisma.tanggungjawab.update({
              where: { id: existing.id },
              data: updateData
          });
      } else {
          await prisma.tanggungjawab.create({
              data: {
                  id_cat: parseInt(catId),
                  ...updateData
              }
          });
      }

      return { status: 'success', message: `Laporan Minggu ${weekNum} berhasil disimpan` };

    } catch (error) {
      console.error("Error Upload:", error);
      return reply.code(500).send({ message: 'Gagal menyimpan laporan', error: error.message });
    }
  });
}

export default tanggungjawabRoutes;