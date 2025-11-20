<template>
  <Navbar />

  <!-- Hero Section -->
  <section class="findplace-hero">
    <div class="container">
      <h1><span>Find</span>Place</h1>
      <p>Cari lokasi Petshop, Klinik Hewan, dan Toko Online Terpercaya di sekitarmu.</p>
    </div>
  </section>

  <!-- Lokasi Petshop & Vet -->
  <section class="findplace-section">
    <h2 class="section-title">Lokasi Petshop & Vet</h2>
    <div class="map-placeholder">
      <p>Peta akan ditampilkan di sini...</p>
    </div>
  </section>

  <!-- Rekomendasi Petshop & Vet -->
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
        <img :src="shop.image" :alt="shop.name" />
        <h3>{{ shop.name }}</h3>
        <p class="address">{{ shop.address }}</p>
        <div class="stars">
          <span v-for="star in shop.rating" :key="star">⭐</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Rekomendasi Petshop Online -->
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
        <p>{{ shop.description }}</p>
        <a :href="shop.link" target="_blank" class="visit-btn">Kunjungi Toko</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";

// import gambar lokal (contoh placeholder)
import gerlongImg from "../assets/img/cat-icon.png";
import ozoraImg from "../assets/img/cat-icon.png";
import cimuImg from "../assets/img/cat-icon.png";
import careImg from "../assets/img/cat-icon.png";

const petshopsCarousel = ref(null);
const onlineCarousel = ref(null);

const petshops = ref([]);
const onlineShops = ref([]);

// 🧩 Dummy data — nanti bisa diganti axios call ke DB
onMounted(() => {
  petshops.value = [
    {
      name: "Gerlong Petshop",
      image: gerlongImg,
      address: "Jl. Gegerkalong Hilir No. 51, Parongpong",
      rating: 5,
    },
    {
      name: "Klinik Hewan Ozora",
      image: ozoraImg,
      address: "Jl. Setrasari III Ruko 2C, Sukarasa",
      rating: 5,
    },
    {
      name: "Cimu PetShop",
      image: cimuImg,
      address: "Jl. Ciwaruga No. 28, Parongpong",
      rating: 5,
    },
    {
      name: "Pets & Care Bandung",
      image: careImg,
      address: "Jl. Sukajadi No. 40",
      rating: 4,
    },
  ];

  onlineShops.value = [
    {
      source: "SHOPEE.CO.ID",
      name: "Toko Kucing Gemoy",
      description:
        "Menjual perlengkapan grooming dan makanan dengan harga terjangkau.",
      link: "https://shopee.co.id",
    },
    {
      source: "PETCARE.ID",
      name: "MeongCare",
      description:
        "Menjual produk kesehatan dan perawatan premium dari dokter hewan.",
      link: "https://petcare.id",
    },
    {
      source: "TOKOPEDIA.COM",
      name: "CatLovers Store",
      description: "Makanan dan vitamin favorit untuk hewan peliharaan kamu!",
      link: "https://tokopedia.com",
    },
  ];
});

const scrollCarousel = (type, direction) => {
  const carousel =
    type === "petshops" ? petshopsCarousel.value : onlineCarousel.value;
  const scrollAmount = carousel.offsetWidth * 0.8;
  carousel.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  background-color: #e5f2ff;
  color: #002b5b;
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
