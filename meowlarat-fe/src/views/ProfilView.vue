<template>
  <NavbarLogin />
  <div class="profile-page">
    <!-- Header Profil -->
    <div class="profile-header">
      <img class="profile-photo" :src="photo" alt="Foto Profil" />
      <div class="profile-info">
        <h2 class="name">{{ name }}</h2>
        <p class="bio">{{ bio }}</p>
        <div class="buttons">
          <button class="edit" @click="openModal">Edit Profile</button>
          <button class="share" @click="shareProfile">Share Profile</button>
        </div>
      </div>
      <div class="adoption-count">
        <p>Hitung Adopsi</p>
        <h1>01</h1>
      </div>
    </div>

    <!-- Bagian Kucing Baru Diadopsi -->
    <h3 class="section-title">Baru Diadopsi</h3>
    <div class="adopted-card">
      <img class="cat-photo" src="../assets/img/cat-donasi.png" alt="Kucing Diadopsi" />
      <div class="cat-info">
        <p><strong>Nama :</strong> abul</p>
        <p><strong>Umur :</strong> 9 Bulan</p>
        <p><strong>Tanggal Lahir :</strong> 1 December 2024</p>
        <p><strong>Diadopsi Selama :</strong> 1 Minggu</p>
      </div>
    </div>

    <router-link to="/adopsi#list-view" class="lainnya">Lainnya</router-link>

    <!-- ✅ Modal Edit Profile -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Edit Profil</h2>
        <form @submit.prevent="saveProfile">
          <label>Foto Profil</label>
          <input type="file" accept="image/*" @change="previewImage" />
          <img v-if="tempPhoto" :src="tempPhoto" alt="Preview" class="preview-photo" />

          <label>Nama</label>
          <input type="text" v-model="tempName" placeholder="Masukkan nama baru" />

          <label>Bio</label>
          <textarea v-model="tempBio" placeholder="Masukkan bio baru"></textarea>

          <div class="modal-buttons">
            <button type="submit" class="save-btn">Simpan</button>
            <button type="button" class="cancel-btn" @click="closeModal">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ✅ Notifikasi Share -->
    <div v-if="showCopied" class="copy-toast">Link profil disalin!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavbarLogin from '../components/NavbarLogin.vue';

// Data profil utama
const name = ref('Raffie Arsy');
const bio = ref('Saya mahasiswa ilmu komputer UPI yang menyukai hewan kucing. Salam kenal!');
const photo = ref('../src/assets/img/profil.png');

// Data sementara (modal)
const tempName = ref('');
const tempBio = ref('');
const tempPhoto = ref('');
let fileObjectUrl = null;

// Kontrol modal & notifikasi
const showModal = ref(false);
const showCopied = ref(false);

// Buka modal edit
const openModal = () => {
  tempName.value = name.value;
  tempBio.value = bio.value;
  tempPhoto.value = photo.value;
  showModal.value = true;
};

// Tutup modal
const closeModal = () => {
  showModal.value = false;
};

// Preview foto baru
const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (fileObjectUrl) URL.revokeObjectURL(fileObjectUrl); // hapus preview lama
    fileObjectUrl = URL.createObjectURL(file);
    tempPhoto.value = fileObjectUrl;
  }
};

// Simpan perubahan profil
const saveProfile = () => {
  name.value = tempName.value;
  bio.value = tempBio.value;
  photo.value = tempPhoto.value;
  closeModal();
};

// Share profil (copy link)
const shareProfile = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showCopied.value = true;
    setTimeout(() => (showCopied.value = false), 2000);
  } catch (err) {
    alert('Gagal menyalin link profil.');
  }
};
</script>

<style scoped>
/* === Style Utama Profil === */
.profile-page {
  font-family: 'Poppins', sans-serif;
  background-color: #0077c2;
  background-image: url(../assets/img/background.png);
  color: white;
  min-height: 100vh;
  padding: 30px 200px 200px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #005fa3;
  padding: 20px 60px;
  border-radius: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.profile-photo {
  width: 280px;
  height: 280px;
  border-radius: 20px;
  object-fit: cover;
  background-color: #d7ecff;
}

.profile-info {
  flex: 1;
  margin-left: 20px;
  margin-bottom: 45px;
}

.name {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 0px;
}

.bio {
  font-size: 18px;
  margin: 10px 0;
  max-width: 500px;
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 90px;
  margin-bottom: -80px;
}

.edit,
.share {
  background-color: #006bb8;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.edit:hover,
.share:hover {
  background-color: #005c9a;
}

/* === Hitung Adopsi === */
.adoption-count {
  text-align: center;
  font-size: 30px;
}

.adoption-count p {
  font-weight: 600;
}

.adoption-count h1 {
  font-size: 60px;
  margin-top: 5px;
  color: #ffeb99;
}

/* === Kucing Diadopsi === */
.section-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.adopted-card {
  display: flex;
  align-items: center;
  background-color: #d7ecff;
  border-radius: 20px;
  padding: 15px;
  color: #004d80;
  flex-wrap: wrap;
}

.cat-photo {
  width: 130px;
  height: 130px;
  border-radius: 15px;
  object-fit: cover;
  margin-right: 20px;
}

.cat-info p {
  margin: 5px 0;
}

.lainnya {
  display: inline-block;
  margin-top: 20px;
  background-color: #f5eec0;
  border: none;
  padding: 10px 40px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  color: #004d80;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

/* === Modal Edit Profile === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #ffffff;
  color: #004d80;
  padding: 25px 30px;
  border-radius: 15px;
  width: 400px;
  max-width: 90%;
  animation: fadeIn 0.2s ease-in-out;
}

.modal-content h2 {
  margin-bottom: 15px;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-top: 10px;
  font-weight: 600;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  margin-top: 5px;
  padding: 8px;
  border: 2px solid #cce0ff;
  border-radius: 8px;
  font-family: 'Poppins';
  font-size: 14px;
}

.modal-content textarea {
  resize: none;
  height: 80px;
}

/* Preview Foto di Modal */
.preview-photo {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 15px;
  object-fit: cover;
  margin-top: 10px;
  border: 2px solid #0077c2;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.save-btn {
  background-color: #0077c2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #005fa3;
}

.cancel-btn:hover {
  background-color: #aaa;
}

/* === Notifikasi Share === */
.copy-toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #004d80;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  animation: fadeIn 0.3s ease;
  z-index: 1000;
}

/* Animasi */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === Responsiveness === */
@media (max-width: 1024px) {
  .profile-page {
    padding: 30px 60px 100px;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-photo {
    width: 180px;
    height: 180px;
    margin-bottom: 15px;
  }

  .profile-info {
    margin-left: 0;
    margin-bottom: 20px;
  }

  .buttons {
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 0;
  }

  .adopted-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cat-photo {
    margin: 0 0 10px 0;
  }

  .lainnya {
    width: 100%;
    padding: 12px 0;
  }
}
</style>
