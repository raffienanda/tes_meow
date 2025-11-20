<template>
  <nav class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="../assets/img/logo.png" alt="Logo" />
      <span>MeowLarat</span>
    </div>

    <!-- Tombol Hamburger -->
    <div class="hamburger" @click="toggleMenu">
      <div :class="{ bar: true, active: isMenuOpen }"></div>
      <div :class="{ bar: true, active: isMenuOpen }"></div>
      <div :class="{ bar: true, active: isMenuOpen }"></div>
    </div>

    <!-- Navigasi -->
    <ul :class="['nav-links', { open: isMenuOpen }]">
      <router-link to="/" class="nav-item" @click="closeMenu">Beranda</router-link>
      <router-link to="/adopsi" class="nav-item" @click="closeMenu">Adopsi</router-link>
      <router-link to="/lapor" class="nav-item" @click="closeMenu">Lapor</router-link>
      <router-link to="/catpedia" class="nav-item" @click="closeMenu">CatPedia</router-link>
      <router-link to="/findplace" class="nav-item" @click="closeMenu">FindPlace</router-link>
      <router-link to="/forum" class="nav-item" @click="closeMenu">Forum</router-link>
      <router-link to="/profil" class="nav-item" @click="closeMenu">Profil</router-link>

      <!-- Profil pindah ke bawah nav link di mode mobile -->
      <div class="mobile-profile" v-if="isMenuOpen">
        <div class="profile-section">
          <span class="username">Raffie Arsy</span>
          <div class="profile-dropdown">
            <img src="../assets/img/cat.png" alt="User Profile" class="profile-avatar" />
            <div class="dropdown-menu">
              <router-link to="/profil" class="dropdown-item">Profil Saya</router-link>
              <router-link to="/login" class="dropdown-item">Logout</router-link>
            </div>
          </div>
        </div>
      </div>
    </ul>

    <!-- Profil (hanya desktop) -->
    <div class="profile-section desktop-profile">
      <span class="username">Raffie Arsy</span>
      <div class="profile-dropdown">
        <img src="../assets/img/profil.png" alt="User Profile" class="profile-avatar" />
        <div class="dropdown-menu">
          <router-link to="/profil" class="dropdown-item">Profil Saya</router-link>
          <router-link to="/login" class="dropdown-item">Logout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}
</script>

<style scoped>
/* 🌈 NAVBAR DASAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: linear-gradient(to bottom, #004c80 40%, #007ac2 100%);
  color: #fffce8;
  position: relative;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.4rem;
  gap: 8px;
}

.logo span {
  color: #fff;
}

/* 🔹 NAV LINK */
.nav-links {
  display: flex;
  gap: 45px;
  list-style: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-item {
  color: #fffce8;
  text-decoration: none;
  cursor: pointer;
}

.nav-item:hover {
  opacity: 0.7;
}

/* 🔹 PROFIL DESKTOP */
.profile-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 600;
  font-size: 1rem;
  color: #fffce8;
}

.profile-dropdown {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #fffce8;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.profile-avatar:hover {
  transform: scale(1.08);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* 🔽 DROPDOWN MENU */
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: #ffffff;
  border-radius: 10px;
  min-width: 140px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: none;
  flex-direction: column;
  padding: 8px 0;
  z-index: 100;
}

.profile-dropdown:hover .dropdown-menu {
  display: flex;
}

.dropdown-item {
  padding: 10px 15px;
  text-decoration: none;
  color: #004c80;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}

.dropdown-item:hover {
  background: #e0f0ff;
  color: #007ac2;
}

/* 🔹 MENU HAMBURGER */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}

.bar {
  width: 28px;
  height: 3px;
  background-color: #fffce8;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.bar.active:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.bar.active:nth-child(2) {
  opacity: 0;
}

.bar.active:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* 🌙 RESPONSIVE MODE */
@media (max-width: 900px) {
  .hamburger {
    display: flex;
  }

 .nav-links { 
    position: absolute;
    top: 100%;
    left: 0;
    background: #004c80;
    width: 100%;
    flex-direction: column;
    gap: 25px;
    align-items: center;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .nav-links.open {
    padding: 30px 0;
    max-height: 600px;
    opacity: 1;
    pointer-events: auto;
  }

  .desktop-profile {
    display: none;
  }

  .mobile-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 20px;
  }

  .mobile-profile .profile-section {
    flex-direction: column;
    gap: 10px;
  }

  .profile-dropdown:hover .dropdown-menu {
    position: static;
    box-shadow: none;
    display: flex;
  }

  .dropdown-menu {
    background: transparent;
  }

  .dropdown-item {
    color: #fffce8;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffeb99;
  }
}

/* 🔸 Halaman aktif */
.router-link-exact-active {
  border-bottom: 3px solid #fffce8;
  padding-bottom: 4px;
  color: #edd05d;
}
</style>
