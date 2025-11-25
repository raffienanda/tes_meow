<template>
  <div class="form-page">
    <NavbarLogin v-if="isLoggedIn" />
    <Navbar v-else />

    <section class="container">
      <h1 class="title">Form Pemilik Bertanggungjawab</h1>
      <p class="subtitle">
        Ayo menjadi owner yang baik dengan mengisi form di bawah ini.
      </p>

      <div v-if="loading" class="loading-text">Memuat data...</div>

      <div v-else>
        <div class="profile-card">
          <h2>Profil Kucing</h2>
          <div class="profile-content">
            <img src="../assets/img/cat-donasi.png" alt="Foto Kucing" class="cat-photo" />
            <div class="cat-info">
              <p><strong>Nama :</strong> {{ catData.catName }}</p>
              <p><strong>Tanggal Adopsi :</strong> {{ formatDate(catData.adoptDate) }}</p>
              <p><strong>Lama Adopsi :</strong> {{ catData.daysAdopted }} Hari</p>
            </div>
          </div>
        </div>

        <div 
          v-for="week in 3" 
          :key="week" 
          class="week-card" 
          :class="{ locked: isLocked(week) }"
        >
          <h3>Minggu Ke-{{ week }}</h3>
          
          <div v-if="isLocked(week)" class="week-content-locked">
             <div class="lock-icon">🔒</div>
             <p>Form ini akan terbuka pada hari ke-{{ (week - 1) * 7 }} setelah adopsi.</p>
          </div>

          <div v-else class="week-content">
            <div class="week-item">
              <h4>Makanan:</h4>
              <img :src="getPreview(week, 'makanan') || '../assets/img/makanan.png'" alt="Makanan" />
              <input type="file" @change="handleFileChange($event, week, 'makanan')" />
            </div>
            <div class="week-item">
              <h4>Aktivitas:</h4>
              <img :src="getPreview(week, 'aktivitas') || '../assets/img/aktivitas.png'" alt="Aktivitas" />
              <input type="file" @change="handleFileChange($event, week, 'aktivitas')" />
            </div>
            <div class="week-item">
              <h4>Kotoran:</h4>
              <img :src="getPreview(week, 'kotoran') || '../assets/img/kotoran.png'" alt="Kotoran" />
              <input type="file" @change="handleFileChange($event, week, 'kotoran')" />
            </div>
          </div>

          <button 
            v-if="!isLocked(week)" 
            class="submit-btn" 
            @click="submitForm(week)"
            :disabled="uploading"
          >
            {{ uploading ? 'Mengirim...' : 'Submit Minggu ' + week }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import NavbarLogin from '../components/NavbarLogin.vue';

const isLoggedIn = ref(false);

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
  }
});

const route = useRoute();
// Kita ambil ID kucing dari query parameter, misalnya /form?catId=1
// Atau bisa di-hardcode dulu untuk tes jika belum ada sistem passing ID
const catId = route.query.catId || 1; 

const catData = ref({});
const loading = ref(true);
const uploading = ref(false);

// State untuk menyimpan file yang akan diupload
const files = ref({
  week1: { makanan: null, aktivitas: null, kotoran: null },
  week2: { makanan: null, aktivitas: null, kotoran: null },
  week3: { makanan: null, aktivitas: null, kotoran: null },
});

// State untuk preview gambar (URL)
const previews = ref({
  week1: { makanan: null, aktivitas: null, kotoran: null },
  week2: { makanan: null, aktivitas: null, kotoran: null },
  week3: { makanan: null, aktivitas: null, kotoran: null },
});

const baseUrl = 'http://localhost:3000'; // Sesuaikan port backend

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
};

// Cek apakah minggu tersebut terkunci
const isLocked = (week) => {
  if (!catData.value.locks) return true;
  if (week === 1) return catData.value.locks.week1;
  if (week === 2) return catData.value.locks.week2;
  if (week === 3) return catData.value.locks.week3;
  return true;
};

// Handle Preview Gambar sebelum upload dan mengambil data dr backend
const getPreview = (week, type) => {
  // 1. Cek apakah ada preview lokal (user baru pilih file)
  if (previews.value[`week${week}`][type]) {
    return previews.value[`week${week}`][type];
  }
  // 2. Cek apakah sudah ada data di database
  const dbKey = `gambar${type}${week}`; // cth: gambarmakanan1
  if (catData.value.data && catData.value.data[dbKey]) {
    return `${baseUrl}${catData.value.data[dbKey]}`;
  }
  return null;
};

const handleFileChange = (event, week, type) => {
  const file = event.target.files[0];
  if (file) {
    files.value[`week${week}`][type] = file;
    previews.value[`week${week}`][type] = URL.createObjectURL(file);
  }
};

// Fetch Data saat halaman dibuka
onMounted(async () => {
  try {
    // Pastikan catId valid
    const response = await axios.get(`${baseUrl}/api/tanggungjawab/${catId}`);
    catData.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    alert("Gagal memuat data kucing. Pastikan ID benar.");
  } finally {
    loading.value = false;
  }
});

// Fungsi Submit
const submitForm = async (week) => {
  const currentFiles = files.value[`week${week}`];
  
  // Validasi sederhana: minimal satu file harus dipilih jika belum ada di DB
  if (!currentFiles.makanan && !currentFiles.aktivitas && !currentFiles.kotoran) {
    // Cek apakah sudah ada di DB (jika edit) - logic sederhana
    // alert("Mohon pilih foto untuk diupload!");
    // return;
  }

  uploading.value = true;
  const formData = new FormData();
  
  if (currentFiles.makanan) formData.append("makanan", currentFiles.makanan);
  if (currentFiles.aktivitas) formData.append("aktivitas", currentFiles.aktivitas);
  if (currentFiles.kotoran) formData.append("kotoran", currentFiles.kotoran);

  try {
    await axios.post(`${baseUrl}/api/tanggungjawab/${catId}/week/${week}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(`Laporan Minggu ${week} Berhasil Disimpan!`);
    // Refresh data agar status terbaru muncul
    const response = await axios.get(`${baseUrl}/api/tanggungjawab/${catId}`);
    catData.value = response.data;
  } catch (error) {
    console.error(error);
    alert("Gagal mengupload laporan.");
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.form-page {
  font-family: "Poppins", sans-serif;
  background-color: #0e75b6;
  min-height: 100vh;
  color: #fff;
  padding-bottom: 3rem;
  background-image: url('../assets/img/background.png');
}

.container {
 width: 90%;
 max-width: 950px;
 margin: auto;
 padding-top: 2rem;
}

.title {
 font-size: 2rem;
 font-weight: 700;
 text-align: center;
}

.subtitle {
 text-align: center;
 margin-bottom: 2rem;
 font-weight: 400;
 color: #dceeff;
}

/* Profil Kucing */
.profile-card {
 background: #e7f3ff;
 color: #000;
 border-radius: 15px;
 padding: 1.5rem;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
 margin-bottom: 2rem;
}

.profile-content {
 display: flex;
 align-items: center;
 gap: 1rem;
}

.cat-photo {
 width: 120px;
 height: 120px;
 border-radius: 12px;
 object-fit: cover;
}

.cat-info p {
 margin: 5px 0;
 font-size: 0.95rem;
}

/* Week Card */
.week-card {
 background: #e7f3ff;
 color: #000;
 border-radius: 15px;
 padding: 1rem; 
 margin-bottom: 1.5rem; 
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.week-card.locked {
 filter: grayscale(100%) brightness(0.7);
 pointer-events: none;
}

/* 🔹 TIGA KOLOM SEJAJAR (Desktop) */
.week-content {
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
 gap: 1rem;
 margin-bottom: 1rem;
}

.week-item {
 flex: 1;
 background: white;
 border-radius: 10px;
 padding: 0.5rem; 
 text-align: center;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
}

.week-item img,
.week-item .placeholder {
  width: 100%;
  height: 260px;
  border-radius: 10px;
  object-fit: cover;
}

.week-item input {
 margin-top: 0.5rem;
 width: 100%;
}

.submit-btn {
 width: 100%;
 background: #f3f7a5;
 color: #000;
 font-weight: 600;
 border: none;
 border-radius: 10px;
 padding: 0.6rem;
 cursor: pointer;
 transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
 background: #e9ec8a;
}

.lock-icon {
 font-size: 2.5rem;
 margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  /* PERBAIKAN UMUM KONTAINER */
  .container {
      width: 95%; 
      padding: 0 10px;
      text-align: center; 
  }
  
  /* PERBAIKAN PROFILE CARD */
 .profile-content {
  flex-direction: column;
    align-items: center;
  text-align: center;
 }
  
  .cat-info {
      text-align: center; 
  }
  
 .cat-photo {
  width: 100px;
  height: 100px;
 }

 .title {
  font-size: 1.6rem;
 }
  
  /* ❗ PERBAIKAN JIKA JUDUL LEBIH NAIK */
  .week-card h3 {
      font-size: 1.3rem;
      margin-top: 0;
      margin-bottom: 0.3rem; /* DIUBAH */
  }
  
 .week-content {
  flex-direction: column;
    align-items: center; 
 }
  
  .week-item {
      max-width: 300px; 
      margin: 0 auto 5px; /* DIUBAH */
      padding: 0.4rem; /* DIUBAH */
  }

  .week-item h4 {
      font-size: 0.9rem;
      margin-top: 0.2rem; /* DIUBAH */
      margin-bottom: 0.2rem; /* DIUBAH */
  }

 .week-item img,
 .week-item .placeholder {
  height: 0px; 
 }

  .week-item input {
      margin-top: 0.3rem; 
      font-size: 0.9rem;
  }

  .submit-btn {
      padding: 0.5rem; 
      font-size: 0.9rem;
  }
  
  .lock-icon {
      font-size: 2rem; 
      margin-top: 1.5rem; 
  }
}

/* Tambahan: Pastikan input file kecil di mobile */
@media (max-width: 480px) {
    .week-item input[type="file"] {
        font-size: 0.75rem; 
    }
}
</style>