<template>
  <NavbarLogin v-if="isLoggedIn" />
  <Navbar v-else />

  <section class="findplace-hero">
    <div class="container">
      <h1><span>Find</span>Place</h1>
      <p>Cari lokasi Petshop, Klinik Hewan, dan Toko Online Terpercaya di sekitarmu.</p>
    </div>
  </section>

  <section class="findplace-section">
    <h2 class="section-title">Lokasi Petshop & Vet</h2>
    <div ref="mapContainer" class="map-placeholder" id="map"></div>
  </section>

  <section class="findplace-section">
    <div class="section-header">
      <h2 class="section-title">Rekomendasi Petshop & Vet</h2>
      <div class="carousel-nav">
        <button @click="scrollCarousel('petshops', -1)">‹</button>
        <button @click="scrollCarousel('petshops', 1)">›</button>
      </div>
    </div>

    <div ref="petshopsCarousel" class="carousel-track">
      <div v-for="(shop, index) in petshops" :key="index" class="place-card">
        <img :src="shop.img_url || defaultImg" :alt="shop.nama" />
        <h3>{{ shop.nama }}</h3>
        <p class="address">{{ shop.address }}</p>
        <div class="stars">
          <span v-for="n in shop.rating || 5" :key="n">⭐</span>
        </div>
      </div>
    </div>
  </section>

  <section class="findplace-section">
    <div class="section-header">
      <h2 class="section-title">Rekomendasi Petshop Online</h2>
      <div class="carousel-nav">
        <button @click="scrollCarousel('onlineShops', -1)">‹</button>
        <button @click="scrollCarousel('onlineShops', 1)">›</button>
      </div>
    </div>

    <div ref="onlineCarousel" class="carousel-track">
      <div v-for="(shop, index) in onlineShops" :key="index" class="place-card online">
        <div class="shop-source">{{ shop.source }}</div>
        <h3>{{ shop.name }}</h3>
        <p>{{ shop.deskripsi }}</p>
        <a :href="shop.link" target="_blank" class="visit-btn">Kunjungi Toko</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import NavbarLogin from '../components/NavbarLogin.vue';
import defaultImg from "../assets/img/cat-icon.png"; 

// --- LEAFLET & FIX ICON ---
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon marker yang sering hilang di Vue/Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------

const isLoggedIn = ref(false);
const petshops = ref([]); 
const onlineShops = ref([]); 
const mapContainer = ref(null);
const map = ref(null);

// Carousel Refs
const petshopsCarousel = ref(null);
const onlineCarousel = ref(null);

const scrollCarousel = (type, direction) => {
  const carousel = type === "petshops" ? petshopsCarousel.value : onlineCarousel.value;
  if(carousel) {
      const scrollAmount = carousel.offsetWidth * 0.8;
      carousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }
};

onMounted(async () => {
  // 1. Cek Login
  const token = localStorage.getItem('token');
  if (token) isLoggedIn.value = true;

  // 2. Inisialisasi Map (Bandung)
  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView([-6.9175, 107.6191], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.value);
  }

  // 3. Fetch Data Fisik (Peta)
  try {
    const resMap = await fetch('http://localhost:3000/api/findplace');
    if (resMap.ok) {
        const dataMap = await resMap.json();
        petshops.value = dataMap;

        // Render Marker ke Peta
        dataMap.forEach((place) => {
          if (place.latitude && place.longitude) {
            L.marker([place.latitude, place.longitude])
              .addTo(map.value)
              .bindPopup(`
                <b>${place.nama}</b><br>
                ${place.address}<br>
                <small>${place.category}</small>
              `);
          }
        });
    }
  } catch (error) {
    console.error("Gagal ambil data map:", error);
  }

  // 4. Fetch Data Online Shop (Dinamis dari DB)
  try {
    const resOnline = await fetch('http://localhost:3000/api/findplace/online');
    if (resOnline.ok) {
        onlineShops.value = await resOnline.json();
    }
  } catch (error) {
    console.error("Gagal ambil data online shop:", error);
    // Fallback jika error fetch
    onlineShops.value = [];
  }
});
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background-color: #e5f2ff;
  color: #002b5b;
}

.map-placeholder {
  height: 400px; /* Increased slightly for better view */
  width: 100%;
  border-radius: 15px;
  z-index: 1; /* Ensures map controls sit correctly */
  /* Remove display:flex/justify-center from previous placeholder styling 
     so Leaflet can render tiles correctly */
  display: block; 
}

/* Hero Section */
.findplace-hero {
  text-align: left;
  color: #fdf2d6;
  padding: 100px 20px 60px;
}

.findplace-hero .container {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
}

.findplace-hero h1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

.findplace-hero p {
  font-size: 1.3rem;
  max-width: 700px;
}

/* Section Container */
.findplace-section {
  background-color: #d8eaff;
  border-radius: 20px;
  margin: 40px auto;
  padding: 40px 50px;
  width: 90%;
  max-width: 1100px;
  text-align: left;
}

/* Section Title */
.section-title {
  color: #0b4b92;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

/* Map Placeholder */
.map-placeholder {
  background: #f0f9ff;
  border-radius: 15px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 1rem;
}

/* Header for carousel */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.carousel-nav button {
  background-color: #0b4b92;
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s;
}

.carousel-nav button:hover {
  background-color: #083b75;
}

/* Carousel track */
.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
  padding-top: 15px;
  scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

/* Card Styles */
.place-card {
  flex: 0 0 auto;
  width: 250px;
  background: #fff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.place-card:hover {
  transform: translateY(-5px);
}

.place-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
}

.place-card h3 {
  color: #002b5b;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.place-card .address {
  color: #444;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.stars {
  color: #f8c52c;
  font-size: 1rem;
}

/* Online Cards */
.place-card.online {
  background: #f0f9ff;
}

.shop-source {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.visit-btn {
  display: inline-block;
  background-color: #0077c2;
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 10px;
}

.visit-btn:hover {
  background-color: #005b99;
}

/* Responsive */
@media (max-width: 900px) {
  .findplace-hero h1 {
    font-size: 3rem;
  }
  .findplace-section {
    padding: 30px 25px;
  }
}

@media (max-width: 600px) {
  .findplace-hero {
    padding: 80px 15px 40px;
  }
  .findplace-hero h1 {
    font-size: 2.5rem;
  }
  .findplace-section {
    padding: 25px 20px;
  }
  .section-title {
    font-size: 1.5rem;
  }
}
</style>
