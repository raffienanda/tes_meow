<template>
  <Navbar />

  <section class="article-hero error" v-if="isError">
    <div class="article-header-container">
      <p class="article-kategori">ERROR</p>
      <h1>Artikel Tidak Ditemukan</h1>
      <div class="article-meta">
        <span>404 - Artikel mungkin telah dihapus</span>
      </div>
    </div>
  </section>

  <section class="article-content-wrapper" v-if="isError">
    <div class="main-article-content">
      <img
        src="https://placehold.co/800x450/455A64/FFFFFF?text=404+Not+Found"
        class="article-main-image"
      />

      <div class="article-body">
        <p>Maaf, artikel yang Anda cari tidak ditemukan.</p>
      </div>

      <div class="cta-section">
        <router-link to="/catpedia" class="back-link">
          ← Kembali ke CatPedia
        </router-link>
      </div>
    </div>
  </section>

  <section class="article-hero" v-else>
    <div class="article-header-container">
      <p class="article-kategori">{{ artikel.category }}</p>
      <h1>{{ artikel.nama }}</h1>
    </div>
  </section>

  <section class="article-content-wrapper" v-if="!isError">
    <div class="main-article-content">
      <img 
        :src="getImgUrl(artikel.img_url)" 
        :alt="artikel.nama" 
        class="article-main-image" 
      />

      <div class="article-body" v-html="artikel.teks"></div>

      <div class="cta-section">
        <router-link to="/catpedia" class="back-link">
          ← Kembali ke CatPedia
        </router-link>
      </div>
    </div>

    <aside class="sidebar-related-articles" v-if="related.length">
      <h2>Artikel Terkait</h2>

      <div
        v-for="rel in related"
        :key="rel.id"
        class="related-card"
      >
        <router-link :to="'/artikel/' + rel.id">
          <p class="related-category">{{ rel.category }}</p>
          <h3>{{ rel.nama }}</h3>
        </router-link>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"; // 1. Tambahkan 'watch' disini
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";

const route = useRoute();
const artikel = ref({});
const related = ref([]);
const isError = ref(false);

function getImgUrl(path) {
  if (!path) return 'https://placehold.co/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  let cleanPath = path.replace(/\\/g, '/');
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
  return `http://localhost:3000/uploads/img-artikel/${cleanPath}`;
}

async function loadArticle() {
  // Pastikan mengambil ID terbaru dari route saat fungsi dipanggil
  const id = route.params.id; 

  try {
    // Reset error state sebelum fetch baru
    isError.value = false; 
    const res = await fetch(`/api/artikel/${id}`);

    if (res.status === 404) {
      isError.value = true;
      return;
    }

    artikel.value = await res.json();
  } catch (e) {
    isError.value = true;
  }
}

async function loadRelated() {
  try {
    const res = await fetch(`/api/artikel?limit=4`);
    const json = await res.json();

    related.value = json.data
      .filter((a) => a.id !== Number(route.params.id))
      .slice(0, 3);
  } catch (e) {
    console.error("Gagal memuat artikel terkait", e);
  }
}

onMounted(() => {
  loadArticle();
  loadRelated();
});

// 2. Tambahkan kode ini agar data berubah saat tombol diklik
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadArticle();
      loadRelated();
      // Opsional: Scroll ke atas saat pindah artikel
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
);
</script>

<style scoped>
/* CSS TIDAK BERUBAH DARI SEBELUMNYA */
body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  background-color: #e5f2ff;
  color: #002b5b;
}

.article-hero {
  color: #fffce8;
  padding: clamp(30px, 6vw, 60px) 0;
  margin-top: -20px; 
  display: flex;
  justify-content: center;
}

.article-header-container {
  width: 90%;
  max-width: 1000px;
  text-align: left;
}

.article-header-container h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  margin: 10px 0;
  line-height: 1.2;
}

.article-kategori {
  display: inline-block;
  background-color: #ffeeb3;
  color: #002b5b;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.article-meta {
  font-size: 0.9rem;
  color: #b6dbff;
  margin-top: 15px;
}

.separator {
  margin: 0 8px;
}

.article-content-wrapper {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 90%;
  max-width: 1200px;
  margin: 40px auto 80px;
}

.main-article-content {
  flex: 3;
  min-width: 0; 
}

.article-main-image {
  width: 100%;
  height: auto;
  max-height: 225px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-body {
  background-color: #fff;
  padding: clamp(20px, 4vw, 40px);
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  line-height: 1.8;
  color: #333;
}

.article-body p {
  margin-bottom: 1.5em;
  font-size: 1rem;
}

.article-body h2,
.article-body h3 {
  color: #0b4b92;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
}

.article-body ul {
  padding-left: 20px;
  margin-bottom: 1.5em;
}

.article-body li {
  margin-bottom: 0.5em;
}

.sidebar-related-articles {
  flex: 1;
  max-width: 300px;
  background-color: #b6dbff;
  padding: 20px;
  border-radius: 15px;
  align-self: flex-start; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.sidebar-related-articles h2 {
  color: #0b4b92;
  font-size: 1.25rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #0b4b92;
  padding-bottom: 10px;
}

.related-card {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #0b4b9240;
}

.related-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.related-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.related-card a:hover h3 {
  color: #0077c2;
  text-decoration: underline;
}

.related-category {
  font-size: 0.75rem;
  color: #002b5b;
  font-weight: 600;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.related-card h3 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  transition: color 0.2s;
}

.cta-section {
  margin-top: 40px;
  text-align: center;
}

.back-link {
  display: inline-block;
  background-color: #0077c2;
  color: white;
  padding: 10px 25px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #005b99;
}

@media (max-width: 900px) {
  .article-content-wrapper {
    flex-direction: column;
    gap: 30px;
  }

  .sidebar-related-articles {
    max-width: 100%;
    order: 2; 
  }

  .main-article-content {
    order: 1;
  }
}
</style>