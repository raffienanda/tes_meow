// meowlarat-be/src/routes/artikel.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A small palette mapping categories -> colors. Extend as needed.
const CATEGORY_COLORS = {
  kesehatan: '#e74c3c',
  perawatan: '#3498db',
  nutrisi: '#27ae60',
  adopsi: '#f39c12',
  edukasi: '#9b59b6',
  default: '#95a5a6'
};

function getColorForCategory(cat) {
  if (!cat) return CATEGORY_COLORS.default;
  const key = cat.toLowerCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
}

// Helper sederhana untuk menghapus tag HTML
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  // Regex ini akan mencari string apa saja yang diawali < dan diakhiri > lalu menghapusnya
  return html.replace(/<[^>]+>/g, ''); 
}

async function artikelRoutes(fastify, options) {
  // GET /artikel
  // Query params: ?q=search&page=1&limit=10&category=...
  fastify.get('/', async (request, reply) => {
    try {
      const { q, page = 1, limit = 12, category } = request.query || {};
      const take = Number(limit) || 12;
      const skip = (Math.max(Number(page), 1) - 1) * take;

      const where = {
        AND: [
          category ? { category: { equals: category } } : {},
          q
            ? {
                OR: [
                  { nama: { contains: String(q), mode: 'insensitive' } },
                  { teks: { contains: String(q), mode: 'insensitive' } }
                ]
              }
            : {}
        ]
      };

      const [items, total] = await Promise.all([
        prisma.artikel.findMany({
          where,
          orderBy: { id: 'desc' },
          take,
          skip
        }),
        prisma.artikel.count({ where })
      ]);

      // Only return DB fields + computed color + CLEAN teks snippet for list
      const data = items.map(a => {
        // 1. Bersihkan HTML tag terlebih dahulu
        const cleanText = stripHtml(a.teks);

        return {
          id: a.id,
          img_url: a.img_url,
          nama: a.nama,
          category: a.category,
          // 2. Buat snippet dari teks yang sudah bersih
          teks_snippet:
            cleanText.length > 220
              ? cleanText.slice(0, 220).trim() + '...'
              : cleanText,
          color: getColorForCategory(a.category)
        };
      });

      return { data, meta: { total, page: Number(page), limit: take } };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mengambil daftar artikel', error: error.message });
    }
  });

  // GET /artikel/:id  <-- slug uses the article id (as requested)
  fastify.get('/:id', async (request, reply) => {
    try {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) return reply.code(400).send({ message: 'ID artikel tidak valid' });

      const artikel = await prisma.artikel.findUnique({ where: { id } });
      if (!artikel) return reply.code(404).send({ message: 'Artikel tidak ditemukan' });

      // Untuk detail artikel, kita TETAP kirim HTML aslinya agar frontend bisa render formattingnya
      const response = {
        id: artikel.id,
        img_url: artikel.img_url,
        nama: artikel.nama,
        category: artikel.category,
        teks: artikel.teks, // Full HTML dikirim untuk halaman detail
        color: getColorForCategory(artikel.category)
      };

      return response;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mengambil artikel', error: error.message });
    }
  });

  // HAPUS!! GAJADII!!! POST /artikel (admin)
  fastify.post('/', async (request, reply) => {
    try {
      const { img_url, nama, category, teks } = request.body || {};

      if (!nama || !category || !teks) {
        return reply.code(400).send({ message: 'nama, category, dan teks wajib diisi' });
      }

      const created = await prisma.artikel.create({
        data: { img_url: img_url || '', nama, category, teks }
      });

      return reply.code(201).send({
        id: created.id,
        img_url: created.img_url,
        nama: created.nama,
        category: created.category,
        teks: created.teks,
        color: getColorForCategory(created.category)
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal membuat artikel', error: error.message });
    }
  });
}

export default artikelRoutes;