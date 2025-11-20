<template>
 <div class="form-page">
  <Navbar />

  <section class="container">
   <h1 class="title">Form Pemilik Bertanggungjawab</h1>
   <p class="subtitle">
    Ayo menjadi owner yang baik dengan mengisi form di bawah ini.
   </p>

      <div class="profile-card">
        <h2>Profil Kucing</h2>
        <div class="profile-content">
          <img src="../assets/img/cat-donasi.png" alt="Foto Kucing" class="cat-photo" />
          <div class="cat-info">
            <p><strong>Nama :</strong> abul</p>
            <p><strong>Umur :</strong> 9 Bulan</p>
            <p><strong>Tanggal Lahir :</strong> 1 Desember 2024</p>
            <p><strong>Diadopsi Selama :</strong> 1 Minggu</p>
          </div>
        </div>
      </div>

      <div class="week-card">
        <h3>Minggu Pertama</h3>
        <div class="week-content">
          <div class="week-item">
            <h4>Makanan:</h4>
            <img src="../assets/img/makanan.png" alt="Makanan" />
            <input type="file" />
          </div>
          <div class="week-item">
            <h4>Aktivitas:</h4>
            <img src="../assets/img/aktivitas.png" alt="Aktivitas" />
            <input type="file" />
          </div>
          <div class="week-item">
            <h4>Kotoran:</h4>
            <img src="../assets/img/kotoran.png" alt="Kotoran" />
            <input type="file" />
          </div>
        </div>
        <button class="submit-btn">Submit</button>
      </div>

      <div class="week-card locked">
    <h3>Minggu Kedua</h3>
    <div class="week-content">
     <div class="week-item">
      <h4>Makanan:</h4>
      <div class="placeholder"></div>
      <input type="file" disabled />
     </div>
     <div class="week-item">
      <h4>Aktivitas:</h4>
      <div class="lock-icon">🔒</div>
      <input type="file" disabled />
     </div>
     <div class="week-item">
      <h4>Kotoran:</h4>
      <div class="placeholder"></div>
      <input type="file" disabled />
     </div>
    </div>
    <button class="submit-btn" disabled>Submit</button>
    </div>

      <div class="week-card locked">
    <h3>Minggu Ketiga</h3>
    <div class="week-content">
     <div class="week-item">
      <h4>Makanan:</h4>
      <div class="placeholder"></div>
      <input type="file" disabled />
     </div>
     <div class="week-item">
      <h4>Aktivitas:</h4>
      <div class="lock-icon">🔒</div>
      <input type="file" disabled />
     </div>
     <div class="week-item">
      <h4>Kotoran:</h4>
      <div class="placeholder"></div>
      <input type="file" disabled />
     </div>
    </div>
    <button class="submit-btn" disabled>Submit</button>
   </div>
  </section>
 </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
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