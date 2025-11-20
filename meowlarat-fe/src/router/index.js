import { createRouter, createWebHistory } from 'vue-router'
import BerandaView from '@/views/BerandaView.vue'
import LoginView from '@/views/LoginView.vue'
import DaftarView from '@/views/DaftarView.vue'
import LaporView from '@/views/LaporView.vue'
import ProfilView from '@/views/ProfilView.vue'
import AdopsiView from '@/views/AdopsiView.vue'
import CatpediaView from '@/views/CatpediaView.vue'
import ForumView from '@/views/ForumView.vue'
import DonasiView from '@/views/DonasiView.vue'
import FindPlaceView from '@/views/FindPlaceView.vue'
import FormView from '@/views/FormView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: BerandaView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/daftar',
    name: 'DaftarView',
    component: DaftarView
  },
  {
    path: '/lapor',
    name: 'LaporView',
    component: LaporView
  },
  {
    path: '/profil',
    name: 'ProfilView',
    component: ProfilView
  },
  {
    path: '/adopsi',
    name: 'AdopsiView',
    component: AdopsiView
  },
  {
    path: '/catpedia',
    name: 'CatPediaView',
    component: CatpediaView
  },
  {
    path: '/findplace',
    name: 'FindPlaceView',
    component: FindPlaceView
  },
  {
    path: '/forum',
    name: 'forum',
    component: ForumView, 
    redirect: '/forum/nutrition', // Default view
    children: [
      { path: 'lost-found', component: ForumView },
      { path: 'stories', component: ForumView },
      { path: 'nutrition', component: ForumView},
      { path: 'health', component: ForumView},
      { path: 'rescue', component: ForumView}
    ]
  },
  {
    path: '/donasi',
    name: 'DonasiView',
    component: DonasiView
  },
  {
    path: '/form',
    name: 'FormView',
    component: FormView
  }
  
  // contoh rute tambahan:
  // {
  //   path: '/tentang',
  //   name: 'tentang',
  //   component: () => import('../views/TentangView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // kalau ada hash (#list-view, #donasi, dll)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // biar scroll halus
      }
    } 
    // kalau user pakai tombol back/forward browser
    else if (savedPosition) {
      return savedPosition
    } 
    // default: scroll ke atas
    else {
      return { top: 0 }
    }
  }
})

export default router
