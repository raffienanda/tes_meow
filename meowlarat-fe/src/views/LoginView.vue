<template>
  <div class="login-page">
    <div class="login-container">
      <div class="left-side">
        <div class="mobile-title">Miaw-miaw Menunggumu Kamu!</div>

        <div class="logo">
          <img src="../assets/img/logo.png" alt="Logo MeowLarat" />
          <h2>MeowLarat</h2>
        </div>

        <h1>Hello,<br />Welcome Back</h1>

        <form class="login-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <div class="options">
            <label><input type="checkbox" /> Ingat saya</label>
            <a href="#">Lupa Password?</a>
          </div>
          <button type="submit" class="signin-btn">Sign In</button>
        </form>

        <p class="signup-text">
          Belum punya akun? <router-link to="/daftar">Daftar</router-link>
        </p>
        <router-link to="/" class="back-link">← Beranda</router-link>
      </div>

      <div class="right-side">
        <h3>Miaw-miaw Menunggumu Kamu!</h3>
        <img src="../assets/img/cat.png" alt="Kucing" class="cat-img" />
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-size: cover;
  background-repeat: repeat;
  background-position: center;
  font-family: 'Poppins', sans-serif;
  margin: 0;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-container {
  background-color: #ffffe9;
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  width: 1100px;
  height: 700px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* LEFT SIDE */
.left-side {
  flex: 1;
  padding: 60px;
  margin-right: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.logo img {
  width: 50px;
  margin-right: 10px;
}

.logo h2 {
  font-size: 1.5rem;
  margin: 0;
}

h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #000;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form input {
  background-color: #fff;
  border: 2px solid #f2f2c2;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 1rem;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #333;
}

.signin-btn {
  background-color: #e9e9c0;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;
}

.signin-btn:hover {
  background-color: #dedeb0;
}

.signup-text {
  margin-top: 20px;
  font-size: 0.9rem;
}

.signup-text a {
  color: #0080ff;
  text-decoration: none;
}

.back-link {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
}

/* RIGHT SIDE */
.right-side {
  background-color: #f8f8d4;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  text-align: center;
}

.right-side h3 {
  font-weight: 700;
  margin-bottom: -10px;
}

.cat-img {
  width: 230px;
}

/* Judul di versi mobile (disembunyikan di desktop) */
.mobile-title {
  display: none;
  text-align: center;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #333;
}

/* ========================
   RESPONSIVE DESIGN
======================== */

/* Tablet (≤1024px) */
@media (max-width: 1024px) {
  .login-container {
    width: 90%;
    height: auto;
  }

  .left-side {
    margin-right: 50px;
    padding: 40px;
  }

  .cat-img {
    width: 220px;
  }
}

/* Smartphone (≤768px) */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 90%;
    height: auto;
    background-image: url('../assets/img/cat.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }

  .right-side {
    display: none; /* Sembunyikan sisi kanan di HP */
  }

  .left-side {
    margin-right: 0;
    padding: 40px 30px;
    background-color: rgba(255, 255, 233, 0.9); /* transparan biar teks kebaca */
    border-radius: 24px;
  }

  .mobile-title {
    display: block; /* Tampilkan judul di atas form */
  }

  h1 {
    text-align: center;
  }
}

/* Small Smartphone (≤480px) */
@media (max-width: 480px) {
  .left-side {
    padding: 30px 20px;
  }

  .mobile-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .login-form input {
    font-size: 0.9rem;
    padding: 10px;
  }

  .signin-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>
