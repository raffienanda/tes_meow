<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Kiri -->
      <div class="left-side">
        <h3>Miaw-miaw Menunggumu Kamu!</h3>
        <img src="../assets/img/cat.png" alt="Kucing" class="cat-img" />
      </div>

      <!-- Kanan -->
      <div class="right-side">
        <h1>Membuat Akun</h1>
        <form class="register-form">
          <input type="text" placeholder="Nama Lengkap" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Nomor Telepon" />
          <input type="password" placeholder="Password" />

          <label class="checkbox">
            <input type="checkbox" />
            Saya menyetujui <a href="#">kebijakan privasi</a>
          </label>

          <button type="submit" class="register-btn">Buat</button>
        </form>

        <p class="login-text">
          Sudah memiliki akun? <router-link to="/login">Login</router-link>
        </p>

        <router-link to="/" class="back-link">← Beranda</router-link>
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

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-container {
  background-color: #ffffe9;
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  width: 1100px;
  height: 700px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Kiri */
.left-side {
  background-color: #f8f8d4;
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
}

.left-side h3 {
  font-weight: 700;
  margin-bottom: 20px;
}

.cat-img {
  width: 230px;
}

/* Kanan */
.right-side {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.right-side h1 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #000;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form input {
  background-color: #fff;
  border: 2px solid #f2f2c2;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 1rem;
}

.checkbox {
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.checkbox a {
  color: #000;
  font-weight: 600;
  text-decoration: none;
}

.register-btn {
  background-color: #e9e9c0;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.register-btn:hover {
  background-color: #dedeb0;
}

.login-text {
  margin-top: 20px;
  font-size: 0.9rem;
}

.login-text a {
  color: #0080ff;
  text-decoration: none;
}

.back-link {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
}

/* RESPONSIVE AREA */
@media (max-width: 1024px) {
  .register-container {
    width: 90%;
    height: auto;
  }

  .left-side {
    padding: 20px;
  }

  .cat-img {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    width: 90%;
    height: auto;
    background-image: url('../assets/img/cat.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
  }

  .left-side {
    display: none; /* Hilangkan sisi kiri di HP */
  }

  .right-side {
    flex: none;
    width: 90%;
    padding: 40px 30px;
    background-color: rgba(255, 255, 233, 0.9); /* agar teks tetap terbaca */
    border-radius: 24px;
  }

  .right-side h1 {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .right-side {
    padding: 30px 20px;
  }

  .register-form input {
    font-size: 0.9rem;
    padding: 10px;
  }

  .register-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>
