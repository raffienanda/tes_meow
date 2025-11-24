// src/routes/auth.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function authRoutes(fastify, options) {
  
  // REGISTER USER
  fastify.post('/register', async (request, reply) => {
    const { username, email, nama, phone, password, bio, img_url } = request.body;

    // 1. Validasi input
    if (!username || !email || !password || !nama) {
      return reply.code(400).send({ message: 'Username, Email, Nama, dan Password wajib diisi' });
    }

    // 2. Cek apakah username/email sudah dipakai
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return reply.code(400).send({ message: 'Username atau Email sudah terdaftar!' });
    }

    // 3. Hash password (enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // 4. Simpan ke database
      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          nama,
          phone: phone || "-",
          password: hashedPassword,
          bio: bio || "-",
          img_url: img_url || "default.png"
        }
      });
      
      return { message: 'Registrasi berhasil', user: newUser.username };

    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ message: 'Gagal mendaftar user', error: error.message });
    }
  });

  // LOGIN USER
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    // 1. Cari user berdasarkan username
    const user = await prisma.users.findUnique({
      where: { username: username }
    });

    if (!user) {
      return reply.code(401).send({ message: 'Username atau password salah' });
    }

    // 2. Cek password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(401).send({ message: 'Username atau password salah' });
    }

    // 3. Buat Token JWT
    const token = fastify.jwt.sign({ username: user.username, email: user.email, nama: user.nama });

    return { 
      message: 'Login berhasil', 
      token, 
      user: { 
        username: user.username, 
        nama: user.nama, 
        img_url: user.img_url 
      } 
    };
  });

  fastify.get('/me', {
    onRequest: [async (request) => await request.jwtVerify()] // Middleware cek token login
  }, async (request, reply) => {
    try {
      const username = request.user.username;

      const user = await prisma.user.findUnique({
        where: { username: username },
        include: {
          adoptedCats: true // Mengambil data relasi kucing yang diadopsi
        }
      });

      if (!user) {
        return reply.code(404).send({ message: 'User tidak ditemukan' });
      }

      // Hapus password dari response agar aman
      delete user.password;
      
      return user;
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal mengambil profil', error: error.message });
    }
  });

  // UPDATE PROFIL USER (Nama & Bio)
  fastify.put('/me', {
    onRequest: [async (request) => await request.jwtVerify()]
  }, async (request, reply) => {
    const { nama, bio } = request.body;
    const username = request.user.username;

    try {
      const updatedUser = await prisma.users.update({
        where: { username: username },
        data: {
          nama: nama,
          bio: bio,
          // Catatan: Untuk img_url (upload file) memerlukan penanganan khusus (multipart), 
          // saat ini kita update teks dulu.
        }
      });

      return { message: 'Profil berhasil diupdate', user: updatedUser };
    } catch (error) {
      return reply.code(500).send({ message: 'Gagal update profil', error: error.message });
    }
  });
}

export default authRoutes;