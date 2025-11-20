<template>
  <nav class="navbar">
    <div class="logo">
      <img src="../assets/img/logo.png" alt="Logo" />
      <span>MeowLarat</span>
    </div>

    <!-- Tombol Hamburger -->
    <div class="hamburger" @click="toggleMenu">
      <div :class="{ 'bar': true, 'active-bar': isMenuOpen }"></div>
      <div :class="{ 'bar': true, 'active-bar': isMenuOpen }"></div>
      <div :class="{ 'bar': true, 'active-bar': isMenuOpen }"></div>
    </div>

    <!-- Menu utama -->
    <ul :class="{ 'nav-links': true, 'open': isMenuOpen }">
      <router-link to="/" class="nav-item" @click="closeMenu">Beranda</router-link>
      <router-link to="/adopsi" class="nav-item" @click="closeMenu">Adopsi</router-link>
      <router-link to="/lapor" class="nav-item" @click="closeMenu">Lapor</router-link>
      <router-link to="/catpedia" class="nav-item" @click="closeMenu">CatPedia</router-link>
      <router-link to="/findplace" class="nav-item" @click="closeMenu">FindPlace</router-link>
      <router-link to="/forum" class="nav-item" @click="closeMenu">Forum</router-link>
      <router-link to="/profil" class="nav-item" @click="closeMenu">Profil</router-link>

      <!-- Auth pindah ke bawah hanya di mode hamburger -->
      <div class="auth-mobile">
        <router-link to="/login" class="login-daftar" @click="closeMenu">Login</router-link>
        <router-link to="/daftar" class="login-daftar" @click="closeMenu">Daftar</router-link>
      </div>
    </ul>

    <!-- Versi desktop -->
    <div class="auth-desktop">
      <router-link to="/login" class="login-daftar">Login</router-link>
      <router-link to="/daftar" class="login-daftar">Daftar</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  color: #fffce8;
  background: linear-gradient(to bottom, #004c80 40%, #007ac2 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
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

.nav-links {
  list-style: none;
  display: flex;
  gap: 45px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-item {
  color: #fffce8;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.nav-item:hover {
  opacity: 0.7;
}

.login-daftar {
  background-color: #fffce8;
  color: #005b99;
  border: none;
  border-radius: 10px;
  padding: 8px 26px;
  margin-left: 18px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
.login-daftar:hover {
  background-color: #f0f0d8;
}

.router-link-exact-active {
  border-bottom: 3px solid #fffce8;
  padding-bottom: 4px;
}
.router-link-exact-active.nav-item {
  color: #ffeb99;
}

/* ========== HAMBURGER ========== */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
}
.bar {
  width: 25px;
  height: 3px;
  background-color: #fffce8;
  border-radius: 2px;
  transition: all 0.3s;
}
.active-bar:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}
.active-bar:nth-child(2) {
  opacity: 0;
}
.active-bar:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 850px) {
  .hamburger {
    display: flex;
  }

  /* Sembunyikan tombol desktop di mobile */
  .auth-desktop {
    display: none;
  }

  .nav-links {
    position: absolute;
    top: 80px;
    left: 0;
    background: #005b99;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px 0 30px 0;
    transform: translateY(-150%);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
  }

  /* Login dan daftar di bawah */
  .auth-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
    gap: 10px;
  }

  .login-daftar {
    margin-left: 0;
  }
}

@media (min-width: 851px) {
  .auth-mobile {
    display: none;
  }
}
</style>
