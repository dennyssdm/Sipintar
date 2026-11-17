# SIPINTAR Sespimma — RESTful Backend API

Layanan RESTful API resmi untuk **SIPINTAR** (*Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif*) Sespimma Sespim Lemdiklat Polri.

---

## 1. Ikhtisar Arsitektur & Teknologi

- **Runtime & Framework:** Node.js (v24.x / v20+), Express.js (ES Modules: `"type": "module"`)
- **Database Client:** MySQL 8.0 / MariaDB (XAMPP `localhost:3306`, basis data `sipintar_db`) via `mysql2/promise` dengan *Connection Pool*.
- **Keamanan & Otorisasi:**
  - Token JWT (*JSON Web Token*) dengan durasi kedaluwarsa 24 jam.
  - Hashing sandi menggunakan `bcryptjs` (salt rounds 10).
  - *Strict Server-Side RBAC* (Role-Based Access Control) untuk 6 peran pengguna Sespimma.
  - Penjagaan 4 tingkat klasifikasi akses (*Access Classification Guard*).
  - HTTP Security Headers menggunakan `helmet`.
  - Perlindungan *Brute-Force* dan *DoS* menggunakan `express-rate-limit`.
- **Penyimpanan Dokumen:** Sanitasi unggahan berkas (`multer`) ke direktori `uploads/` dengan pencegahan *path traversal* dan nama berkas unik.
- **Audit & Akuntabilitas:** Jejak audit (*audit trail*) otomatis pada setiap mutasi administratif di tabel `activity_logs`, `verification_logs`, dan `search_logs`.

---

## 2. Struktur Direktori Proyek

```
sipintarsespimmaAPI/
├── .env                              # Konfigurasi variabel lingkungan aktif
├── .env.example                      # Contoh template konfigurasi
├── package.json                      # Dependensi dan script NPM
├── server.js                         # Entry point aplikasi Express
├── collection.json                   # Koleksi Postman v2.1.0 (32 Request, Live & Terupdate)
├── SIPINTAR_Sespimma_API.postman_collection.json
├── database.sql                      # Skema DDL dan data awal MySQL
├── docs/                             # Dokumentasi institusional Sespimma
├── uploads/                          # Direktori fisik berkas digital & sampel PDF
└── src/
    ├── config/
    │   ├── db.js                     # Pool koneksi MySQL & fungsi cek koneksi
    │   └── jwt.js                    # Utilitas penandatanganan & verifikasi token JWT
    ├── middleware/
    │   ├── auth.js                   # Verifikasi Bearer token JWT (wajib & opsional)
    │   ├── rbac.js                   # Validasi wewenang peran (checkRole)
    │   ├── rateLimiter.js            # Pembatas laju request (global & auth)
    │   ├── upload.js                 # Konfigurasi multer & validasi format berkas
    │   └── errorHandler.js           # Penanganan error global & 404 handler
    ├── controllers/
    │   ├── healthController.js       # Health check status server & DB
    │   ├── authController.js         # Login, profil saya, dan pendaftaran mandiri
    │   ├── categoryController.js     # Kategori dan subkategori modul
    │   ├── resourceController.js     # Katalog sumber belajar & detail materi
    │   ├── gadikController.js        # Profil 16 gadik fungsional & kompetensi
    │   ├── libraryController.js      # Katalog perpustakaan, e-book, dan stok
    │   ├── fileController.js         # Streaming PDF in-app & pratinjau sampel buku
    │   ├── searchController.js       # Pencarian terpadu (FULLTEXT search)
    │   └── adminController.js        # Modul tata kelola, verifikasi Jarlat, dan user
    ├── services/
    │   ├── authService.js            # Logika bisnis autentikasi & profil
    │   ├── categoryService.js        # Kueri kategori & subkategori
    │   ├── resourceService.js        # Kueri materi, filter, dan tag
    │   ├── gadikService.js           # Kueri tenaga pendidik & nominatif
    │   ├── libraryService.js         # Kueri perpustakaan, buku, dan file
    │   ├── fileService.js            # Validasi hak akses berkas & resolusi path
    │   ├── searchService.js          # Fulltext MySQL search & logging pencarian
    │   └── adminService.js           # Mutasi draf, verifikasi Bag Jarlat, akun, & stats
    └── utils/
        ├── responseFormatter.js      # Standarisasi envelope JSON success & error
        └── logger.js                 # Helper pencatatan jejak audit ke activity_logs
```

---

## 3. Prasyarat & Instalasi

### Prasyarat Sistem
1. **Node.js:** Versi 20.x atau 24.x (rekomendasi LTS).
2. **XAMPP / MySQL:** Service MySQL berjalan aktif pada port `3306`.
3. Basis data `sipintar_db` telah terpasang dengan mengeksekusi `database.sql`.

### Langkah Menjalankan Server
```bash
# 1. Pindah ke direktori proyek
cd /Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI

# 2. Pasang dependensi
npm install

# 3. Konfigurasi file environment
cp .env.example .env

# 4. Jalankan server (Mode Pengembangan / Development)
npm run dev

# Atau jalankan langsung (Mode Produksi)
npm start

# 5. Jalankan suite pengujian integrasi otomatis (29 skenario)
npm test

# 6. Jalankan utilitas pencadangan basis data MySQL otomatis
npm run db:backup

# 7. Jalankan utilitas pemulihan basis data MySQL otomatis (Disaster Recovery)
npm run db:restore
```
*Server aktif pada URL:* `http://localhost:5001`  
*Base API Endpoint:* `http://localhost:5001/api/v1`  
*Dokumentasi Interaktif Swagger UI:* `http://localhost:5001/docs`  
*Spesifikasi OpenAPI 3.0:* `http://localhost:5001/openapi.json`

---

## 4. Konfigurasi Environment (`.env`)

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `5001` | Port HTTP (port 5001 digunakan karena 5000 adalah AirPlay macOS) |
| `NODE_ENV` | `development` | Lingkungan runtime (`development` / `production`) |
| `DB_HOST` | `127.0.0.1` | Host MySQL database XAMPP |
| `DB_PORT` | `3306` | Port MySQL database |
| `DB_USER` | `root` | Username MySQL |
| `DB_PASS` | `""` | Password MySQL (kosong secara default pada XAMPP) |
| `DB_NAME` | `sipintar_db` | Nama database |
| `JWT_SECRET` | `...` | Secret key penandatanganan token JWT |
| `JWT_EXPIRES_IN` | `24h` | Durasi masa aktif sesi token JWT |
| `CORS_ORIGIN` | `http://localhost:3000` | Asal domain klien Next.js |
| `UPLOAD_DIR` | `uploads` | Direktori lokal berkas fisik dokumen |
| `MAX_FILE_SIZE_MB`| `50` | Batas maksimum unggahan berkas (Megabytes) |

---

## 5. Matriks Endpoint API

### A. Sistem & Autentikasi
| Method | Endpoint | Hak Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/health` | Publik | Cek kesehatan API & koneksi pool MySQL |
| `POST`| `/api/v1/auth/login` | Publik *(Rate Limit: 30/15m)* | Login via NRP/NIP atau Email + Password |
| `POST`| `/api/v1/auth/register`| Publik *(Rate Limit: 30/15m)* | Pendaftaran mandiri Serdik atau Gadik |
| `GET` | `/api/v1/auth/me` | Authenticated (Semua Peran) | Profil pengguna aktif + data spesifik peran |
| `GET` | `/api/v1/auth/admin-check` | Authenticated (`admin` only) | Endpoint verifikasi pengujian otorisasi RBAC |

### B. Sumber Belajar & Perpustakaan (Katalog Publik)
| Method | Endpoint | Hak Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Publik / Authenticated | 8 Kategori utama dan jumlah modul aktif |
| `GET` | `/api/v1/categories/:id/subcategories` | Publik / Authenticated | Subkategori berdasarkan kategori ID/slug |
| `GET` | `/api/v1/resources` | Publik / Authenticated | Katalog materi (publik hanya melihat status `Dipublikasikan`) |
| `GET` | `/api/v1/resources/:id` | Publik / Authenticated | Detail materi, silabus, dan daftar tag |
| `GET` | `/api/v1/resources/:id/related` | Publik / Authenticated | Rekomendasi materi terkait berbasis kesamaan taksonomi tag |
| `GET` | `/api/v1/gadik` | Publik / Authenticated | Daftar 16 gadik fungsional urut nominatif |
| `GET` | `/api/v1/gadik/:id` | Publik / Authenticated | Detail profil gadik, no Sprin, dan kompetensi |
| `GET` | `/api/v1/library/categories` | Publik / Authenticated | 4 Kategori perpustakaan & total ketersediaan stok |
| `GET` | `/api/v1/library/books` | Publik / Authenticated | Katalog buku fisik, ebook, jurnal, taskap |
| `GET` | `/api/v1/library/books/:id` | Publik / Authenticated | Detail buku, rak fisik, nomor panggil |
| `GET` | `/api/v1/search` | Publik / Authenticated | **Pencarian Terpadu** berbasis MySQL `FULLTEXT` |

### C. Pembaca Berkas & Aliran Dokumen (Document Reader)
| Method | Endpoint | Hak Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/resources/:id/file` | Terbuka / Internal / Terbatas | Streaming PDF (`inline`) atau Unduh (`?download=true`). Menolak `Metadata Saja` (403). |
| `GET` | `/api/v1/library/books/:id/preview`| Publik / Internal | Pratinjau sampel buku (10-20 halaman). Menolak `Metadata Saja` (403). |

### D. Tata Kelola & Administrasi (Governance)
| Method | Endpoint | Hak Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/v1/admin/resources` | `admin`, `pengelola`, `gadik` | Membuat draf naskah ajar (dukungan unggah file) |
| `PUT` | `/api/v1/admin/resources/:id` | `admin`, `pengelola`, `gadik` | Memperbarui metadata & berkas naskah |
| `PATCH`| `/api/v1/admin/resources/:id/archive` | `admin`, `verifikator` | Mengarsipkan naskah (*soft delete* ke `Arsip`) |
| `GET` | `/api/v1/admin/verification/queue` | `admin`, `verifikator` | Daftar antrean naskah draf Bag Jarlat |
| `POST` | `/api/v1/admin/verification/:id/review`| `admin`, `verifikator` | Menyetujui/Merevisi naskah + log verifikasi |
| `GET` | `/api/v1/admin/users` | `admin` | Daftar seluruh akun pengguna & filter peran |
| `PATCH`| `/api/v1/admin/users/:id/role` | `admin` | Memperbarui peran akun pengguna |
| `PATCH`| `/api/v1/admin/users/:id/status` | `admin` | Mengaktifkan / menonaktifkan akun |
| `GET` | `/api/v1/admin/monitoring/stats` | `admin`, `pimpinan` | Agregat metrik sistem dan visualisasi |
| `GET` | `/api/v1/admin/monitoring/logs` | `admin`, `pimpinan` | Penelusuran jejak audit dan rekaman aktivitas |

---

## 6. Standar Format Respons JSON

### Respons Sukses (Standard Success Envelope)
```json
{
  "success": true,
  "message": "Deskripsi tindakan berhasil",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 108,
    "totalPages": 11
  }
}
```

### Respons Gagal (Standard Error Envelope)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | TOO_MANY_REQUESTS",
    "message": "Penjelasan pesan kesalahan yang ramah pengguna",
    "details": []
  }
}
```

---

## 7. Panduan Integrasi Frontend (Next.js)

### Contoh Service Klien (`lib/apiClient.ts`)
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error?.message || 'Terjadi kesalahan pada layanan API');
  }

  return json;
}
```

### Membuka Berkas PDF di In-App Reader Frontend
```typescript
// Buka streaming langsung di iframe atau PDF.js viewer
const fileViewerUrl = `${BASE_URL}/resources/${resourceId}/file`;
// Atau paksa unduhan berkas lampiran
const downloadUrl = `${BASE_URL}/resources/${resourceId}/file?download=true`;
```

---

## 8. Koleksi Postman

Berkas koleksi resmi Postman v2.1.0 tersedia di direktori root proyek:
- [collection.json](file:///Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI/collection.json)
- [SIPINTAR_Sespimma_API.postman_collection.json](file:///Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI/SIPINTAR_Sespimma_API.postman_collection.json)

**Fitur Otomatis Postman:**
Saat melakukan request pada folder `2. Autentikasi & Profil -> Login - Admin (NRP / Email)`, script pengujian Postman akan secara otomatis menyimpan token ke variabel koleksi `{{authToken}}`, sehingga seluruh request terlindungi berikutnya dapat langsung dieksekusi tanpa menyalin token secara manual.

---

## 9. Penerapan dengan Docker & Kontainerisasi

Aplikasi telah dilengkapi konfigurasi `Dockerfile` dan `docker-compose.yml` siap produksi dengan persistensi berkas `uploads/` dan pencadangan `backups/`:

```bash
# Membangun dan menjalankan seluruh kontainer (API + MySQL 8.0)
docker-compose up -d --build

# Memeriksa status kontainer
docker-compose ps

# Memeriksa log layanan API
docker-compose logs -f api

# Menghentikan kontainer
docker-compose down
```


