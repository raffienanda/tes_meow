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
    const existingUser = await prisma.user.findFirst({
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
      const newUser = await prisma.user.create({
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
    const user = await prisma.user.findUnique({
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
}

export default authRoutes;