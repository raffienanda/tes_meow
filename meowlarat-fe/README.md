# Web-MeowLarat

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
-----

## Cara Mengakses Semua Halaman (Routes)

Aplikasi ini menggunakan **vue-router** untuk mengelola halaman. Setelah aplikasi berjalan (menggunakan `npm run dev`), Anda dapat mengakses semua halaman yang didefinisikan dalam `src/router/index.js` dengan menambahkan path URL di browser atau mengakses tombol yang terdapat pada laman, seperti yang tercantum di bawah ini:

| Nama Halaman (View) | Path URL | Catatan |
| :--- | :--- | :--- |
| **Beranda** (`BerandaView`) | `/` | dapat diakses pada navbar |
| **Login** (`LoginView`) | `/login` | dapat diakses pada navbar dan laman daftar |
| **Daftar** (`DaftarView`) | `/daftar` | dapat diakses pada navbar dan laman login |
| **Lapor Kucing** (`LaporView`) | `/lapor` | dapat diakses pada navbar |
| **Profil Pengguna** (`ProfilView`) | `/profil` | dapat diakses pada navbar |
| **Adopsi Kucing** (`AdopsiView`) | `/adopsi` | dapat diakses pada navbar |
| **CatPedia** (`CatpediaView`) | `/catpedia` | dapat diakses pada navbar |
| **FindPlace** (`FindPlaceView`) | `/findplace` | dapat diakses pada navbar |
| **Donasi** (`DonasiView`) | `/donasi` | dapat diakses pada laman beranda |
| **Form Adopsi** (`FormView`) | `/form` | dapat diakses pada laman adopsi |
| **Forum Diskusi** (`ForumView`) | `/forum` | dapat diakses pada navbar |
| **Forum: Lost & Found** | `/forum/lost-found` | dapat diakses pada laman forum |
| **Forum: Stories** | `/forum/stories` | dapat diakses pada laman forum |
| **Forum: Health** | `/forum/health` | dapat diakses pada laman forum |
| **Forum: Nutrition** | `/forum/nutrition` | dapat diakses pada laman forum |
| **Forum: Rescue** | `/forum/rescue` | dapat diakses pada laman forum |

```
```
