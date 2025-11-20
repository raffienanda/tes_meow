<template>
  <div class="forum-page-wrapper">

    <Navbar /> 

    <main class="forum-layout-container">

      <aside class="forum-sidebar">
        <div class="sidebar-header-mobile">
          <button class="mobile-menu-toggle" @click="toggleSidebar">
            <svg v-if="!isSidebarOpen" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <span>Kategori</span>
          </button>
        </div>
        
        <nav :class="{ 'mobile-hidden': !isSidebarOpen }"> 
          <ul class="sidebar-menu">
            <li 
              v-for="item in sidebarItems" 
              :key="item.path" 
              :class="{ 'active': $route.path === item.path }"
            >
              <router-link :to="item.path" @click="closeSidebarOnMobile">{{ item.name }}</router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <section class="forum-main-content">
        <h1 class="main-title">{{ activeCategoryTitle }}</h1>

        <div class="topic-list">
          <div 
            v-for="(topic, index) in activeTopics" 
            :key="index" 
            class="discussion-card"
            @click="openTopicDetail(topic)" 
          >
            <h2>{{ topic.title }}</h2>
            <div class="topic-meta">
              <span>{{ topic.author }}</span>
              <span class="meta-dot"> • </span>
              <span class="time-ago">{{ topic.time }}</span>
            </div>
            <p class="topic-excerpt">"{{ topic.excerpt }}"</p>
            <button class="response-btn">Add response</button> 
          </div>
          
          <div v-if="activeTopics.length === 0" class="no-topic-message">
            Belum ada topik diskusi di kategori ini. Jadilah yang pertama memulai!
          </div>

        </div>
        
        <button class="add-topic-btn" @click="openNewTopicModal">+</button>
        
      </section>
    </main>

        <div v-if="showNewTopicModal" class="modal-overlay" @click.self="closeNewTopicModal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Buat Topik Baru</h2>
          <button class="close-btn" @click="closeNewTopicModal">&times;</button>
        </div>
        <form @submit.prevent="submitNewTopic">
          <div class="form-group">
            <label for="forum-type">Jenis Forum</label>
            <select id="forum-type" v-model="newTopic.forum_type" required>
              <option value="" disabled>Pilih Kategori</option>
              <option 
                v-for="item in sidebarItems" 
                :key="item.path" 
                :value="item.name"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="title">Judul Topik</label>
            <input 
              type="text" 
              id="title" 
              v-model="newTopic.title" 
              placeholder="Contoh: Kucing saya tidak mau makan" 
              required
            >
          </div>
          <div class="form-group">
            <label for="description">Deskripsi Lengkap</label>
            <textarea 
              id="description" 
              v-model="newTopic.excerpt" 
              rows="4" 
              placeholder="Jelaskan masalah, pertanyaan, atau topik diskusi Anda secara detail..." 
              required
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="submit" class="submit-modal-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>

        <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-container detail-modal">
        <div class="modal-header">
          <h2>{{ selectedTopic.title }}</h2>
          <button class="close-btn" @click="closeDetailModal">&times;</button>
        </div>
        <div class="topic-detail-content">
          <p class="detail-meta">
            Oleh <strong>{{ selectedTopic.author }}</strong> • {{ selectedTopic.time }}
          </p>
          <p class="detail-excerpt">
            {{ selectedTopic.excerpt }}
            <br><br>
          </p>
          <hr>
          <h3 class="replies-title">Balasan (1)</h3>
          <div class="reply-card">
              <p><strong>Bambang S:</strong> Wah, kasusnya mirip kucing saya. Coba ganti jenis mangkuk makannya, kadang itu membantu!</p>
              <span class="reply-time">1 mnt lalu</span>
          </div>
          <div class="form-group add-reply">
              <textarea placeholder="Tulis balasan Anda di sini..." rows="2"></textarea>
              <button class="submit-modal-btn small-btn">Kirim Balasan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue'; 

const route = useRoute();

// =================================================================
// 📌 LOGIKA RESPONSIVITAS MOBILE BARU
// =================================================================
const isSidebarOpen = ref(false); 

const toggleSidebar = () => {
isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebarOnMobile = () => {
// Tutup sidebar hanya jika lebar layar di bawah 992px (lebar tablet/mobile)
if (window.innerWidth <= 992) { 
 isSidebarOpen.value = false;
}
};
// =================================================================

// DUMMY DATA (TIDAK BERUBAH)
const sidebarItems = ref([
{ name: 'Lost & Found Cats', path: '/forum/lost-found' },
{ name: 'Adoption Stories', path: '/forum/stories' },
{ name: 'Cat Health & Care', path: '/forum/health' },
{ name: 'Food & Nutrition', path: '/forum/nutrition' }, 
{ name: 'Rescue & Volunteering', path: '/forum/rescue' },
]);

const allDummyTopics = {
'/forum/nutrition': [
 { title: 'Makanan kering vs basah, mana lebih baik?', author: 'Andi P', time: '5 mnt yang lalu', excerpt: 'Halo semuanya, aku masih bingung mau kasih makanan kering atau basah untuk kucingku. Ada yang bisa jelasin kelebihan dan kekurangannya?' },
 { title: 'Resep makanan rumahan untuk kucing', author: 'Rina M', time: '2 jam lalu', excerpt: 'Ada yang pernah bikin makanan kucing sendiri di rumah? Aku ingin coba buat yang sehat dan aman, biar nggak terus beli makanan kemasan.' }
],
'/forum/lost-found': [
 { title: 'Kucing Oren hilang di daerah Bandung', author: 'Budi H', time: '1 hari yang lalu', excerpt: 'Kucing saya warna oren dengan kalung biru hilang sejak kemarin. Mohon bantuannya.' },
],
'/forum/stories': [
 { title: 'Akhirnya Meong menemukan rumah permanen!', author: 'Lisa D', time: '2 hari yang lalu', excerpt: 'Setelah 6 bulan menunggu, Meong diadopsi oleh keluarga yang sangat menyayanginya! Terimakasih Meowlarat!' }
],
'/forum/health': [
 { title: 'Tips Pertolongan Pertama untuk Kucing Muntah', author: 'Dr. Hewan', time: '1 minggu lalu', excerpt: 'Muntah adalah hal umum, tapi kapan kita harus panik? Berikut tips pertolongan pertama...' }
],
'/forum/rescue': [
 { title: 'Butuh relawan untuk memberi makan kucing liar di Jakarta Timur', author: 'Komunitas CatCare', time: '4 jam lalu', excerpt: 'Kami membutuhkan 3 relawan lagi untuk membantu feeding day besok pagi.' }
],
};


// LOGIKA MODAL (TIDAK BERUBAH)
const showNewTopicModal = ref(false);
const openNewTopicModal = () => { showNewTopicModal.value = true; };
const closeNewTopicModal = () => { 
showNewTopicModal.value = false;
newTopic.value = { forum_type: '', title: '', excerpt: '', author: 'Pengguna Baru', time: 'Baru saja' };
};
const newTopic = ref({ forum_type: '', title: '', excerpt: '', author: 'Pengguna Baru', time: 'Baru saja', });
const submitNewTopic = () => {
const selectedItem = sidebarItems.value.find(item => item.name === newTopic.value.forum_type);
const targetPath = selectedItem ? selectedItem.path : '/forum/nutrition'; 

if (allDummyTopics[targetPath]) {
 allDummyTopics[targetPath].unshift({ title: newTopic.value.title, author: newTopic.value.author, time: newTopic.value.time, excerpt: newTopic.value.excerpt, });
 alert(`Topik baru berhasil ditambahkan ke kategori ${newTopic.value.forum_type}!`);
} else {
 alert('Gagal menemukan kategori tujuan.');
}
closeNewTopicModal();
};
const showDetailModal = ref(false);
const selectedTopic = ref({}); 
const openTopicDetail = (topic) => {
selectedTopic.value = topic; 
showDetailModal.value = true; 
};
const closeDetailModal = () => {
showDetailModal.value = false;
selectedTopic.value = {}; 
};

// LOGIKA KOMPUTASI (TIDAK BERUBAH)
const activeTopics = computed(() => {
return allDummyTopics[route.path] || []; 
});

const activeCategoryTitle = computed(() => {
 const activeItem = sidebarItems.value.find(item => item.path === route.path);
 return activeItem ? activeItem.name : 'Forum Diskusi';
});
</script>

<style scoped>
/* =================================================================
GAYA UMUM & LAYOUT (Desktop Default)
================================================================= */
.forum-page-wrapper {
background-color: #f0f8ff; 
overflow-x: hidden;
}

.forum-layout-container {
display: flex;
max-width: 1200px; 
margin: 0 auto;
min-height: calc(100vh - 80px);
padding: 30px 20px;
}

.forum-sidebar, .forum-main-content {
background-color: #DEF1FF; 
border-radius: 30px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
min-height: 700px;
}

/* =================================================================
GAYA SIDEBAR (Desktop Default)
================================================================= */
.forum-sidebar {
max-width: 280px; 
min-width: 280px;
padding: 30px 0;
margin-right: 20px;
border-top-right-radius: 0;
border-bottom-right-radius: 0;
}

/* Sembunyikan header mobile di desktop */
.sidebar-header-mobile {
display: none;
}

.sidebar-menu {
list-style: none;
padding: 0;
margin: 0;
}

.sidebar-menu li a {
display: block;
padding: 12px 30px;
color: #333;
text-decoration: none;
font-size: 1.1em;
font-weight: 500;
transition: background-color 0.2s, color 0.2s;
}

.sidebar-menu li a.router-link-active, .sidebar-menu li.active a {
background-color: #0077c2; 
color: white;
font-weight: 600; 
border-radius: 10px;
margin: 10px;
}

.sidebar-menu li:hover a:not(.router-link-active) {
background-color: white; 
}

/* =================================================================
GAYA KONTEN UTAMA (Desktop Default)
================================================================= */
.forum-main-content {
flex-grow: 1; 
padding: 30px 40px;
position: relative;
border-top-left-radius: 0;
border-bottom-left-radius: 0;
}

.main-title {
font-size: 2.5rem;
color: #0077c2;
margin-bottom: 30px;
}

.discussion-card {
background-color: #f7f9fc; 
border-radius: 10px;
padding: 20px;
margin-bottom: 20px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
cursor: pointer;
}

.topic-meta {
 font-size: 0.9em;
 color: #666;
 margin-bottom: 10px;
}

.topic-excerpt {
 color: #444;
 margin: 10px 0;
 font-style: italic;
 border-left: 3px solid #ccc;
 padding-left: 10px;
}

.response-btn {
background: none;
border: none;
color: #0077c2;
cursor: pointer;
padding: 5px 0;
font-weight: 600;
}

.add-topic-btn {
position: fixed; 
bottom: 20px;
right: 20px;
z-index: 500;
width: 60px;
height: 60px;
background-color: #0077c2;
color: white;
border: none;
border-radius: 50%;
font-size: 3rem;
line-height: 1;
text-align: center;
cursor: pointer;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
display: flex;
justify-content: center;
align-items: center;
padding-bottom: 5px;
}

/* =================================================================
✅ GAYA MODAL UMUM (DIKEMBALIKAN)
================================================================= */
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5); 
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.modal-container {
background-color: white;
padding: 30px;
border-radius: 15px;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
width: 90%;
max-width: 600px;
position: relative;
margin: 20px; 
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
border-bottom: 1px solid #eee;
padding-bottom: 15px;
margin-bottom: 20px;
}

.modal-header h2 {
color: #0077c2;
margin: 0;
}

.close-btn {
background: none;
border: none;
font-size: 2rem;
cursor: pointer;
color: #333;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
}

input[type="text"], select, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: inherit;
}

.modal-footer {
    text-align: right;
    padding-top: 15px;
}

.submit-modal-btn {
background-color: #0077c2;
color: white;
padding: 10px 25px;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 1em;
font-weight: 600;
}


/* =================================================================
✅ GAYA MODAL DETAIL KHUSUS (DIKEMBALIKAN)
================================================================= */
.topic-detail-content {
  padding-top: 10px;
}

.detail-meta {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 20px;
}

.detail-excerpt {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 30px;
}

hr {
  border: 0;
  border-top: 1px solid #ddd;
  margin: 25px 0;
}

.replies-title {
  color: #0077c2;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.reply-card {
  background-color: #f0f8ff;
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #0077c2;
  margin-bottom: 15px;
}

.reply-card p {
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.reply-time {
  font-size: 0.8em;
  color: #999;
  display: block;
  text-align: right;
}

.add-reply {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-top: 30px;
}

.add-reply textarea {
  flex-grow: 1;
  resize: vertical;
}

.small-btn {
  padding: 8px 15px;
  white-space: nowrap;
}


/* =================================================================
RESPONSIVITAS
================================================================= */

/* TABLET & MOBILE (max-width: 992px) */
@media (max-width: 992px) {
  /* Ubah layout dari row (samping) menjadi column (atas-bawah) */
.forum-layout-container {
   flex-direction: column; 
   padding: 15px;
   min-height: unset;
    max-width: 100%; 
    width: 100%;
    box-sizing: border-box;
 }

/* Sidebar container: Ambil lebar penuh */
.forum-sidebar {
   max-width: 100%;
   min-width: unset; /* ❗ PERBAIKAN: Hapus min-width desktop */
   width: 100%; /* ❗ PERBAIKAN: Tambahkan width 100% eksplisit */
   padding: 10px 15px; 
   border-radius: 15px; 
   margin-bottom: 20px;
   min-height: unset; 
   margin: 10px 0;
    box-sizing: border-box;
 }

/* Tampilkan header mobile (tombol Kategori) */
.sidebar-header-mobile {
 display: block;
 padding: 5px 0; 
}

.mobile-menu-toggle {
 background-color: #0077c2;
 color: white;
 border: none;
 border-radius: 5px;
 padding: 10px 15px;
 font-size: 1em;
 cursor: pointer;
 display: flex;
 align-items: center;
 gap: 8px;
 font-weight: 600;
 width: 100%; 
 justify-content: center; 
}

/* Sembunyikan nav menu secara default di mobile */
.forum-sidebar nav.mobile-hidden {
 display: none;
}

/* Tampilkan nav menu saat isSidebarOpen=true */
.forum-sidebar nav {
 display: block; 
}
  
  /* Hilangkan margin dan padding yang mengganggu full width */
.forum-sidebar nav {
 padding: 10px 0;
 border-top: 1px solid #0077c2;
 margin-top: 10px;
}

/* Konten Utama: Ambil lebar penuh, tanpa margin kiri */
.forum-main-content {
   flex-grow: 1;
   width: 100%; /* ❗ PERBAIKAN: Tambahkan width 100% eksplisit */
   padding: 20px;
   min-height: unset;
   border-radius: 15px; 
    box-sizing: border-box; /* ❗ PENTING: Pastikan padding tidak menambah lebar */
 }
.add-topic-btn {
 width: 50px;
 height: 50px;
 font-size: 2.5rem;
 padding-bottom: 2px;
}
}

/* MOBILE KECIL (max-width: 600px) */
@media (max-width: 600px) {
.forum-layout-container {
 padding: 10px;
}

.forum-main-content {
 padding: 15px;
}

.main-title {
 font-size: 1.8rem;
 margin-bottom: 20px;
}

/* Modal di layar kecil */
.modal-container {
    width: calc(100% - 20px); 
    margin: 10px;
    padding: 20px;
    
    /* ❗ PERBAIKAN UTAMA: Batasi tinggi dan aktifkan scroll pada container detail modal */
    max-height: 90vh; /* Batasi tinggi modal hingga 90% dari tinggi viewport */
    overflow-y: auto; /* Aktifkan scroll vertikal jika konten melebihi max-height */
    
    /* Pastikan detail modal tidak terganggu oleh margin atas/bawah */
    display: flex;
    flex-direction: column; 
  }

.modal-header h2 {
 font-size: 1.5rem;
}

.submit-modal-btn {
 width: 100%;
 padding: 12px;
}

.add-reply {
 flex-direction: column; 
 gap: 5px;
 align-items: stretch;
}

.small-btn {
 width: 100%; 
}
}
</style>