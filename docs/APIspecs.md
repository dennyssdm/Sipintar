# SIPINTAR Sespimma — Production RESTful API Specification (v1.0.0)

**Status:** Approved & Implemented in Production  
**Base URL:** `http://localhost:5001/api/v1`  
**Protocol:** HTTP/1.1 / JSON over UTF-8  
**Authentication:** Bearer JWT (`Authorization: Bearer <token>`)  
**Postman Collection:** [collection.json](file:///Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI/collection.json) (v2.1.0 - 33 Request)

---

## 1. Arsitektur & Konvensi Umum

- Seluruh payload request dan response menggunakan format **JSON** dengan charset **UTF-8**.
- Setiap respons API dibungkus dalam **Standardized Response Envelope**:
  ```json
  {
    "success": true,
    "message": "Deskripsi status operasi",
    "data": { ... },
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
  ```
- Respons kegagalan atau validasi dibungkus dalam **Standardized Error Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR | INTERNAL_ERROR",
      "message": "Pesan kesalahan dalam bahasa Indonesia",
      "details": []
    }
  }
  ```
- **Keamanan & Rate Limiting:**
  - Global Rate Limiter: Maksimal 500 permintaan per jendela 15 menit per alamat IP.
  - Auth Rate Limiter (`/api/v1/auth/*`): Maksimal 30 percobaan per jendela 15 menit.
  - HTTP Security Headers dikelola via `Helmet` (HSTS, CSP, X-Frame-Options DENY, XSS Protection).

---

## 2. Matriks Hak Akses & Klasifikasi Dokumen

### A. 6 Peran Pengguna (RBAC Matrix)
1. `serdik` — Peserta Didik Sespimma (hanya naskah publik/internal berstatus `Dipublikasikan`).
2. `gadik` — Tenaga Pendidik / Widyaiswara (dapat mengusulkan materi draf, melihat naskah internal).
3. `pengelola` — Pengelola Pustaka (katalogisasi buku fisik, taskap, e-book).
4. `verifikator` — Tim Pokja / Bag Jarlat (verifikasi draf $\rightarrow$ `Dipublikasikan` / revisi).
5. `admin` — Administrator Sistem (akses penuh manajemen pengguna, monitoring, arsip).
6. `pimpinan` — Kasespimma / Pimpinan Lemdiklat (eksplorasi naskah dan dasbor analitik).

### B. 4 Klasifikasi Dokumen
- `Terbuka`: Dapat diakses oleh seluruh pengguna terotentikasi.
- `Internal`: Terbatas untuk personel Sespimma / Polri terdaftar.
- `Terbatas`: Hanya untuk Pokja pengampu naskah, Gadik bersangkutan, atau Administrator.
- `Metadata Saja`: Hanya judul, sinopsis, dan abstrak yang ditampilkan. **Pengunduhan berkas digital diblokir keras (HTTP 403 Forbidden).**

### C. 5 Status Siklus Hidup (Lifecycle States)
`Draft` $\rightarrow$ `Diverifikasi` $\rightarrow$ `Dipublikasikan` $\rightarrow$ `Tidak Aktif` $\rightarrow$ `Arsip`

---

## 3. Ringkasan Endpoint API

### Modul 1: Sistem & Health
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET` | `/api/v1/health` | Status koneksi basis data MySQL `sipintar_db` & timestamp server | Terbuka |

### Modul 2: Autentikasi & Akun
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Login menggunakan email atau NRP/NIP & kata sandi | Terbuka |
| `GET` | `/api/v1/auth/me` | Memperoleh data profil & hak akses pengguna saat ini | Bearer Token |
| `POST` | `/api/v1/auth/register` | Pendaftaran mandiri Serdik / Gadik / Pengelola | Terbuka |

### Modul 3: Sumber Belajar & Pencarian Terpadu
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Daftar 8 kategori sumber belajar & jumlah naskah dinamis | Terbuka |
| `GET` | `/api/v1/categories/:id/subcategories` | Daftar subkategori taksonomi | Terbuka |
| `GET` | `/api/v1/resources` | Katalog materi ajar (`limit`, `page`, `category_id`, `q`) | Publik / Auth |
| `GET` | `/api/v1/resources/:id` | Rincian lengkap materi ajar beserta kompetensi & tag | Publik / Auth |
| `GET` | `/api/v1/resources/:id/related` | Rekomendasi materi ajar terkait berbasis kesamaan tag | Publik / Auth |
| `GET` | `/api/v1/gadik` | Daftar 16 profil Tenaga Pendidik fungsional Polri | Publik / Auth |
| `GET` | `/api/v1/gadik/:id` | Rincian kompetensi, Sprin penugasan, dan mata ajar Gadik | Publik / Auth |
| `GET` | `/api/v1/library/categories` | Daftar 4 kategori koleksi perpustakaan Sespimma | Terbuka |
| `GET` | `/api/v1/library/books` | Katalog koleksi buku fisik, e-book, dan Taskap | Publik / Auth |
| `GET` | `/api/v1/library/books/:id` | Rincian metadata bibliografi buku perpustakaan | Publik / Auth |
| `GET` | `/api/v1/search` | Pencarian terpadu MySQL Fulltext lintas tabel | Publik / Auth |

### Modul 4: Berkas Digital & Streaming Pembaca
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `GET` | `/api/v1/resources/:id/file` | Streaming / unduhan berkas PDF naskah materi | Sesuai Klasifikasi |
| `GET` | `/api/v1/library/books/:id/preview` | Streaming berkas pratinjau sampel buku (10-25 hal.) | Terbuka |

### Modul 5: Tata Kelola & Administrasi (Governance)
| Method | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `POST` | `/api/v1/admin/resources` | Pembuatan draf sumber belajar baru dengan unggah file | `gadik`, `pengelola`, `admin` |
| `PUT` | `/api/v1/admin/resources/:id` | Pembaruan data metadata sumber belajar | `gadik`, `pengelola`, `admin` |
| `PATCH` | `/api/v1/admin/resources/:id/archive` | Pengarsipan naskah (Soft delete) | `admin` |
| `GET` | `/api/v1/admin/verification/queue` | Antrean verifikasi berkas `Draft` / `Diverifikasi` | `verifikator`, `admin` |
| `POST` | `/api/v1/admin/verification/:id/review` | Persetujuan (`approve`) atau penolakan (`reject`) draf | `verifikator`, `admin` |
| `GET` | `/api/v1/admin/users` | Daftar seluruh akun terdaftar beserta peran | `admin` |
| `PATCH` | `/api/v1/admin/users/:id/role` | Penyesuaian peran operasional akun | `admin` |
| `PATCH` | `/api/v1/admin/users/:id/status` | Aktivasi atau deaktivasi status akun | `admin` |
| `GET` | `/api/v1/admin/monitoring/stats` | Agregasi statistik metrik sistem real-time | `admin`, `pimpinan` |
| `GET` | `/api/v1/admin/monitoring/logs` | Log aktivitas mutasi dan penelusuran pencarian | `admin`, `pimpinan` |

---

## 4. Skema Permintaan & Contoh Respons Kunci

### A. Autentikasi Pengguna (`POST /api/v1/auth/login`)
**Permintaan:**
```json
{
  "identifier": "dewi.susilo@sespimma.lemdiklat.polri.go.id",
  "password": "Password123!"
}
```
**Respons (200 OK):**
```json
{
  "success": true,
  "message": "Autentikasi berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "uuid": "usr-admin-01",
      "nrp_nip": "80010001",
      "nama_lengkap": "AKBP Dewi Susilo Pangestuti, S.Ak.",
      "email": "dewi.susilo@sespimma.lemdiklat.polri.go.id",
      "role": "admin",
      "pangkat": "AKBP",
      "jabatan": "Administrator Sistem & Penjamin Mutu"
    }
  }
}
```

### B. Pencarian Terpadu (`GET /api/v1/search?q=hanjar`)
**Respons (200 OK):**
```json
{
  "success": true,
  "message": "Pencarian berhasil dieksekusi",
  "data": [
    {
      "id": 1,
      "uuid": "res-hanjar-sespimma-01",
      "type": "resource",
      "title": "Hanjar 01: Peran Polri dalam Optimalisasi Sektor Pangan",
      "subtitle": "Modul & Hanjar • Tim Pokja Hanjar Sespimma Lemdiklat Polri",
      "description": "Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025 mengenai strategi pengawalan...",
      "category": "Modul & Hanjar",
      "category_slug": "modul",
      "access_classification": "Internal",
      "score": 5.289
    }
  ],
  "meta": {
    "query": "hanjar",
    "totalResults": 14
  }
}
```

### C. Perlindungan Berkas Metadata Saja (`GET /api/v1/resources/:id/file`)
Jika berkas berstatus `access_classification = 'Metadata Saja'`, sistem mengembalikan:
**Respons (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Berkas digital tidak tersedia untuk publik. Silakan akses fisik di perpustakaan/ruang baca.",
    "details": []
  }
}
```

---

## 5. Sinkronisasi Postman Collection

Koleksi Postman resmi disimpan dalam file [collection.json](file:///Applications/XAMPP/xamppfiles/htdocs/sipintarsespimmaAPI/collection.json) pada direktori root repositori ini.

- **Import ke Postman:**
  Buka Postman $\rightarrow$ Klik **Import** $\rightarrow$ Pilih `collection.json`.
- **Environment Variables Otomatis:**
  - `baseUrl`: `http://localhost:5001/api/v1`
  - `rootUrl`: `http://localhost:5001`
  - `authToken`: Otomatis diisi oleh skrip *Tests* saat login sukses pada folder `2. Autentikasi & Profil`.
