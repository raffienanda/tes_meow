<template>
  <div class="donasi-page">
    <Navbar />

    <section class="donasi-container">
      <!-- Bagian kiri -->
      <div class="donasi-left">
        <h1>Bantu kucing jalanan</h1>
        <p>
          Banyak kucing terlantar hidup tanpa makanan dan tempat aman.
          Donasi Anda membantu menyediakan makan, obat, dan perlindungan.
        </p>

        <h3>Kenapa donasi penting</h3>
        <p>
          Dengan berdonasi, Anda membantu memutus lingkaran kucing terlantar
          dan memberi mereka kesempatan untuk hidup sehat dan bahagia.
        </p>

        <h3>Pilih nominal donasi</h3>
        <div class="nominal-buttons">
          <button
            v-for="nominal in nominals"
            :key="nominal"
            :class="{ active: selectedNominal === nominal }"
            @click="selectedNominal = nominal"
          >
            {{ nominal }}
          </button>

          <!-- Tombol Custom -->
          <button
            :class="{ active: selectedNominal === 'custom' }"
            @click="selectedNominal = 'custom'"
          >
            Custom
          </button>
        </div>

        <input
          type="number"
          placeholder="Masukkan nominal sendiri"
          v-model="customNominal"
          class="custom-input"
          :disabled="selectedNominal !== 'custom'"
        />

        <h3>Pesan</h3>
        <textarea v-model="pesan" placeholder="Tulis pesan untuk kami..."></textarea>

        <button class="submit-btn" @click="showSubmitPopup = true">Submit</button>
      </div>

      <!-- Bagian kanan -->
      <div class="donasi-right">
        <div class="cat-image">
          <img src="../assets/img/cat-donasi.png" alt="kucing" />
        </div>

        <div class="payment-box">
          <h3>Metode pembayaran</h3>
          <div class="payment-methods">
            <button
              v-for="method in paymentMethods"
              :key="method"
              @click="openPopup(method)"
            >
              {{ method }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Popup Metode Pembayaran -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup">
        <button class="close-btn" @click="closePopup">✕</button>
        <h3>{{ selectedMethod }}</h3>

        <div class="bank-grid" v-if="selectedMethod === 'Transfer Bank'">
          <div v-for="bank in banks" :key="bank.name" class="bank-item">
            <img :src="bank.logo" :alt="bank.name" />
            <p>{{ bank.name }}</p>
          </div>
        </div>

        <div v-else>
          <p>Fitur {{ selectedMethod }} akan segera tersedia.</p>
        </div>
      </div>
    </div>

    <!-- Popup Submit -->
    <div
      v-if="showSubmitPopup"
      class="popup-overlay"
      @click.self="showSubmitPopup = false"
    >
      <div class="popup confirm">
        <button class="close-btn" @click="showSubmitPopup = false">✕</button>
        <h2>Terima kasih!</h2>
        <p>Donasi Anda sangat berarti untuk membantu kucing jalanan 🐾</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue'

const nominals = ['Rp10k', 'Rp50k', 'Rp100k', 'Rp200k', 'Rp500k', 'Rp1000k']
const paymentMethods = ['E-Wallet', 'QR Code', 'Transfer Bank']

const selectedNominal = ref('')
const customNominal = ref('')
const pesan = ref('')
const selectedMethod = ref('')
const showPopup = ref(false)
const showSubmitPopup = ref(false)

const banks = [
  { name: 'BRI', logo: '../src/assets/img/bri.png' },
  { name: 'BCA', logo: '../src/assets/img/bca.png' },
  { name: 'Mandiri', logo: '../src/assets/img/mandiri.png' },
  { name: 'Permata', logo: '../src/assets/img/permata.png' },
  { name: 'BNI', logo: '../src/assets/img/bni.png' },
  { name: 'BSI', logo: '../src/assets/img/bsi.png' },
  { name: 'SeaBank', logo: '../src/assets/img/seabank.png' },
  { name: 'Other', logo: '../src/assets/img/other.png' }
]

function openPopup(method) {
  selectedMethod.value = method
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
}
</script>

<style scoped>
.donasi-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 100px;
  padding-top: 60px;
  color: white;
  min-height: 90vh;
  flex-wrap: wrap;
  gap: 150px;
}

/* -----------------------------
   BAGIAN KIRI
----------------------------- */
.donasi-left {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.donasi-left h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.donasi-left h3 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.donasi-left p {
  font-size: 1.1rem;
}

.nominal-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nominal-buttons button,
.submit-btn {
  background: white;
  color: #2a79c5;
  border: none;
  padding: 10px 18px;
  border-radius: 20px;
  margin-top: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.nominal-buttons button.active {
  background: #f7ca00;
  color: #1b4e91;
}

.nominal-buttons button:hover,
.submit-btn:hover {
  background: #e6e6e6;
}

input,
textarea {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
}

textarea {
  height: 80px;
  resize: none;
}

.custom-input:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* -----------------------------
   BAGIAN KANAN
----------------------------- */
.donasi-right {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cat-image {
  width: 100%;
  max-width: 300px;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.payment-box {
  background: white;
  color: #2a79c5;
  border-radius: 20px;
  padding: 20px 25px;
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.payment-methods button {
  border: 2px solid #2a79c5;
  background: none;
  color: #2a79c5;
  font-weight: bold;
  border-radius: 20px;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.2s;
}

.payment-methods button:hover {
  background: #2a79c5;
  color: white;
}

/* -----------------------------
   POPUP
----------------------------- */
.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.popup {
  background: white;
  color: #2a79c5;
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.bank-item {
  border: 2px solid #2a79c5;
  border-radius: 10px;
  padding: 10px;
}

.bank-item img {
  width: 70px;
  height: auto;
}

/* -----------------------------
   RESPONSIVE BREAKPOINTS
----------------------------- */
@media (max-width: 1024px) {
  .donasi-container {
    padding: 60px 40px;
  }

  .donasi-left h1 {
    font-size: 2rem;
  }

  .donasi-right {
    max-width: 350px;
  }
}

@media (max-width: 768px) {
  .donasi-container {
    flex-direction: column;
    align-items: center;
    padding: 50px 30px;
  }

  .donasi-left,
  .donasi-right {
    width: 100%;
    margin: 0;
    text-align: center;
  }

  .donasi-left h1 {
    font-size: 2rem;
  }

  .cat-image {
    margin: 40px 0;
    height: 200px;
  }

  .payment-box {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .donasi-left h1 {
    font-size: 1.6rem;
  }

  .donasi-left p {
    font-size: 1rem;
  }

  .nominal-buttons button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  .popup {
    padding: 20px;
  }

  .bank-item img {
    width: 50px;
  }
}
</style>
