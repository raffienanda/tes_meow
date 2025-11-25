<template>
  <Navbar />

  <section class="catpedia-hero">
    <div class="hero-content">
      <h1><span>Cat</span>Pedia</h1>
      <p>Pusat panduan, fakta, dan informasi untuk merawat kucing Anda.</p>
    </div>
  </section>

  <section class="artikel-wrapper">

    <div class="artikel-populer" v-if="todaysArticle">
      <h2 class="section-title">Artikel Hari Ini</h2>

      <div class="artikel-card populer">
        <div class="artikel-card-left">
          <img :src="getImgUrl(todaysArticle.img_url)" alt="Kucing lucu" />
        </div>

        <div class="artikel-card-right">
          <p class="artikel-kategori">{{ todaysArticle.category }}</p>
          <h3>{{ todaysArticle.nama }}</h3>
          <p class="desc">{{ todaysArticle.teks_snippet }}</p>

          <router-link :to="'/artikel/' + todaysArticle.id" class="readmore">
            Baca Selengkapnya →
          </router-link>
        </div>
      </div>
    </div>

    <div class="artikel-terbaru-section">
      <h2 class="section-title">Artikel Terbaru</h2>

      <div class="artikel-grid" v-if="latestArticles.length">
        <div
          v-for="article in latestArticles"
          :key="article.id"
          class="artikel-card"
          :style="{ borderTop: '4px solid ' + article.color }"
        >
          <div class="artikel-kategori">{{ article.category }}</div>
          <h3>{{ article.nama }}</h3>
          <p>{{ article.teks_snippet }}</p>

          <router-link :to="'/artikel/' + article.id" class="readmore">
            Baca Selengkapnya →
          </router-link>
        </div>
      </div>

      <button class="load-more" @click="loadMore">Lebih Banyak</button>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";

const todaysArticle = ref(null);
const latestArticles = ref([]);
const page = ref(1);
const limit = 6;

// --- PERBAIKAN 3: Fungsi Helper URL Gambar ---
function getImgUrl(path) {
  // 1. Jika path kosong/null, return placeholder
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  
  // 2. Jika path sudah http (link luar/picsum), langsung pakai
  if (path.startsWith('http')) return path;

  // 3. Bersihkan path dari double slash atau backslash
  let cleanPath = path.replace(/\\/g, '/');
  // Hapus slash di depan jika ada (biar ga double //)
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

  // 4. Gabungkan dengan URL Backend
  return `http://localhost:3000/uploads/img-artikel/${cleanPath}`;
}

async function fetchArticles() {
  try {
    const res = await fetch(`/api/artikel?page=${page.value}&limit=${limit}`);
    const json = await res.json();

    if (page.value === 1 && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      todaysArticle.value = json.data[randomIndex];
    }

    latestArticles.value.push(...json.data);
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
  }
}

function loadMore() {
  page.value++;
  fetchArticles();
}

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
/* ... Style CSS TETAP SAMA seperti file aslimu ... */
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
  margin: clamp(-30px, -5vw, -60px) auto 60px;
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
  background-color: hsl(165, 100%, 94%);
  padding: clamp(15px, 3vw, 25px);
}

.artikel-card-left img {
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