<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <h1>Kebijakan Privasi</h1>
      <div class="content-scroll">
        <p><strong>Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}</strong></p>
        
        <h3>1. Pendahuluan</h3>
        <p>Selamat datang di Meowlarat. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi Anda saat menggunakan layanan kami.</p>

        <h3>2. Informasi yang Kami Kumpulkan</h3>
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar, seperti:</p>
        <ul>
          <li>Nama Lengkap</li>
          <li>Username</li>
          <li>Alamat Email</li>
          <li>Nomor Telepon</li>
        </ul>

        <h3>3. Penggunaan Informasi</h3>
        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
        <ul>
          <li>Menyediakan dan memelihara layanan kami.</li>
          <li>Menghubungi Anda terkait akun atau pembaruan layanan.</li>
          <li>Meningkatkan pengalaman pengguna di platform kami.</li>
        </ul>

        <h3>4. Keamanan Data</h3>
        <p>Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda dari akses yang tidak sah, namun harap diingat bahwa tidak ada metode transmisi internet yang 100% aman.</p>

        <h3>5. Hubungi Kami</h3>
        <p>Jika Anda memiliki pertanyaan tentang kebijakan ini, silakan hubungi kami melalui fitur "Lapor" atau email ke support@meowlarat.com.</p>
      </div>

      <div class="action-area">
        <router-link to="/daftar" class="back-btn">Kembali ke Pendaftaran</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fdfdf0; /* Warna background senada */
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.privacy-container {
  background-color: #ffffe9;
  width: 800px;
  max-width: 100%;
  height: 80vh;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #555;
}

p, li {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
}

ul {
  margin-left: 20px;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  border: 1px solid #f2f2c2;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
}

/* Scrollbar styling */
.content-scroll::-webkit-scrollbar {
  width: 8px;
}
.content-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.content-scroll::-webkit-scrollbar-thumb {
  background: #e9e9c0;
  border-radius: 4px;
}
.content-scroll::-webkit-scrollbar-thumb:hover {
  background: #d4d4a0;
}

.action-area {
  margin-top: 20px;
  text-align: center;
}

.back-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #e9e9c0;
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.3s;
}

.back-btn:hover {
  background-color: #dedeb0;
}

@media (max-width: 768px) {
  .privacy-container {
    width: 100%;
    height: 90vh;
    padding: 20px;
  }
}
</style>