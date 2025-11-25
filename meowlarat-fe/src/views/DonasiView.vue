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

// --- STATE BARU UNTUK TABEL ---
const historyList = ref([]);
const grandTotal = ref(0);
// ------------------------------

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

// Fetch Data Payment Methods dari Backend
const fetchMethods = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/metode');
    allMethods.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil metode pembayaran:", error);
  }
};

// --- FUNGSI BARU FETCH DATA DONASI ---
const fetchHistory = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/donasi');
    historyList.value = response.data.data;
    grandTotal.value = response.data.total;
  } catch (error) {
    console.error("Gagal ambil history donasi:", error);
  }
};
// -------------------------------------

onMounted(() => {
  fetchMethods(); 
  fetchHistory(); // <--- PANGGIL DI SINI AGAR MUNCUL SAAT LOAD
  
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

// Cek apakah kategori kosong/tidak ada yang aktif
function isCategoryEmpty(catName) {
  const hasActive = allMethods.value.some(m => m.category === catName && m.isActive);
  return !hasActive; 
}

function openPaymentCategory(catName) {
  if (isCategoryEmpty(catName)) return; 

  selectedCategory.value = catName;
  selectedMethodName.value = '';
  selectedMethodId.value = null;
  selectedBankInfo.value = null;
  showQrisBox.value = false;

  if (catName === 'QR Code') {
    const qrisMethod = allMethods.value.find(m => m.category === 'QR Code' && m.isActive);
    if (qrisMethod) {
      selectMethod(qrisMethod);
      showQrisBox.value = true;
    }
  } else {
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
    fetchHistory(); // <--- REFRESH TABEL SETELAH SUKSES
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
.donasi-container {
  display: flex;
  justify-content: center;
  padding: 80px 50px;
  gap: 50px;
  color: white;
  flex-wrap: wrap;
}

.donasi-left {
  flex: 1;
  max-width: 600px;
}

.step-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h1 { margin-bottom: 10px; color: #fffce8;}
h3 { margin-bottom: 15px; font-size: 1.1rem; color: #fffce8;}
p { margin-bottom: 20px; color: #e0e0e0; }

.payment-methods {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.payment-methods button {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #fffce8;
  background: transparent;
  color: #fffce8;
  font-weight: bold;
  cursor: pointer;
  position: relative; 
}

.payment-methods button.active {
  background: #fffce8;
  color: #0077c2;
}

.payment-methods button:hover:not(.disabled-method) {
  background: rgba(255, 252, 232, 0.2);
}

.disabled-method {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #aaa;
  color: #ccc;
}

.badge-soon-method {
  position: absolute;
  top: -10px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: normal;
}

.selected-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
}

.bank-details-box {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
}

.label-rek {
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #ddd;
}

.rek-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f7ca00;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.rek-owner {
  font-size: 1rem;
  font-weight: 600;
}

.qris-container {
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #333;
}
.qris-container h3 { color: #333; }
.qris-img { width: 200px; height: 200px; object-fit: contain; }

.nominal-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.nominal-buttons button {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #0077c2;
  font-weight: bold;
  cursor: pointer;
}

.nominal-buttons button.active {
  background: #f7ca00; 
  color: #005b99;
  transform: scale(1.05);
}

.custom-input, textarea, .file-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin-bottom: 10px;
  font-family: inherit;
}

textarea { height: 80px; resize: none; }

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #f7ca00;
  color: #005b99;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}
.submit-btn:hover { transform: scale(1.02); }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }

.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  color: #333;
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  position: relative;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 10px; right: 15px;
  background: none; border: none;
  font-size: 1.5rem; cursor: pointer;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.bank-item {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  position: relative;
}

.bank-item img { width: 50px; height: auto; margin-bottom: 5px; }
.bank-item p { font-size: 0.9rem; margin: 0; color: #555; }

.bank-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9f9f9;
}

.bank-item.selected {
  border-color: #0077c2;
  background: #e6f4ff;
}

.badge-soon {
  position: absolute;
  top: -5px; right: -5px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.cta-btn {
  background: #0077c2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 15px;
  cursor: pointer;
}

/* === CSS TAMBAHAN UNTUK TABEL === */
.history-section {
  padding: 0 50px 80px 50px;
  color: #fff;
  max-width: 1000px;
  margin: 0 auto;
}

.history-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #fffce8;
}

.table-wrapper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-x: auto;
}

.donation-table {
  width: 100%;
  border-collapse: collapse;
  color: #e0e0e0;
}

.donation-table th, .donation-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.donation-table th {
  color: #f7ca00;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.text-right { text-align: right; }
.text-center { text-align: center; }

.method-badge {
  background: rgba(0, 119, 194, 0.3);
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.85rem;
  border: 1px solid rgba(0, 119, 194, 0.5);
}

.pesan-cell {
  font-style: italic;
  color: #aaa;
  max-width: 250px;
}

.nominal-cell {
  font-weight: bold;
  color: #fff;
}

.donation-table tfoot tr {
  background: rgba(247, 202, 0, 0.1);
}

.donation-table tfoot td {
  border-bottom: none;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 1.1rem;
}

.label-total { font-weight: bold; color: #fffce8; }
.value-total { font-weight: bold; color: #f7ca00; font-size: 1.3rem; }

@media (max-width: 768px) {
  .donasi-container { flex-direction: column; padding: 40px 20px; }
  .bank-grid { grid-template-columns: repeat(2, 1fr); }
  .history-section { padding: 0 20px 40px 20px; }
  .pesan-cell { display: none; } 
}
</style>