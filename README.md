
````markdown
# 🐱 Meowlarat - Platform Adopsi & Perawatan Kucing

Selamat datang di repositori **Meowlarat**! Aplikasi web ini membantu menghubungkan pecinta kucing dengan shelter, menyediakan informasi perawatan (Catpedia), dan fitur pelaporan kucing terlantar.

Proyek ini terdiri dari dua bagian utama:
1.  **Backend (`meowlarat-be`):** Server API menggunakan Node.js & Fastify.
2.  **Frontend (`meowlarat-fe`):** Tampilan User Interface menggunakan Vue.js & Vite.

---

## 📋 Prasyarat (Wajib Install)

Sebelum memulai, pastikan komputer kamu sudah terinstal software berikut dengan versi yang sesuai:

1.  **Node.js** (Versi Terbaru / v20+)
    * Web ini membutuhkan Node.js versi `^20.19.0` atau `>=22.12.0`.
    * [Download Node.js di sini](https://nodejs.org/)
2.  **Git** (Untuk clone repository)
    * [Download Git di sini](https://git-scm.com/)
3.  **MySQL Database**
    * Pastikan service MySQL (lewat XAMPP/Laragon/Docker) sudah berjalan.

---

## 🚀 Cara Instalasi (Step-by-Step)

Ikuti langkah-langkah ini dari awal sampai akhir agar web berjalan lancar.

### 1. Clone Repository
Download source code ke komputer kamu:

```bash
git clone [https://github.com/username-kamu/tes_meow.git](https://github.com/username-kamu/tes_meow.git)
cd tes_meow
````

-----

### 2\. Setup Backend (Server)

Masuk ke folder backend dan install library pendukung.

```bash
cd meowlarat-be
```

**a. Install Dependencies**
Jalankan perintah ini untuk menginstall seluruh library backend (Fastify, Prisma, Nodemailer, Zod, dll):

```bash
npm install
```

**b. Konfigurasi Environment (.env)**
Buat file baru bernama `.env` di dalam folder `meowlarat-be`, lalu copy kode di bawah ini (sesuaikan password database kamu):

```env
# Konfigurasi Server
PORT=3000

# Konfigurasi Database (Ganti 'password' dengan password mysql kamu, kosongkan jika pakai XAMPP default)
DATABASE_URL="mysql://root:@localhost:3306/db_meowlarat"

# Keamanan
JWT_SECRET="rahasia_super_aman_meowlarat_123"

# Konfigurasi Email (Opsional, untuk fitur lupa password/notifikasi)
MAIL_USER="email_kamu@gmail.com"
MAIL_PASS="password_aplikasi_google_kamu"
```

**c. Setup Database**
Kita akan membuat tabel database secara otomatis menggunakan Prisma:

```bash
# 1. Membuat tabel di database MySQL
npx prisma db push

# 2. Mengisi data awal (Seeding data dummy)
npx prisma db seed
```

**d. Jalankan Server**

```bash
npm run dev
```

*Terminal akan menampilkan: `Server berjalan di port 3000`.*

-----

### 3\. Setup Frontend (Tampilan Web)

Buka **terminal baru** (jangan matikan terminal backend), lalu masuk ke folder frontend.

```bash
cd meowlarat-fe
```

**a. Install Dependencies**
Jalankan perintah ini untuk menginstall seluruh library frontend (Vue, Vite, Leaflet/Peta, Axios, dll):

```bash
npm install
```

**b. Jalankan Website**

```bash
npm run dev
```

*Setelah perintah ini, akan muncul link lokal (biasanya `http://localhost:5173/`). Klik link tersebut untuk membuka web Meowlarat.*

-----

## 📦 Daftar Library Utama

Saat kamu menjalankan `npm install`, library berikut ini otomatis terpasang:

**Frontend (`meowlarat-fe`):**

  * **Vue.js (v3)**: Framework utama aplikasi.
  * **Vite**: Tools untuk menjalankan web dengan cepat.
  * **Leaflet**: Untuk menampilkan peta (Maps).
  * **Axios**: Untuk mengambil data dari Backend.
  * **Vue Router**: Untuk navigasi antar halaman.
  * **JWT Decode**: Untuk membaca data login user.

**Backend (`meowlarat-be`):**

  * **Fastify**: Framework server yang cepat.
  * **Prisma**: Untuk mengelola database MySQL.
  * **Nodemailer**: Untuk fitur pengiriman email.
  * **Zod**: Untuk validasi data input.
  * **Bcryptjs**: Untuk enkripsi password.
  * **@fastify/jwt & multipart**: Plugin login dan upload file.

-----

## ❓ Troubleshooting (Jika Error)

1.  **Error `node version incompatible`**:
      * Cek versi node kamu dengan `node -v`. Pastikan versinya 20 atau lebih baru.
2.  **Error Database Connection**:
      * Cek file `.env` di backend. Pastikan username/password MySQL benar dan XAMPP sudah di-start.
3.  **Peta tidak muncul**:
      * Pastikan koneksi internet lancar karena Leaflet mengambil data peta secara online.

-----

Dibuat dengan 💖 oleh Tim Meowlarat.

```

