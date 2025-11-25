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
            <img 
              :src="getProfileImage(catData.catImage)" 
              alt="Foto Kucing" 
              class="cat-photo" 
            />
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
          :class="{ locked: isLocked(week), expired: isExpired(week) }"
        >
          <h3>Minggu Ke-{{ week }}</h3>
          
          <div v-if="isLocked(week)" class="week-content-locked">
             <div class="lock-icon">🔒</div>
             <p>Form ini akan terbuka pada hari ke-{{ (week - 1) * 7 + 1 }} setelah adopsi.</p>
          </div>

          <div v-else>
            <div v-if="isExpired(week)" class="expired-message">
<<<<<<< HEAD
               Waktu pelaporan sudah habis. Anda hanya dapat melihat data.
=======
              ⚠️ Waktu pelaporan sudah habis. Anda hanya dapat melihat data.
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
            </div>

            <div class="week-content">
              <div class="week-item">
                <h4>Makanan:</h4>
<<<<<<< HEAD
                <img :src="getPreview(week, 'makanan') || defaultMakanan" alt="Makanan"
                  @error="$event.target.src = defaultMakanan" />
                <input type="file" accept="image/*" @change="handleFileChange($event, week, 'makanan')" :disabled="uploading" />
=======
                <img :src="getPreview(week, 'makanan') || defaultMakanan" alt="Makanan" />
                <input 
                  type="file" 
                  @change="handleFileChange($event, week, 'makanan')" 
                  :disabled="isExpired(week)"
                />
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
              </div>
              <div class="week-item">
                <h4>Aktivitas:</h4>
<<<<<<< HEAD
                <img :src="getPreview(week, 'aktivitas') || defaultAktivitas" alt="Aktivitas"
                  @error="$event.target.src = defaultAktivitas" />
                <input type="file" accept="image/*" @change="handleFileChange($event, week, 'aktivitas')" :disabled="uploading" />
=======
                <img :src="getPreview(week, 'aktivitas') || defaultAktivitas" alt="Aktivitas" />
                <input 
                  type="file" 
                  @change="handleFileChange($event, week, 'aktivitas')" 
                  :disabled="isExpired(week)"
                />
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
              </div>
              <div class="week-item">
                <h4>Kotoran:</h4>
<<<<<<< HEAD
                <img :src="getPreview(week, 'kotoran') || defaultKotoran" alt="Kotoran"
                  @error="$event.target.src = defaultKotoran" />
                <input type="file" accept="image/*" @change="handleFileChange($event, week, 'kotoran')" :disabled="uploading" />
=======
                <img :src="getPreview(week, 'kotoran') || defaultKotoran" alt="Kotoran" />
                <input 
                  type="file" 
                  @change="handleFileChange($event, week, 'kotoran')" 
                  :disabled="isExpired(week)"
                />
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
              </div>
            </div>

            <button 
              v-if="!isExpired(week)" 
              class="submit-btn" 
              @click="submitForm(week)"
              :disabled="uploading"
            >
              {{ uploading ? 'Mengirim...' : 'Submit Minggu ' + week }}
            </button>
          </div>
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

import defaultCatImg from '@/assets/img/cat-donasi.png';
import defaultMakanan from '@/assets/img/makanan.png';
import defaultAktivitas from '@/assets/img/aktivitas.png';
import defaultKotoran from '@/assets/img/kotoran.png';

const isLoggedIn = ref(false);
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) isLoggedIn.value = true;
});

const route = useRoute();
const catId = route.query.catId || 1; 
const catData = ref({});
const loading = ref(true);
const uploading = ref(false);
const baseUrl = 'http://localhost:3000';

const files = ref({
  week1: { makanan: null, aktivitas: null, kotoran: null },
  week2: { makanan: null, aktivitas: null, kotoran: null },
  week3: { makanan: null, aktivitas: null, kotoran: null },
});
const previews = ref({
  week1: { makanan: null, aktivitas: null, kotoran: null },
  week2: { makanan: null, aktivitas: null, kotoran: null },
  week3: { makanan: null, aktivitas: null, kotoran: null },
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
};

const getProfileImage = (url) => {
  if (!url || url === "") return defaultCatImg;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
     return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return `${baseUrl}/uploads/img-lapor/${url}`;
};

const getPreview = (week, type) => {
  if (previews.value[`week${week}`][type]) return previews.value[`week${week}`][type];
  
  const dbKey = `gambar${type}${week}`; 
  const url = catData.value.data ? catData.value.data[dbKey] : null;

  if (url && url !== "") {
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads') || url.startsWith('uploads')) {
       return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return `${baseUrl}/uploads/img-tanggungjawab/${url}`;
  }
  return null;
};

// Cek apakah form terkunci karena BELUM waktunya
const isLocked = (week) => {
  if (!catData.value.locks) return true;
  if (week === 1) return catData.value.locks.week1;
  if (week === 2) return catData.value.locks.week2;
  if (week === 3) return catData.value.locks.week3;
  return true;
};

// BARU: Cek apakah form sudah lewat waktunya (Expired)
const isExpired = (week) => {
  const days = catData.value.daysAdopted || 0;
  // Week 1 habis setelah hari ke-7
  if (week === 1) return days > 7;
  // Week 2 habis setelah hari ke-14
  if (week === 2) return days > 14;
  // Week 3 habis setelah hari ke-21
  if (week === 3) return days > 21;
  return false;
};

const handleFileChange = (event, week, type) => {
  const file = event.target.files[0];
  if (file) {
    files.value[`week${week}`][type] = file;
    previews.value[`week${week}`][type] = URL.createObjectURL(file);
  }
};

onMounted(async () => {
  if (!catId) { alert("ID Kucing tidak ditemukan!"); return; }
  try {
    const response = await axios.get(`${baseUrl}/api/tanggungjawab/${catId}`);
    catData.value = response.data;
  } catch (error) {
    console.error(error);
    alert("Gagal memuat data kucing.");
  } finally {
    loading.value = false;
  }
});

const submitForm = async (week) => {
  const currentFiles = files.value[`week${week}`];
  uploading.value = true;
  const formData = new FormData();
  
  if (currentFiles.makanan) formData.append("makanan", currentFiles.makanan);
  if (currentFiles.aktivitas) formData.append("aktivitas", currentFiles.aktivitas);
  if (currentFiles.kotoran) formData.append("kotoran", currentFiles.kotoran);

  try {
    await axios.post(`${baseUrl}/api/tanggungjawab/${catId}/week/${week}`, formData);
    alert(`Laporan Minggu ${week} Berhasil Disimpan!`);
    const response = await axios.get(`${baseUrl}/api/tanggungjawab/${catId}`);
    catData.value = response.data;
    files.value[`week${week}`] = { makanan: null, aktivitas: null, kotoran: null };
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
.container { width: 90%; max-width: 950px; margin: auto; padding-top: 2rem; }
.title { font-size: 2rem; font-weight: 700; text-align: center; }
.subtitle { text-align: center; margin-bottom: 2rem; font-weight: 400; color: #dceeff; }

<<<<<<< HEAD
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
=======
.profile-card {
 background: #e7f3ff; color: #000; border-radius: 15px; padding: 1.5rem;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); margin-bottom: 2rem;
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
}
.profile-content { display: flex; align-items: center; gap: 1rem; }
.cat-photo { width: 120px; height: 120px; border-radius: 12px; object-fit: cover; background-color: #ccc; }
.cat-info p { margin: 5px 0; font-size: 0.95rem; }

<<<<<<< HEAD
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
=======
.week-card {
 background: #e7f3ff; color: #000; border-radius: 15px; padding: 1rem; 
 margin-bottom: 1.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
/* Tampilan redup jika terkunci atau expired */
.week-card.locked { filter: grayscale(100%) brightness(0.7); pointer-events: none; }
.week-card.expired { border: 2px solid #ff6b6b; } /* Optional: border merah jika expired */

.expired-message {
  background-color: #ffdddd;
  color: #d8000c;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
}

.week-content { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }

.week-item {
 flex: 1; background: white; border-radius: 10px; padding: 0.5rem; 
 text-align: center; display: flex; flex-direction: column; justify-content: space-between;
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
}
.week-item img { width: 100%; height: 260px; border-radius: 10px; object-fit: cover; background-color: #f0f0f0; }
.week-item input { margin-top: 0.5rem; width: 100%; }
/* Input disabled style */
.week-item input:disabled { cursor: not-allowed; opacity: 0.6; }

.submit-btn {
<<<<<<< HEAD
 width: 100%;
 background: #f3f7a5;
 color: #000;
 font-weight: 600;
 border: none;
 border-radius: 10px;
 padding: 0.6rem;
 cursor: pointer;
 transition: background 0.3s;
=======
 width: 100%; background: #f3f7a5; color: #000; font-weight: 600; border: none;
 border-radius: 10px; padding: 0.6rem; cursor: pointer; transition: background 0.3s;
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
}
.submit-btn:hover:not(:disabled) { background: #e9ec8a; }
.lock-icon { font-size: 2.5rem; margin-top: 2rem; }

<<<<<<< HEAD
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
=======
@media (max-width: 768px) {
  .container { width: 95%; padding: 0 10px; text-align: center; }
  .profile-content { flex-direction: column; align-items: center; text-align: center; }
  .week-content { flex-direction: column; align-items: center; }
  .week-item { max-width: 300px; margin: 0 auto 5px; }
  .week-item img { height: auto; min-height: 200px; }
>>>>>>> be63846ff7140402183eb58ea045c9640987a551
}
</style>