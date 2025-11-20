// src/server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import formbody from '@fastify/formbody';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import catRoutes from './routes/cats.js';
import forumRoutes from './routes/forum.js';

dotenv.config();

const fastify = Fastify({ logger: true });

// Registrasi Plugin
fastify.register(cors, { 
  origin: true // Mengizinkan frontend (localhost:5173) mengakses backend
});
fastify.register(formbody); // Agar bisa baca data dari form
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'rahasia_super_aman_meow' // Ganti dengan secret yang kuat di .env
});

// Registrasi Routes (Endpoint URL)
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(catRoutes, { prefix: '/api/cats' });
fastify.register(forumRoutes, { prefix: '/api/forum' });

// Endpoint Cek Server
fastify.get('/', async (request, reply) => {
  return { status: 'OK', message: 'MeowLarat Backend is Running!' };
});

// Jalankan Server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server berjalan di http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();