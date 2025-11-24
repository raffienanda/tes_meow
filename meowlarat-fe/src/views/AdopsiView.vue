<template>
  <div>
    <NavbarLogin v-if="isLoggedIn" />
    <Navbar v-else />

    <div class="adopt-page">
      <section class="hero-adopt" id="default-view">
        <div class="hero-text-container">
          <h1>Adopsi Kebahagiaan Hari Ini</h1>
          <p>Banyak kucing lucu dan menggemaskan menunggu keluarga baru. Mulailah proses adopsi dan temukan sahabat
            terbaik Anda di sini.</p>
        </div>

        <div class="cta-container">
          <div class="cta-button-wrapper">
            <button class="cta-adopt-btn" @click="scrollToSection('adopsi-view')">Adopsi</button>
            <button class="cta-list-btn" @click="scrollToSection('list-view')">List Adopsi Saya</button>
          </div>
          <img src="../assets/img/Hero-adopt.jpg" alt="Kucing melihat ke atas tombol adopsi" class="hero-cat-image">
        </div>
      </section>

      <hr class="section-divider" />

      <section class="cat-list-section" id="adopsi-view">
        <h1 class="cat-list-title">Kucing Menunggu Kamu</h1>
        <p class="cat-list-description">Lihat daftar kucing yang siap diadopsi. Setiap kucing punya cerita unik dan
          kesempatan untuk menemukan rumah penuh kasih.</p>

        <div class="cat-list-wrapper">
          <div class="cat-grid">
            <div v-for="(cat, index) in displayedCats" :key="index" class="cat-card" @click="showCatModal(cat)">
              <img :src="getImgUrl(cat.img_url)" :alt="cat.nama" class="cat-image">
              <p class="cat-name">{{ cat.nama }}</p>
            </div>
          </div>

          <div class="button-group">
            <button v-if="limit < availableCats.length" class="more-btn" @click="loadMore">
              Lihat lebih banyak
            </button>

            <button v-if="limit > 8" class="more-btn less-btn" @click="showLess">
              Lihat lebih sedikit
            </button>
          </div>

          <p v-if="limit >= availableCats.length" class="all-loaded-text">
            Semua kucing sudah ditampilkan 😺
          </p>
        </div>
      </section>

      <hr class="section-divider" />

      <section class="my-list-section" id="list-view">
        <h1 class="my-list-title">List Kucing Anda</h1>
        <p class="my-list-description">Di sini kamu bisa melihat status permintaan adopsi serta daftar kucing yang sudah
          berhasil kamu adopsi.</p>

        <div class="list-card-wrapper">
          <h2 class="sub-section-title">Verifikasi Adopsi</h2>
          <div v-for="(verif, index) in verificationList" :key="'verif-' + index" class="status-card">
            <img :src="verif.image" :alt="verif.name" class="status-cat-image">
            <div class="status-details">
              <p>Nama : {{ verif.name }}</p>
              <p>Umur : {{ verif.age }}</p>
              <p>Tanggal Adopsi : {{ verif.dob }}</p>
              <p class="status-text">Status : {{ verif.status }}</p>
            </div>
          </div>
          <button class="more-btn secondary-more-btn">Lihat Lebih Banyak</button>
        </div>

        <div class="list-card-wrapper">
          <h2 class="sub-section-title history-title">Sejarah Adopsi Kucing</h2>
          <div v-for="(history, index) in historyList" :key="'history-' + index" class="status-card">
            <img :src="history.image" :alt="history.name" class="status-cat-image">
            <div class="status-details">
              <p>Nama : {{ history.name }}</p>
              <p>Umur : {{ history.age }}</p>
              <p>Tanggal Adopsi : {{ history.dob }}</p>
              <p>Diadopsi Selama : {{ history.duration }}</p>
              <router-link to="/form" class="form-btn">Form</router-link>
            </div>
          </div>
          <button class="more-btn secondary-more-btn">Lihat Lebih Banyak</button>
        </div>
      </section>
    </div>

    <div class="modal-overlay" v-if="isModalOpen" @click.self="closeCatModal">
      <div class="cat-info-modal">
        <div class="modal-header">
          <h2>Informasi Kucing</h2>
          <button class="close-btn" @click="closeCatModal">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div class="cat-image-detail">
            <img :src="getImgUrl(selectedCat.img_url) || defaultImage" :alt="selectedCat.name" class="cat-detail-img">
          </div>
          <div class="cat-details-text">
            <p><strong>Nama : </strong>{{ selectedCat.nama }}</p>
            <p><strong>Umur : </strong>{{ selectedCat.age }}</p>
            <p><strong>Jenis Kelamin : </strong>{{ selectedCat.gender }}</p>
            <p><strong>Ras : </strong>{{ selectedCat.ras }}</p>
            <p><strong>Karakter : </strong>{{ selectedCat.karakteristik }}</p>
            <p><strong>Status vaksinasi : </strong>{{ selectedCat.isVaccinated }}</p>
            <button class="adopt-detail-btn" @click="handleAdoptClick">Adopsi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import NavbarLogin from '../components/NavbarLogin.vue';
import defaultImageSrc from '../assets/img/Hero-adopt.jpg';

export default {
  name: 'AdoptView',
  components: { Navbar, NavbarLogin },
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      isModalOpen: false,
      selectedCat: {},
      
      availableCats: [],    // Kucing di halaman utama (GET /)
      verificationList: [], // List "Verifikasi Adopsi" (GET /pending)
      historyList: [],      // List "Sejarah Adopsi" (GET /history)
      
      limit: 8,
      defaultImage: defaultImageSrc
    };
  },
  computed: {
    displayedCats() {
      return this.availableCats.slice(0, this.limit);
    }
  },
  methods: {
    getImgUrl(path) {
      if (!path) return this.defaultImage;
      if (path.startsWith('http')) return path;
      let cleanPath = path.replace(/\\/g, '/');
      if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
      return `http://localhost:3000/uploads/img-lapor/${cleanPath}`;
    },

    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    showCatModal(cat) {
      this.selectedCat = cat;
      this.isModalOpen = true;
    },
    closeCatModal() {
      this.isModalOpen = false;
      this.selectedCat = {};
    },

    // --- REQUEST ADOPSI ---
    async handleAdoptClick() {
      const token = localStorage.getItem('token');
      
      if (!token || !this.currentUser) {
        alert("Silakan login terlebih dahulu untuk mengadopsi!");
        this.$router.push('/login');
        return;
      }

      if (!confirm(`Apakah kamu yakin ingin mengajukan adopsi untuk ${this.selectedCat.nama}?`)) {
        return;
      }

      try {
        // Panggil endpoint adopt (Tanggal akan NULL di database)
        await axios.put(
          `http://localhost:3000/api/cats/adopt/${this.selectedCat.id}`,
          { username: this.currentUser }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert(`Permintaan adopsi ${this.selectedCat.nama} berhasil dikirim! Silakan cek status verifikasi.`);
        
        this.closeCatModal();
        
        // Refresh semua data
        await this.fetchCats(); 
        await this.fetchPending(); // Update list verifikasi
        await this.fetchHistory();

        this.$nextTick(() => {
          this.scrollToSection('list-view');
        });

      } catch (error) {
        console.error("Gagal mengadopsi:", error);
        alert(error.response?.data?.message || "Terjadi kesalahan.");
      }
    },

    // 1. Fetch Kucing Available
    async fetchCats() {
      try {
        const response = await axios.get('http://localhost:3000/api/cats');
        this.availableCats = response.data;
      } catch (error) {
        console.error("Gagal ambil data kucing:", error);
      }
    },

    // 2. Fetch Data Pending (Verifikasi)
    async fetchPending() {
      if (!this.currentUser) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/cats/pending/${this.currentUser}`);
        
        this.verificationList = response.data.map(cat => ({
          name: cat.nama,
          age: cat.age,
          dob: '-', // Belum ada tanggal adopsi
          image: this.getImgUrl(cat.img_url),
          status: 'Menunggu Verifikasi' // Teks status
        }));
      } catch (error) {
        console.error("Gagal ambil data pending:", error);
      }
    },

    // 3. Fetch Data History (Selesai)
    async fetchHistory() {
      if (!this.currentUser) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/cats/history/${this.currentUser}`);
        
        this.historyList = response.data.map(cat => ({
          name: cat.nama,
          age: cat.age,
          // Tanggal sudah ada
          dob: cat.adoptdate ? new Date(cat.adoptdate).toLocaleDateString('id-ID') : '-', 
          duration: 'Baru saja', 
          image: this.getImgUrl(cat.img_url),
          status: 'Berhasil Diadopsi'
        }));
      } catch (error) {
        console.error("Gagal ambil history:", error);
      }
    },

    loadMore() { this.limit += 8; },
    showLess() { 
      this.limit = 8; 
      this.$nextTick(() => { this.scrollToSection('adopsi-view'); });
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');

    if (token && user) {
      this.isLoggedIn = true;
      this.currentUser = user;
      this.fetchPending(); // Panggil fetch pending
      this.fetchHistory(); // Panggil fetch history
    }

    this.fetchCats();
  }
}
</script>

<style scoped>
/* ... (Style CSS biarkan sama persis seperti sebelumnya) ... */
.adopt-page {
  padding-bottom: 50px;
  color: white;
  background-image: url('/paw-pattern.png');
  overflow-x: hidden;
}

h1,
h2 {
  color: white;
}

.section-divider {
  border: 0;
  height: 10px;
  background-color: transparent;
  margin: 50px auto;
  max-width: 1200px;
}

.hero-adopt {
  padding: 80px 100px;
  position: relative;
  text-align: left;
}

.hero-text-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-adopt h1 {
  font-size: 5.5rem;
  margin-bottom: 15px;
  color: #EFEFD0;
}

.hero-adopt p {
  font-size: 1.3rem;
  margin-bottom: 40px;
  color: #EFEFD0;
}

.cta-container {
  border-radius: 15px;
  padding: 30px;
  max-width: 1200px;
  max-height: 500px;
  margin: 20px auto;
  position: relative;
}

.hero-cat-image {
  position: relative;
  z-index: 1;
  width: 100%;
  border-radius: 10px;
  display: block;
}

.cta-button-wrapper {
  display: flex;
  justify-content: center;
  gap: 30px;
  z-index: 3;
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  padding: 0;
}

.cta-adopt-btn,
.cta-list-btn {
  background-color: white;
  color: #0077c2;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  padding: 15px 40px;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.cat-list-section {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  text-align: left;
}

.cat-list-wrapper {
  background-color: white;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding-bottom: 30px;
  /* Tambahan padding bawah */
}

.cat-list-title {
  font-size: 5.5rem;
  margin-bottom: 10px;
  color: #EFEFD0;
}

.cat-list-description {
  font-size: 1.3rem;
  margin-bottom: 40px;
  color: #EFEFD0;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cat-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 290px;
  position: relative;
  cursor: pointer;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cat-name {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 90%;
  background-color: white;
  color: #004c80;
  padding: 10px 0;
  margin: 10px;
  font-weight: 600;
  font-size: 1.1em;
  z-index: 10;
  border-radius: 30px;
  border: 2px solid #004c80;
}

.more-btn {
  background: none;
  border: none;
  color: #0077c2;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 40px;
  text-decoration: underline;
}

.all-loaded-text {
  color: #888;
  margin-top: 30px;
  font-style: italic;
}

.my-list-section {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  text-align: left;
}

.list-card-wrapper {
  background-color: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  margin-bottom: 30px;
  color: #333;
  text-align: left;
}

.my-list-title {
  font-size: 5.5rem;
  margin-bottom: 10px;
  color: #EFEFD0;
  text-align: left;
}

.my-list-description {
  font-size: 1.3rem;
  margin-bottom: 50px;
  color: #EFEFD0;
}

.sub-section-title {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #0077c2;
  text-align: left;
}

.secondary-more-btn {
  color: #0077c2;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.status-card {
  display: flex;
  background-color: #DEF1FF;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

.status-cat-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.status-details p {
  margin: 5px 0;
  font-size: 1em;
}

.status-text {
  font-weight: bold;
  color: #0077c2;
}

.form-btn {
  background-color: #0077c2;
  color: white;
  border: none;
  padding: 5px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 12px;
  text-decoration: none;
}

.history-title {
  margin-top: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cat-info-modal {
  background-color: #D2E5F3;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 1200px;
  overflow: hidden;
  color: #333;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  color: #0077c2;
  margin: 0;
  font-size: 1.8rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.close-btn svg {
  color: #333;
}

.modal-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.cat-image-detail {
  flex-shrink: 0;
  width: 45%;
  border-radius: 15px;
  overflow: hidden;
  background-color: #f7f7f7;
}

.cat-detail-img {
  width: 100%;
  min-height: 400px;
  max-height: 500px;
  display: block;
  object-fit: cover;
}

.cat-details-text {
  flex-grow: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: white;
  border-radius: 15px;
}

.cat-details-text p {
  margin: 0;
  font-size: 1.1rem;
}

.cat-details-text strong {
  font-weight: 700;
  color: #004c80;
}

.adopt-detail-btn {
  background-color: #0077c2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 15px;
  padding: 10px 30px;
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  align-self: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.more-btn {
  background: none;
  border: none;
  color: #0077c2;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0; 
}

.less-btn {
  color: #888;
}
.less-btn:hover {
  color: #555;
}

.all-loaded-text {
  color: #888;
  margin-top: 20px;
  font-style: italic;
}

@media (max-width: 1024px) {
  .hero-adopt {
    padding: 60px 20px;
    text-align: center;
  }

  .hero-adopt h1 {
    font-size: 3.5rem;
  }

  .hero-adopt p {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  .cta-container {
    max-height: unset;
    padding: 20px;
    position: relative;
  }

  .cta-button-wrapper {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90%;
    gap: 15px;
    z-index: 3;
    padding: 0;
    margin-bottom: 0;
    order: unset;
  }

  .cta-adopt-btn,
  .cta-list-btn {
    width: 100%;
    min-width: unset;
  }

  .hero-cat-image {
    width: 100%;
    order: unset;
  }

  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .my-list-title,
  .my-list-description {
    text-align: center;
  }

  .my-list-title {
    font-size: 3.5rem;
  }

  .list-card-wrapper {
    padding: 20px;
  }

  .status-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px;
  }

  .status-cat-image {
    width: 100%;
    max-height: 250px;
    height: auto;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .status-details {
    width: 100%;
  }

  .form-btn {
    width: 100%;
  }

  .cat-info-modal {
    max-width: 95%;
    max-height: 95vh;
    overflow-y: auto;
    padding: 15px;
  }

  .modal-content {
    flex-direction: column;
    gap: 15px;
  }

  .cat-image-detail {
    width: 100%;
    max-height: 400px;
  }

  .cat-detail-img {
    min-height: 300px;
    height: auto;
  }

  .cat-details-text {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }

  .adopt-detail-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .hero-adopt {
    padding: 40px 10px;
  }

  .hero-adopt h1,
  .cat-list-title,
  .my-list-title {
    font-size: 2.5rem;
  }

  .hero-adopt p,
  .cat-list-description,
  .my-list-description {
    font-size: 1rem;
  }

  .cta-button-wrapper {
    flex-direction: column;
  }

  .cta-adopt-btn,
  .cta-list-btn {
    min-width: unset;
    padding: 12px 20px;
    width: 80%;
  }

  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .cat-card {
    height: 200px;
  }

  .cat-name {
    width: 90%;
    margin: 10px auto;
    padding: 5px 0;
    font-size: 0.9em;
  }

  .sub-section-title {
    font-size: 1.5rem;
  }

  .status-card {
    padding: 10px;
  }

  .status-details p {
    font-size: 0.9em;
  }
}
</style>