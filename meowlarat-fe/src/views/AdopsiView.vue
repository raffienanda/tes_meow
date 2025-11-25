<template>
  <div class="donasi-page">
    <NavbarLogin v-if="isLoggedIn" />
    <Navbar v-else />

    <section class="donasi-container">
      <div class="donasi-left">
        <h1>Bantu kucing jalanan</h1>
        <p>Donasi Anda membantu menyediakan makan, obat, dan perlindungan.</p>

        <div class="step-box">
          <h3>1. Pilih Metode Pembayaran</h3>
          
          <div class="payment-methods">
            <button
              v-for="catName in categories"
              :key="catName"
              :class="{ 
                'active': selectedCategory === catName,
                'disabled-method': isCategoryEmpty(catName) 
              }"
              @click="openPaymentCategory(catName)"
            >
              {{ catName }}
              <span v-if="isCategoryEmpty(catName)" class="badge-soon-method">Soon</span>
            </button>
          </div>
          
          <div v-if="selectedMethodName" class="selected-info">
            <p>Metode dipilih: <strong>{{ selectedMethodName }}</strong></p>
            
            <div v-if="selectedBankInfo" class="bank-details-box">
              <p class="label-rek">Silakan transfer ke:</p>
              <div class="rek-number">{{ selectedBankInfo.rek }}</div>
              <p class="rek-owner">a.n. {{ selectedBankInfo.an }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedCategory === 'QR Code' && showQrisBox" class="qris-container">
          <h3>Scan QRIS di bawah ini: <br>a.n Sky Emperor</h3>
          
          <img 
            :src="`/img/${selectedLogo}`" 
            alt="QRIS Code" 
            class="qris-img" 
            @error="$event.target.src='/img/other.png'"
          />
          
          <p class="small-text">Scan menggunakan GoPay, OVO, Dana, atau Mobile Banking</p>
        </div>

        <div v-if="selectedMethodId" class="step-box">
          <h3>2. Pilih Nominal Donasi</h3>
          <div class="nominal-buttons">
            <button
              v-for="nominal in nominals"
              :key="nominal.value"
              :class="{ active: selectedNominal === nominal.value }"
              @click="pilihNominal(nominal.value)"
            >
              {{ nominal.label }}
            </button>
            <button :class="{ active: isCustomNominal }" @click="pilihCustom">Custom</button>
          </div>

          <input v-if="isCustomNominal" type="number" placeholder="Masukkan nominal (Min 10000)" v-model="customNominal" class="custom-input" />

          <h3>Pesan (Opsional)</h3>
          <textarea v-model="pesan" placeholder="Tulis pesan semangat..."></textarea>
        </div>

        <div v-if="selectedMethodId && (selectedNominal || customNominal)" class="step-box">
          <h3>3. Upload Bukti Transfer</h3>
          <input type="file" @change="handleFileUpload" accept="image/*" class="file-input" />
          <button class="submit-btn" @click="submitDonasi" :disabled="isLoading">
            {{ isLoading ? 'Mengirim...' : 'Kirim Donasi' }}
          </button>
        </div>
      </div>

      <div class="donasi-right">
        <div class="cat-image">
          <img src="../assets/img/cat-donasi.png" alt="kucing" />
        </div>
        <div class="info-box">
          <p>Terima kasih orang baik!</p>
        </div>
      </div>
    </section>

    <section class="history-section">
      <h2>Riwayat & Total Donasi</h2>
      <div class="table-wrapper">
        <table class="donation-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Donatur</th>
              <th>Metode</th>
              <th>Pesan</th>
              <th class="text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="historyList.length === 0">
              <td colspan="5" class="text-center">Belum ada donasi masuk. Jadilah yang pertama!</td>
            </tr>
            <tr v-for="(item, index) in historyList" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.username }}</td>
              <td>
                <span class="method-badge">
                  {{ item.metode_donasi_metodeTometode ? item.metode_donasi_metodeTometode.nama : '-' }}
                </span>
              </td>
              <td class="pesan-cell">"{{ item.pesan }}"</td>
              <td class="text-right nominal-cell">Rp {{ formatRupiah(item.nominal) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right label-total">Total Terkumpul</td>
              <td class="text-right value-total">Rp {{ formatRupiah(grandTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup">
        <button class="close-btn" @click="closePopup">✕</button>
        <h3>Pilih {{ selectedCategory }}</h3>

        <div class="bank-grid">
          <div 
            v-for="method in filteredMethods" 
            :key="method.id" 
            class="bank-item"
            :class="{ 'disabled': !method.isActive, 'selected': selectedMethodId === method.id }"
            @click="selectMethod(method)"
          >
            <img :src="`/img/${method.logo}`" :alt="method.nama" @error="$event.target.src='/img/other.png'" />
            <p>{{ method.nama }}</p>
            <span v-if="!method.isActive" class="badge-soon">Soon</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSuccessPopup" class="popup-overlay">
      <div class="popup confirm">
        <h2>Terima kasih! 🐾</h2>
        <p>Donasi Anda telah kami terima dan akan diverifikasi.</p>
        <button class="cta-btn" @click="finishDonation">Kembali ke Beranda</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import NavbarLogin from '../components/NavbarLogin.vue';
import { ref, onMounted, computed } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { jwtDecode } from "jwt-decode"; 

const router = useRouter();
const isLoggedIn = ref(false);
const username = ref('');

// Data Nominal
const nominals = [
  { label: 'Rp 10k', value: 10000 },
  { label: 'Rp 50k', value: 50000 },
  { label: 'Rp 100k', value: 100000 },
  { label: 'Rp 200k', value: 200000 },
  { label: 'Rp 500k', value: 500000 },
  { label: 'Rp 1000k', value: 1000000 }
];

// Kategori Pembayaran Utama
const categories = ['Transfer Bank', 'QR Code', 'E-Wallet'];

// State Data dari Database
const allMethods = ref([]);
const historyList = ref([]); // State untuk tabel history
const grandTotal = ref(0);   // State untuk total donasi

// State UI
const selectedCategory = ref(''); 
const selectedMethodName = ref('');
const selectedMethodId = ref(null);
const selectedBankInfo = ref(null);
const selectedLogo = ref('');
const showQrisBox = ref(false);

const selectedNominal = ref(null);
const customNominal = ref('');
const isCustomNominal = ref(false);
const pesan = ref('');
const fileBukti = ref(null);
const showPopup = ref(false);
const showSuccessPopup = ref(false);
const isLoading = ref(false);

// Helper Format Rupiah
function formatRupiah(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fetch Data Payment Methods
const fetchMethods = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/metode');
    allMethods.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil metode pembayaran:", error);
  }
};

// Fetch Data History Donasi (NEW)
const fetchHistory = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/donasi');
    historyList.value = response.data.data;
    grandTotal.value = response.data.total;
  } catch (error) {
    console.error("Gagal ambil history donasi:", error);
  }
};

onMounted(() => {
  fetchMethods(); 
  fetchHistory(); // Ambil history saat load page
  
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
    try {
      const decoded = jwtDecode(token);
      username.value = decoded.username; 
    } catch (e) {
      console.error("Token invalid");
    }
  }
});

// Filter metode berdasarkan kategori yang dipilih
const filteredMethods = computed(() => {
  return allMethods.value.filter(m => m.category === selectedCategory.value);
});

// Cek apakah kategori kosong/tidak ada yang aktif (untuk label 'Soon' di tombol utama)
function isCategoryEmpty(catName) {
  // Cek apakah ada item di kategori ini yang isActive = true
  const hasActive = allMethods.value.some(m => m.category === catName && m.isActive);
  return !hasActive; 
}

function openPaymentCategory(catName) {
  if (isCategoryEmpty(catName)) return; // Jangan buka jika tidak ada metode aktif

  selectedCategory.value = catName;
  
  // Reset pilihan
  selectedMethodName.value = '';
  selectedMethodId.value = null;
  selectedBankInfo.value = null;
  showQrisBox.value = false;

  if (catName === 'QR Code') {
    // Jika QR Code, cari data QRIS di list dan otomatis pilih
    const qrisMethod = allMethods.value.find(m => m.category === 'QR Code' && m.isActive);
    if (qrisMethod) {
      selectMethod(qrisMethod);
      showQrisBox.value = true;
    }
  } else {
    // Jika Bank/E-wallet buka popup
    showPopup.value = true;
  }
}

function selectMethod(method) {
  if (!method.isActive) return;

  selectedMethodName.value = method.nama;
  selectedMethodId.value = method.id;
  selectedLogo.value = method.logo; 
  
  if (method.rek && method.an) {
    selectedBankInfo.value = {
      rek: method.rek,
      an: method.an
    };
  } else {
    selectedBankInfo.value = null;
  }

  closePopup();
}

function pilihNominal(val) {
  selectedNominal.value = val;
  isCustomNominal.value = false;
  customNominal.value = '';
}

function pilihCustom() {
  selectedNominal.value = null;
  isCustomNominal.value = true;
}

function handleFileUpload(event) {
  fileBukti.value = event.target.files[0];
}

function closePopup() {
  showPopup.value = false;
}

async function submitDonasi() {
  if (!isLoggedIn.value) {
    alert("Silakan login terlebih dahulu untuk berdonasi.");
    return;
  }

  const finalNominal = isCustomNominal.value ? customNominal.value : selectedNominal.value;

  if (!selectedMethodId.value) return alert("Pilih metode pembayaran dulu!");
  if (!finalNominal) return alert("Pilih nominal donasi!");
  if (!fileBukti.value) return alert("Mohon upload bukti transfer!");

  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('nominal', finalNominal);
    formData.append('pesan', pesan.value);
    formData.append('metode', selectedMethodId.value);
    formData.append('username', username.value);
    formData.append('bukti_transfer', fileBukti.value);

    await axios.post('http://localhost:3000/api/donasi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    showSuccessPopup.value = true;
    fetchHistory(); // Refresh tabel setelah sukses donasi
  } catch (error) {
    console.error(error);
    alert("Gagal mengirim donasi. Coba lagi.");
  } finally {
    isLoading.value = false;
  }
}

function finishDonation() {
  showSuccessPopup.value = false;
  router.push('/');
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

.ambil-btn {
  background-color: #28a745; /* Warna Hijau */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.ambil-btn:hover {
  background-color: #218838;
}

.status-text.pending {
    color: #dc3545; /* Merah untuk menunggu */
    font-weight: bold;
}

.status-text.success {
    color: #28a745; /* Hijau untuk siap diambil */
    font-weight: bold;
    margin-bottom: 5px;
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