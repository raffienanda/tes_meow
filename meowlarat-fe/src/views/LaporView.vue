<template>
  <div>
    <Navbar />
    <div class="lapor-page">
      <main class="lapor-content">
        <h1 class="page-title">Lapor</h1>
        <p class="page-description">Laporkan kondisi kucing di sekitar Anda, mulai dari kucing hilang, butuh bantuan, kucing liar, hingga adopsi. Dengan laporan ini, kucing bisa lebih cepat mendapat perhatian dan pertolongan.</p>

        <form @submit.prevent="submitReport" class="cat-report-form">
          <div class="form-section">
            <h3 class="section-title">Jenis laporan</h3>
            <div class="report-type-options">
              <label 
                v-for="type in reportTypes" 
                :key="type" 
                class="report-type-label" 
                :class="{ 'selected': reportData.jenis_laporan === type }"
              >
                <input 
                  type="radio" 
                  name="jenis_laporan" 
                  :value="type" 
                  v-model="reportData.jenis_laporan"
                  class="sr-only"
                >
                {{ type }}
              </label>
            </div>
          </div>

          <div class="form-section" >
            <label for="lokasi_kucing">Lokasi kucing</label>
            <input type="text" id="lokasi_kucing" v-model="reportData.lokasi_kucing" required>
          </div>

          <div class="form-section">
            <label for="deskripsi_singkat">Deskripsi singkat (warna, ukuran, ciri khas)</label>
            <textarea id="deskripsi_singkat" rows="3" v-model="reportData.deskripsi_singkat" required></textarea>
          </div>

          <div class="form-section file-upload-section">
            <label for="upload_foto">Upload foto</label>
            <div class="file-upload-box">
              <input 
                type="file" 
                id="upload_foto" 
                accept="image/*"
                @change="handleFileUpload"
                class="sr-only"
              >
              <label for="upload_foto" class="choose-file-btn">
                Choose file
              </label>
              
              <p v-if="reportData.foto_file" class="file-name">
                File terpilih: **{{ reportData.foto_file.name }}**
              </p>
            </div>
          </div>

          <div class="form-section">
            <label for="catatan_tambahan">Catatan tambahan (opsional)</label>
            <textarea id="catatan_tambahan" rows="2" v-model="reportData.catatan_tambahan"></textarea>
          </div>

          <div class="submit-section">
            <button type="submit" class="submit-btn">
              Submit
            </button>
          </div>

        </form>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import Navbar from '../components/Navbar.vue'; 

const reportTypes = [
  'kucing hilang', 
  'kucing butuh bantuan', 
  'kucing liar', 
  'kucing adopsi'
];

const reportData = reactive({
  jenis_laporan: 'kucing hilang',
  lokasi_kucing: '',
  deskripsi_singkat: '',
  foto_file: null,
  catatan_tambahan: ''
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    reportData.foto_file = file;
  }
}

function submitReport() {
  console.log('Data yang dikirim:', reportData);
  alert('Laporan berhasil dikirim! (Simulasi)');
}
</script>

<style scoped>
/* --- Pengaturan Global & Halaman --- */
.lapor-page {
  /* background-image: url('/background.png'); */
  background-repeat: repeat;
  min-height: 100vh; 
  padding-bottom: 50px;
}

.lapor-content {
  /* LEBAR KONTEN: Jarak ke tepi layar akan diatur oleh padding: 5vw */
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 5vw 0; /* PENTING: Menggunakan 5vw (5% dari lebar viewport) */
  color: white;
}

/* --- Judul (Menggunakan PX untuk Stabilitas Font) --- */

.page-title {
  font-size: 60px; 
  margin-bottom: 10px;
}

.page-description {
  font-size: 18px; 
  margin-bottom: 30px;
}

/* --- Form Container (Kotak Putih) --- */

.cat-report-form {
  background-color: white; 
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Mencegah kotak putih terlalu lebar di dalam kontainer 1000px */
  max-width: 800px; 
  margin: 0 auto; /* Pusatkan kotak putih di dalam kontainer .lapor-content */
  min-width: 300px; 
}

/* --- Form Sections --- */

.form-section {
  margin-bottom: 25px;
  padding: 15px 20px;
  background-color: #DEF1FF;
  border-radius: 30px;
  border: 2px solid #004c80;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
  
}

.section-title {
  font-size: 1.2em;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #333;
}

.form-section label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #444;
}

input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px; 
  border: 2px solid #004c80;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
}

/* --- Report Type (Radio Buttons) --- */

.report-type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.report-type-label {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 100px; 
  cursor: pointer;
  background-color: white;
  transition: all 0.2s;
  flex-grow: 1; 
  text-align: center;
  font-weight: 500;
  border: 2px solid #004c80;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
}

.report-type-label.selected {
  background-color: #0077c2;
  color: white;
  border-color: #0077c2;
}

/* --- File Upload --- */

.file-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
  
}

.choose-file-btn {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 8px 15px;
  border-radius: 100px;
  cursor: pointer;
  display: inline-block;
  border: 2px solid #004c80;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
}

.drag-text {
  font-size: 0.9em;
  color: #666;
  margin: 5px 0;
}

.file-name {
  margin-top: 10px;
  color: #0077c2;
}

/* --- Submit Button --- */

.submit-section {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  background-color: #005b99;
  color: white;
  padding: 12px 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #004c80;
}

/* --- Accessibility (Hidden Radio) --- */

.sr-only { 
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  
}
</style>