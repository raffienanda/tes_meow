import { util } from 'zod';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import utilPromisify from 'util';
const pump = utilPromisify.pipeline;

async function tanggungjawabRoutes(fastify, options) {
  const { prisma } = fastify;

  // GET: Ambil status form berdasarkan ID Kucing
  fastify.get('/:catId', async (request, reply) => {
    const { catId } = request.params;
    
    // 1. Cari data kucing untuk cek tanggal adopsi
    const cat = await prisma.cat.findUnique({
      where: { id: parseInt(catId) },
      include: { tanggungjawab: true } // Ambil data laporan yang sudah ada
    });

    if (!cat || !cat.adoptdate) {
      return reply.status(404).send({ message: 'Kucing belum diadopsi atau tidak ditemukan' });
    }

    // 2. Hitung selisih hari dari tanggal adopsi sampai sekarang
    const today = new Date();
    const adoptDate = new Date(cat.adoptdate);
    const diffTime = Math.abs(today - adoptDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // 3. Cek data yang sudah diisi
    const report = cat.tanggungjawab[0] || {}; // Asumsi 1 kucing 1 record tanggungjawab

    // 4. Tentukan status Lock
    // Minggu 1: Selalu terbuka setelah adopsi
    // Minggu 2: Terbuka jika > 7 hari DAN Minggu 1 sudah diisi (opsional: cek salah satu field)
    // Minggu 3: Terbuka jika > 14 hari DAN Minggu 2 sudah diisi

    const isWeek1Done = report.gambarmakanan1 && report.gambaraktivitas1 && report.gambarkotoran1;
    const isWeek2Done = report.gambarmakanan2 && report.gambaraktivitas2 && report.gambarkotoran2;

    return {
      catName: cat.nama,
      adoptDate: cat.adoptdate,
      daysAdopted: diffDays,
      data: report,
      locks: {
        week1: false, // Selalu terbuka
        week2: diffDays < 7, // Terkunci jika belum 7 hari
        week3: diffDays < 14 // Terkunci jika belum 14 hari
      }
    };
  });

  // POST: Submit Laporan per Minggu
  fastify.post('/:catId/week/:weekNum', async (request, reply) => {
    const { catId, weekNum } = request.params;
    const parts = request.parts();
    
    let updateData = {};

    for await (const part of parts) {
      if (part.file) {
        // Simpan file gambar
        const filename = `tj-${catId}-w${weekNum}-${part.fieldname}-${Date.now()}${path.extname(part.filename)}`;
        const savePath = path.join(process.cwd(), 'uploads', 'img-lapor', filename); // Simpan di folder uploads
        
        // Pastikan folder ada (opsional, biasanya sudah dibuat manual)
        await pump(part.file, fs.createWriteStream(savePath));

        // Mapping fieldname frontend ke database column
        // Frontend kirim field: 'makanan', 'aktivitas', 'kotoran'
        // Database: gambarmakanan1, gambaraktivitas1, dll.
        const dbColumn = `gambar${part.fieldname}${weekNum}`; 
        updateData[dbColumn] = `/uploads/img-lapor/${filename}`;
      }
    }

    // Update atau Create record tanggungjawab
    // Kita cari dulu apakah sudah ada recordnya
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
  });
}

export default tanggungjawabRoutes;