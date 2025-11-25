<template>
  <div class="forum-page-wrapper">
    <NavbarLogin v-if="isLoggedIn" />
    <Navbar v-else />

    <main class="forum-layout-container">
      <aside class="forum-sidebar">
        <div class="sidebar-header-mobile">
          <button class="mobile-menu-toggle" @click="toggleSidebar">
            <span>{{ isSidebarOpen ? 'Tutup Kategori' : 'Pilih Kategori' }}</span>
          </button>
        </div>
        
        <nav :class="{ 'mobile-hidden': !isSidebarOpen }"> 
          <ul class="sidebar-menu">
            <li 
              v-for="item in sidebarItems" 
              :key="item.path" 
              :class="{ 'active': $route.path === item.path }"
            >
              <router-link :to="item.path" @click="closeSidebarOnMobile">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <section class="forum-main-content">
        <h1 class="main-title">{{ activeCategoryTitle }}</h1>

        <div v-if="isLoading" class="loading-state">Memuat diskusi...</div>
        <div v-else-if="errorMessage" class="error-state">{{ errorMessage }}</div>

        <div v-else class="topic-list">
          <div 
            v-for="topic in topics" 
            :key="topic.id" 
            class="discussion-card"
            @click="openTopicDetail(topic)" 
          >
            <h2>{{ topic.title }}</h2>
            
            <div class="topic-meta">
              <span class="author-name">Oleh: {{ topic.users ? topic.users.nama : 'Anonim' }}</span>
            </div>
            
            <p class="topic-excerpt">"{{ truncateText(topic.teks) }}"</p>
            <button class="response-btn">Lihat Detail & Balasan</button> 
          </div>
          
          <div v-if="topics.length === 0" class="no-topic-message">
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
            <label>Kategori</label>
            <select v-model="newTopic.category" required>
              <option v-for="item in sidebarItems" :key="item.dbCategory" :value="item.dbCategory">
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Judul Topik</label>
            <input v-model="newTopic.title" type="text" placeholder="Contoh: Kucing saya tidak mau makan" required>
          </div>
          <div class="form-group">
            <label>Isi Diskusi</label>
            <textarea v-model="newTopic.teks" rows="4" placeholder="Jelaskan detailnya..." required></textarea>
          </div>
          <div class="modal-footer">
            <button type="submit" class="submit-modal-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Mengirim...' : 'Kirim' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-container detail-modal">
        <div class="modal-header">
          <h2>{{ threadDetail?.title || selectedTopic.title }}</h2>
          <button class="close-btn" @click="closeDetailModal">&times;</button>
        </div>
        
        <div class="topic-detail-content">
          <div class="main-post">
            <p class="detail-meta">
              Penulis: <strong>{{ threadDetail?.users?.nama || selectedTopic.users?.nama }}</strong> | 
              Kategori: {{ getCategoryName(threadDetail?.category || selectedTopic.category) }}
            </p>
            <div class="detail-excerpt">{{ threadDetail?.teks || selectedTopic.teks }}</div>
          </div>

          <hr class="divider">

          <div class="comments-section">
            <h3>Balasan</h3>
            
            <div v-if="!threadDetail" class="loading-comments">Memuat balasan...</div>
            
            <div v-else-if="threadDetail.posts && threadDetail.posts.length > 0" class="comments-list">
              <div v-for="post in threadDetail.posts" :key="post.id" class="comment-item">
                <div class="comment-header">
                  <strong>{{ post.users ? post.users.nama : 'User' }}</strong>
                </div>
                <p class="comment-text">{{ post.teks }}</p>
              </div>
            </div>
            
            <div v-else class="no-comments">
              Belum ada balasan. Jadilah yang pertama!
            </div>
          </div>

          <div class="comment-form-wrapper">
            <form @submit.prevent="submitComment">
              <textarea 
                v-model="newCommentText" 
                placeholder="Tulis balasan Anda di sini..." 
                rows="3"
                class="comment-input"
                required
              ></textarea>
              <button type="submit" class="send-reply-btn" :disabled="isCommentSubmitting">
                {{ isCommentSubmitting ? 'Mengirim...' : 'Kirim Balasan' }}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue'; 
import NavbarLogin from '../components/NavbarLogin.vue';

const isLoggedIn = ref(false);

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true;
  }
});

const route = useRoute();

// STATE UTAMA
const topics = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);
const showNewTopicModal = ref(false);
const isSidebarOpen = ref(false);
// PERUBAHAN: Menambahkan properti 'category' ke dalam state newTopic
const newTopic = ref({ title: '', teks: '', category: '' });

// STATE DETAIL & KOMENTAR
const showDetailModal = ref(false);
const selectedTopic = ref({});
const threadDetail = ref(null);
const newCommentText = ref('');
const isCommentSubmitting = ref(false);

const sidebarItems = ref([
  { name: 'Lost & Found Cats', path: '/forum/lost-found', dbCategory: 'lost-found' },
  { name: 'Adoption Stories', path: '/forum/stories', dbCategory: 'stories' },
  { name: 'Cat Health & Care', path: '/forum/health', dbCategory: 'health' },
  { name: 'Food & Nutrition', path: '/forum/nutrition', dbCategory: 'nutrition' }, 
  { name: 'Rescue & Volunteering', path: '/forum/rescue', dbCategory: 'rescue' },
]);

const activeCategoryTitle = computed(() => {
  const item = sidebarItems.value.find(i => i.path === route.path);
  return item ? item.name : 'Forum Diskusi';
});

const currentDbCategory = computed(() => {
  const item = sidebarItems.value.find(i => i.path === route.path);
  return item ? item.dbCategory : 'general';
});

// Helper untuk menampilkan nama kategori yang cantik di detail
const getCategoryName = (dbCat) => {
  const item = sidebarItems.value.find(i => i.dbCategory === dbCat);
  return item ? item.name : dbCat;
};

const fetchThreads = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  topics.value = [];
  try {
    const response = await axios.get(`http://localhost:3000/api/forum`, {
      params: { category: currentDbCategory.value }
    });
    topics.value = response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Gagal memuat data. Pastikan server backend menyala.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchThreads);
watch(() => route.path, fetchThreads);

const truncateText = (text) => text && text.length > 100 ? text.substring(0, 100) + '...' : text;
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
const closeSidebarOnMobile = () => { if (window.innerWidth <= 992) isSidebarOpen.value = false; };

// MODAL TOPIC BARU
const openNewTopicModal = () => { 
  // PERUBAHAN: Set default kategori sesuai halaman yang sedang dibuka
  newTopic.value.category = currentDbCategory.value;
  showNewTopicModal.value = true; 
};

const closeNewTopicModal = () => { 
  showNewTopicModal.value = false; 
  newTopic.value = { title: '', teks: '', category: '' }; 
};

const submitNewTopic = async () => {
  isSubmitting.value = true;
  try {
    const token = localStorage.getItem('token'); 
    if (!token) { alert("Silakan login terlebih dahulu!"); return; }

    await axios.post('http://localhost:3000/api/forum', {
      title: newTopic.value.title,
      // PERUBAHAN: Mengirim kategori yang dipilih user, bukan currentDbCategory
      category: newTopic.value.category,
      teks: newTopic.value.teks
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Topik berhasil dibuat!');
    closeNewTopicModal();
    fetchThreads(); 
  } catch (error) {
    console.error(error);
    alert('Gagal membuat topik. Pastikan Anda sudah login.');
  } finally {
    isSubmitting.value = false;
  }
};

// MODAL DETAIL & LOGIKA KOMENTAR
const openTopicDetail = async (topic) => {
  selectedTopic.value = topic; 
  showDetailModal.value = true;
  threadDetail.value = null; 
  newCommentText.value = '';
  
  try {
    const response = await axios.get(`http://localhost:3000/api/forum/${topic.id}`);
    threadDetail.value = response.data;
  } catch (error) {
    console.error("Gagal memuat detail diskusi:", error);
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  threadDetail.value = null;
  newCommentText.value = '';
};

const submitComment = async () => {
  if (!newCommentText.value.trim()) return;
  
  isCommentSubmitting.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) { alert("Silakan login untuk berkomentar!"); return; }

    const response = await axios.post(`http://localhost:3000/api/forum/${selectedTopic.value.id}/posts`, {
      teks: newCommentText.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (threadDetail.value) {
      if (!threadDetail.value.posts) threadDetail.value.posts = [];
      threadDetail.value.posts.push(response.data);
    }
    
    newCommentText.value = ''; 
  } catch (error) {
    console.error(error);
    alert('Gagal mengirim komentar. Pastikan Anda login.');
  } finally {
    isCommentSubmitting.value = false;
  }
};

</script>

<style scoped>
/* =================================================================
   GAYA UMUM & LAYOUT
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

/* SIDEBAR */
.forum-sidebar {
  max-width: 280px; 
  min-width: 280px;
  padding: 30px 0;
  margin-right: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sidebar-header-mobile { display: none; }

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

/* KONTEN UTAMA */
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
  transition: transform 0.2s;
}
.discussion-card:hover {
  transform: translateY(-3px);
}

.topic-meta {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.author-name {
  font-weight: 600;
  color: #0077c2;
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 5px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* =================================================================
   GAYA MODAL
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
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
}

.form-group { margin-bottom: 20px; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}

input[type="text"], 
textarea, 
select {
    width: 100%;
    padding: 12px; /* Sedikit diperbesar agar lebih lega */
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 1rem; /* Pastikan ukuran font sama */
    background-color: white; /* Penting: agar background konsisten putih */
    color: #333;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.disabled-input {
  background-color: #e9ecef;
  color: #6c757d;
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
.submit-modal-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* =================================================================
   GAYA DETAIL & KOMENTAR (BARU)
================================================================= */
.topic-detail-content { padding-top: 0; }
.detail-meta { font-size: 0.9em; color: #666; margin-bottom: 15px; }
.detail-excerpt {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.divider {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #eee;
}

.comments-section h3 {
  color: #0077c2;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}

.comment-item {
  background-color: #f9f9f9;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid #ddd;
}

.comment-header strong {
  color: #444;
  font-size: 0.9em;
}

.comment-text {
  margin: 5px 0 0 0;
  color: #333;
  font-size: 0.95em;
  line-height: 1.4;
}

.comment-form-wrapper { margin-top: 15px; }

.comment-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 10px;
}

.send-reply-btn {
  background-color: #0077c2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  float: right;
}
.send-reply-btn:disabled { background-color: #ccc; }

/* =================================================================
   RESPONSIVITAS
================================================================= */
@media (max-width: 992px) {
  .forum-layout-container {
    flex-direction: column; 
    padding: 15px;
    min-height: unset;
    max-width: 100%; 
    width: 100%;
    box-sizing: border-box;
  }

  .forum-sidebar {
    max-width: 100%;
    min-width: unset; 
    width: 100%; 
    padding: 10px 15px; 
    border-radius: 15px; 
    margin-bottom: 20px;
    min-height: unset; 
    margin: 10px 0;
    box-sizing: border-box;
  }

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

  .forum-sidebar nav.mobile-hidden { display: none; }

  .forum-sidebar nav {
    display: block; 
    padding: 10px 0;
    border-top: 1px solid #0077c2;
    margin-top: 10px;
  }

  .forum-main-content {
    flex-grow: 1;
    width: 100%; 
    padding: 20px;
    min-height: unset;
    border-radius: 15px; 
    box-sizing: border-box; 
  }
  .add-topic-btn {
    width: 50px;
    height: 50px;
    font-size: 2.5rem;
    padding-bottom: 2px;
  }
}

@media (max-width: 600px) {
  .forum-layout-container { padding: 10px; }
  .forum-main-content { padding: 15px; }
  .main-title { font-size: 1.8rem; margin-bottom: 20px; }
  .modal-container {
    width: calc(100% - 20px); 
    margin: 10px;
    padding: 20px;
  }
  .modal-header h2 { font-size: 1.3rem; }
  .submit-modal-btn { width: 100%; padding: 12px; }
}
</style>