<template>
  <Navbar />
  <!-- Main-Welcome (Hero) Section -->
  <section class="hero">
    <div class="hero-text">
      <h1>Selamat Datang</h1>
      <p>Temukan Sahabat Kucingmu di Sini</p>
      <router-link to="donasi" class="cta">Dukung Kami!</router-link>
    </div>
    <div class="hero-image">
      <img src="../assets/img/cat.png" alt="Kucing lucu" />
    </div>
  </section>
  
  <!-- Stats Section -->
  <section class="stats">
    <div class="stat-item">
      <img src="../assets/img/stats_kucing.png" alt="ikon kucing" ></img>
      <div class="ket-stat">
        <h2>999</h2>
        <p>Kucing Bisa Kamu Adopsi</p>
      </div>
    </div>
    <div class="stat-item">
      <img src="../assets/img/stats_adopsi.png" alt="ikon adopsi" ></img>
      <div class="ket-stat">
        <h2>999</h2>
        <p>Kucing Telah Diadopsi</p>
      </div>
    </div>
    <div class="stat-item">
      <img src="../assets/img/stats_shelter.png" alt="ikon shelter" ></img>
      <div class="ket-stat">
        <h2>999</h2>
        <p>Shelter Telah Bekerjasama</p>
      </div>
    </div>
  </section>
</template>

<script setup>
  import Navbar from '../components/Navbar.vue'
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #0077c2;
}

/* Main-Welcome (hero) Section */
  .hero {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fffce8;
    padding: 69px 100px 180px;
    border-bottom-left-radius: 0px;
  }

  .hero-image {
    position: absolute;
    right: 180px;
    bottom: -150px;
  }

  .hero-image img {
    width: 290px;
    height: auto;
  }

  .hero-text{
    margin-left: 30px;
    margin-top: 18px;
  }

  .hero-text h1 {
    font-size: 4.5rem;
    margin-bottom: -10px;
  }

  .hero-text p {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }

  .cta {
    background-color: #fffce8;
    color: #005b99;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 20px;
    text-decoration: none;
  }

  .cta:hover {
    background-color: #f0f0d8;
  }

  /* Stats Section */
  .stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 180px;
    background-color: #ffffe7;
    color: #005b99;
    padding: 70px 0;
    font-weight: bold;

    position: relative;
    margin-top: 100px;
    z-index: 2;
    
  }

  .stats::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 250px;
    background-color: #ffffe7;
    transform: skewY(-2deg);
    transform-origin: top left;
    z-index: -1;
  }

  .stat-item {
    display: flex;
    text-align: center;
    z-index: 3;
  }

  .ket-stat {
    text-align: left;
    margin-left: 20px;
  }

  .ket-stat h2 {
    font-size: 3.5rem;
    margin: 0;
  }

  .ket-stat p {
    font-size: 1.2rem;
    margin: 0;
  }

  .icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
  }

  /* RESPONSIVE FIXES */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding-bottom: 25vh;
  }

  .hero-image {
    position: static;
    margin-top: 2rem;
    width: 70vw;
  }

  .stats {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }

  .stat-item {
    justify-content: center;
  }

  .ket-stat {
    text-align: center;
    margin-left: 0;
  }
}
</style>
