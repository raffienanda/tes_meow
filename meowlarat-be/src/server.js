// src/server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import catRoutes from './routes/cats.js';
import forumRoutes from './routes/forum.js';
import statsRoutes from './routes/stats.js';
import laporRoutes from './routes/lapor.js'; // Route baru

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// 1. Registrasi Plugin Utama
fastify.register(cors, { origin: true });
fastify.register(formbody);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'rahasia_super_aman_meow'
});

// 2. Registrasi Plugin Upload (Wajib untuk FormData)
fastify.register(multipart);

// 3. Registrasi Folder Static (Agar gambar bisa dibuka di browser)
// Gambar akan disimpan di folder: meowlarat-be/uploads
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/', 
});

// 4. Registrasi Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(catRoutes, { prefix: '/api/cats' });
fastify.register(forumRoutes, { prefix: '/api/forum' });
fastify.register(statsRoutes, { prefix: '/api/stats' });
fastify.register(laporRoutes, { prefix: '/api/lapor' }); // Endpoint: /api/lapor

// Endpoint Cek Server
fastify.get('/', async (request, reply) => {
  return { status: 'OK', message: 'MeowLarat Backend is Running!' };
});

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