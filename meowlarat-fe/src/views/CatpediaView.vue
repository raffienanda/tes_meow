<template>
  <Navbar />

  <!-- Hero Section -->
  <section class="catpedia-hero">
    <div class="hero-content">
      <h1><span>Cat</span>Pedia</h1>
      <p>Pusat panduan, fakta, dan informasi untuk merawat kucing Anda.</p>
    </div>
  </section>

  <!-- Artikel Wrapper (satu kotak biru muda besar) -->
  <section class="artikel-wrapper">
    <!-- Artikel Populer -->
    <div class="artikel-populer" v-if="popularArticles.length">
      <h2 class="section-title">Artikel Populer</h2>
      <div class="artikel-populer" v-if="popularArticles.length">
        <div
          v-for="(article, index) in popularArticles"
          :key="index"
          class="artikel-card populer"
        >
        <div class="artikel-card-left">
            <img src="../assets/img/cat-icon.png" alt="Kucing lucu" />
          </div>
        <div class="artikel-card-right">
          <p class="artikel-kategori">{{ article.category }}</p>
          <h3>{{ article.title }}</h3>
          <p class="desc">{{ article.description }}</p>
          <router-link :to="'/artikel/' + article.slug" class="readmore">
            Baca Selengkapnya →
          </router-link>
        </div>
        </div>
      </div>
    </div>
    <!-- Artikel Terbaru -->
    <div class="artikel-terbaru-section">
      <h2 class="section-title">Artikel Terbaru</h2>
      <div class="artikel-grid" v-if="latestArticles.length">
        <div
          v-for="(article, index) in latestArticles"
          :key="index"
          class="artikel-card"
          :class="article.colorClass"
        >
          <div class="artikel-kategori">{{ article.category }}</div>
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
          <router-link :to="'/artikel/' + article.slug" class="readmore">
            Baca Selengkapnya →
          </router-link>
        </div>
      </div>
      <button class="load-more">Lebih Banyak</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";

const popularArticles = ref([]);
const latestArticles = ref([]);

onMounted(async () => {
  popularArticles.value = [
    {
      category: "KESEHATAN & POPULASI",
      title: "Mengapa Program TNR Penting untuk Kucing Liar?",
      description:
        "Program Trap-Neuter-Return (TNR) adalah metode yang paling manusiawi dan efektif untuk mengelola populasi kucing liar.",
      slug: "program-tnr-kucing-liar",
      image: new URL("../assets/img/cat-icon.png", import.meta.url).href,

    },
  ];

  latestArticles.value = [
    {
      category: "KESEHATAN",
      title: "Mengenali Gejala Awal FIV dan Pencegahannya",
      description:
        "Virus FIV sering luput dari perhatian. Ketahui tanda-tanda yang harus diwaspadai dan langkah proaktif.",
      slug: "gejala-fiv-pencegahan",
      colorClass: "red-border",
    },
    {
      category: "PERAWATAN",
      title: "Panduan Grooming Dasar untuk Kucing Rumahan",
      description:
        "Tips mudah memandikan, menyikat bulu, dan memotong kuku kucing tanpa membuatnya stres.",
      slug: "panduan-grooming-kucing",
      colorClass: "purple-border",
    },
    {
      category: "PERILAKU",
      title: "Cara Mengatasi Agresivitas Mendadak pada Kucing",
      description:
        "Jika kucing Anda tiba-tiba menjadi agresif, itu bisa jadi pertanda masalah kesehatan atau lingkungan.",
      slug: "mengatasi-agresivitas-kucing",
      colorClass: "orange-border",
    },
    {
      category: "NUTRISI",
      title: "Memilih Makanan Basah vs. Kering: Mana yang Terbaik?",
      description:
        "Perdebatan klasik: dry food atau wet food? Kami mengupas tuntas manfaat dan kekurangan masing-masing.",
      slug: "makanan-basah-vs-kering",
      colorClass: "green-border",
    },
  ];
});
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  background-color: #e5f2ff;
  color: #002b5b;
}

/* Hero Section */
.catpedia-hero {

  
  border-radius: 20px;
  padding: clamp(25px, 5vw, 50px);
  width: 90%;
  max-width: 1150px;
  margin: clamp(-30px, -5vw, -60px) auto 60px
  
  /* padding: clamp(40px, 8vw, 80px) clamp(20px, 8vw, 100px);
  max-width: 1150px;

  color: #fffce8;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0; */
}

.hero-content {
  max-width: 900px;
  text-align: left;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #ffeeb3;
}

.hero-content h1 span {
  color: #fff;
}

.hero-content p {
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 600;
  margin-top: 10px;
  color: #fffce8;
}

/* Artikel Wrapper */
.artikel-wrapper {
  background-color: #b6dbff;
  border-radius: 20px;
  padding: clamp(25px, 5vw, 50px);
  width: 90%;
  max-width: 1150px;
  margin: clamp(-30px, -5vw, -60px) auto 60px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Section Titles */
.section-title {
  color: #0b4b92;
  font-weight: 700;
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  margin-bottom: clamp(20px, 3vw, 30px);
}

/* Artikel Populer */
.artikel-card.populer {
  display: flex;
  background: hsl(165, 100%, 94%);
  border-radius: 20px;
  overflow: hidden;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.artikel-card.populer:hover {
  transform: translateY(-4px);
}

.artikel-card-left {
  flex: 0 0 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #a7f3e6;
  padding: clamp(15px, 3vw, 25px);
}

.artikel-card-left img.artikel-image {
  width: 100%;
  height: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 16px;
}

.artikel-card-right {
  flex: 1;
  padding: clamp(20px, 4vw, 40px);
}

.artikel-card-right h3 {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  margin: 10px 0;
  color: #333;
}

.artikel-card-right p {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #555;
  margin-bottom: 10px;
}

.readmore {
  color: #008e79;
  font-weight: 600;
  text-decoration: none;
}

.readmore:hover {
  text-decoration: underline;
}

/* Artikel Terbaru */
.artikel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(15px, 3vw, 25px);
  width: 100%;
}

.artikel-card {
  background: #fff;
  border-radius: 20px;
  padding: clamp(18px, 3vw, 25px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}

.artikel-card:hover {
  transform: translateY(-3px);
}

.load-more {
  display: block;
  margin: clamp(25px, 4vw, 35px) auto 0;
  background-color: #0077c2;
  color: white;
  padding: clamp(10px, 2vw, 12px) clamp(20px, 3vw, 30px);
  border-radius: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.load-more:hover {
  background-color: #005b99;
}

/* Category Borders */
.red-border {
  border-top: 4px solid #ff4d4d;
}
.purple-border {
  border-top: 4px solid #c77dff;
}
.orange-border {
  border-top: 4px solid #ffa54d;
}
.green-border {
  border-top: 4px solid #52d17a;
}

/* Responsive */
@media (max-width: 800px) {
  .artikel-card.populer {
    flex-direction: column;
  }

  .artikel-card-left {
    width: 100%;
  }

  .hero-content {
    text-align: left;
    padding: 0 10px;
  }
}
</style>
