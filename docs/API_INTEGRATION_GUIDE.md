# Panduan Lengkap Integrasi RESTful API SIPINTAR Sespimma
**Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif**  
*Sespimma Sespim Lemdiklat Polri — PKN Tingkat II Angkatan XXIX Nawasena TA 2026*

---

## 1. Ikhtisar Arsitektur & Konvensi Komunikasi

Dokumentasi ini dirancang khusus untuk memandu pengembang antarmuka **Frontend Next.js** (`SIPINTAR`) dalam mengintegrasikan seluruh fitur ke layanan **Backend RESTful API** (`sipintarsespimmaAPI`).

### A. Informasi Dasar Layanan
- **Base URL API:** `http://localhost:5001/api/v1`
- **Interactive Swagger UI:** `http://localhost:5001/docs`
- **Spesifikasi OpenAPI 3.0:** `http://localhost:5001/openapi.json`
- **Koleksi Postman Resmi:** `collection.json` (v2.1.0, 33 Request)
- **Format Pertukaran Data:** JSON dengan encoding UTF-8 (atau `multipart/form-data` untuk unggahan berkas materi).
- **Protokol Keamanan:** HTTP Headers via `Helmet`, Rate Limiting adaptif, dan Token JWT Bearer.

---

### B. Header Permintaan Standar
Setiap permintaan ke rute terproteksi wajib menyertakan token otentikasi JWT pada header:
```http
Authorization: Bearer <token_jwt_anda>
Content-Type: application/json
Accept: application/json
```
*(Catatan: Saat mengirim `multipart/form-data` dengan `FormData` di peramban, jangan menetapkan header `Content-Type` secara manual agar boundary multipart diatur otomatis oleh browser).*

---

### C. Standarisasi Envelope Respons JSON

#### 1. Respons Berhasil (HTTP 200 / 201)
Semua respon sukses selalu dibungkus dalam format seragam:
```json
{
  "success": true,
  "message": "Deskripsi tindakan berhasil dilakukan",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 68,
    "totalPages": 7
  }
}
```

#### 2. Respons Gagal / Validasi (HTTP 400 / 401 / 403 / 404 / 429 / 500)
Semua kegagalan dikembalikan dalam format error seragam dengan kode error mesin yang terstandarisasi:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | INVALID_ACTION | TOO_MANY_REQUESTS",
    "message": "Penjelasan kesalahan yang mudah dipahami pengguna",
    "details": []
  }
}
```

---

### D. Akun Pengujian Resmi (Semua Kata Sandi: `Password123!`)

| Peran | Email Resmi | NRP / NIP | Nama Personel | Wewenang Utama |
|---|---|---|---|---|
| **admin** | `dewi.susilo@sespimma.lemdiklat.polri.go.id` | `80010001` | AKBP Dewi Susilo Pangestuti, S.Ak. | Administrator Sistem, Tata Kelola Pengguna, Arsip |
| **serdik** | `arya.ramadhan@serdik.polri.go.id` | `85071234` | KOMPOL Arya Ramadhan, S.I.K. | Peserta Didik, Eksplorasi Materi Dipublikasikan |
| **gadik** | `purwanto@gadik.polri.go.id` | `72010235` | KOMBES POL Purwanto, S.I.K., M.Si. | Tenaga Pendidik, Usulan Draf Materi Hanjar |
| **verifikator** | `verifikator@sespimma.lemdiklat.polri.go.id` | `75040112` | AKBP Dr. Bambang Sudarmono, M.Hum. | Pokja Jarlat, Verifikasi, Persetujuan/Revisi |
| **pimpinan** | `kasespimma@sespimma.lemdiklat.polri.go.id` | `69080001` | BRIGJEN POL Mardiyono, S.I.K., M.Si. | Pengawasan Eksekutif, Akses Seluruh Draf & Log |
| **pengelola** | `pengelola.pustaka@sespimma.lemdiklat.polri.go.id` | `82090123` | PENATA TK I Siti Aminah, S.Sos. | Pengelola Pustaka, Katalog Buku & E-Library |

---

### E. 4 Klasifikasi Akses Data
1. `Terbuka`: Dapat diakses oleh seluruh pengguna terotentikasi di lingkungan Sespimma.
2. `Internal`: Khusus untuk personel Polri, Gadik, dan Serdik Sespimma terdaftar.
3. `Terbatas`: Hanya dapat diakses oleh Pokja pengampu naskah, Gadik bersangkutan, atau Administrator.
4. `Metadata Saja`: Khusus untuk karya tulis Taskap dan koleksi buku fisik perpustakaan. **Pengunduhan berkas naskah digital diblokir keras oleh server (Strict HTTP 403 Forbidden).**

---

### F. 5 Status Siklus Hidup Dokumen (Lifecycle State Machine)
`Draft` $\rightarrow$ `Diverifikasi` $\rightarrow$ `Dipublikasikan` $\rightarrow$ `Tidak Aktif` $\rightarrow$ `Arsip`

---

## 2. Katalog Endpoint Terperinci & Contoh Payload

```
DAFTAR MODUL:
├── Modul 1: Sistem & Health Check (1 endpoint)
├── Modul 2: Autentikasi & Akun Pengguna (4 endpoint)
├── Modul 3: Taksonomi Kategori & Subkategori (2 endpoint)
├── Modul 4: Katalog Sumber Belajar / Resources (3 endpoint)
├── Modul 5: Tenaga Pendidik / Gadik (2 endpoint)
├── Modul 6: Perpustakaan & E-Library (3 endpoint)
├── Modul 7: Berkas Digital & Streaming Pembaca (2 endpoint)
├── Modul 8: Pencarian Terpadu / Unified Search (1 endpoint)
├── Modul 9: Tata Kelola Naskah Admin & Gadik (3 endpoint)
├── Modul 10: Verifikasi Mutu Pokja Bag Jarlat (2 endpoint)
├── Modul 11: Manajemen Pengguna & Peran (3 endpoint)
└── Modul 12: Monitoring & Jejak Audit (2 endpoint)
```

---

### Modul 1: Sistem & Health Check

#### 1.1. Health Check Status Server & Basis Data
- **Endpoint:** `GET /api/v1/health`
- **Hak Akses:** Publik (Tidak perlu token)
- **Header:** `Accept: application/json`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "SIPINTAR API service is healthy and connected to MySQL",
  "data": {
    "status": "healthy",
    "database": "connected",
    "databaseName": "sipintar_db",
    "dbTimestamp": "2026-11-17T13:52:08.000Z",
    "serverTimestamp": "2026-11-17T13:52:08.125Z",
    "uptime": 1284,
    "environment": "development"
  }
}
```

---

### Modul 2: Autentikasi & Akun Pengguna

#### 2.1. Login Pengguna (Email atau NRP/NIP)
- **Endpoint:** `POST /api/v1/auth/login`
- **Hak Akses:** Publik *(Rate Limit: 30 percobaan / 15 menit)*
- **Header:** `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "identifier": "dewi.susilo@sespimma.lemdiklat.polri.go.id",
  "password": "Password123!"
}
```
*(Identifier dapat diisi Email dinas atau NRP/NIP: contoh `"80010001"`).*

- **Respon Sukses (HTTP 200 OK):**
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

- **Respon Gagal - Kata Sandi Salah (HTTP 401 UNAUTHORIZED):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Kredensial tidak valid: NRP/NIP/Email atau kata sandi salah.",
    "details": []
  }
}
```

---

#### 2.2. Mengambil Profil Pengguna Aktif (`/auth/me`)
- **Endpoint:** `GET /api/v1/auth/me`
- **Hak Akses:** Authenticated (Semua Peran)
- **Header:** `Authorization: Bearer <token>`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Profil pengguna berhasil diambil",
  "data": {
    "id": 1,
    "uuid": "usr-admin-01",
    "nrp_nip": "80010001",
    "nama_lengkap": "AKBP Dewi Susilo Pangestuti, S.Ak.",
    "email": "dewi.susilo@sespimma.lemdiklat.polri.go.id",
    "role": "admin",
    "role_name": "Administrator Sistem",
    "is_active": 1,
    "created_at": "2026-10-14T08:00:00.000Z",
    "profile": {
      "pangkat": "AKBP",
      "jabatan": "Administrator Sistem & Penjamin Mutu"
    }
  }
}
```

---

#### 2.3. Pendaftaran Mandiri Serdik Baru (`/auth/register`)
- **Endpoint:** `POST /api/v1/auth/register`
- **Hak Akses:** Publik *(Rate Limit: 30 percobaan / 15 menit)*
- **Header:** `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "nama_lengkap": "KOMPOL Budi Hartono, S.I.K.",
  "email": "budi.hartono@serdik.polri.go.id",
  "password": "Password123!",
  "nrp_nip": "86010999",
  "pangkat": "KOMPOL",
  "jabatan": "Peserta Didik Sespimma Angkatan 73",
  "role_code": "serdik",
  "phone_number": "081234567899"
}
```
- **Respon Sukses (HTTP 201 CREATED):**
```json
{
  "success": true,
  "message": "Pendaftaran akun serdik berhasil",
  "data": {
    "user": {
      "id": 24,
      "uuid": "7a9f8e12-c4b3-4f11-9a72-...",
      "nrp_nip": "86010999",
      "nama_lengkap": "KOMPOL Budi Hartono, S.I.K.",
      "email": "budi.hartono@serdik.polri.go.id",
      "role": "serdik"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2.4. Verifikasi Wewenang Administrator (`/auth/admin-check`)
- **Endpoint:** `GET /api/v1/auth/admin-check`
- **Hak Akses:** Khusus Peran `admin`
- **Header:** `Authorization: Bearer <admin_token>`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Akses administrator terverifikasi",
  "data": {
    "userId": 1,
    "role": "admin",
    "verifiedAt": "2026-11-17T13:52:08.500Z"
  }
}
```
- **Respon Ditolak untuk Non-Admin (HTTP 403 FORBIDDEN):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Akses ditolak: Wewenang peran pengguna tidak mencukupi untuk rute ini.",
    "details": []
  }
}
```

---

### Modul 3: Taksonomi Kategori & Subkategori

#### 3.1. Daftar 8 Kategori Utama Sumber Belajar
- **Endpoint:** `GET /api/v1/categories`
- **Hak Akses:** Publik / Terbuka
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar kategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "slug": "gadik",
      "name": "Gadik & Kompetensi",
      "description": "Profil 16 Personel Polri Fungsional & Widyaiswara Sespimma",
      "icon_name": "users",
      "total_resources": 16
    },
    {
      "id": 2,
      "slug": "modul",
      "name": "Modul & Hanjar",
      "description": "Koleksi 78 bahan ajar kurikulum Sespimma TA 2025/2026",
      "icon_name": "book-open",
      "total_resources": 78
    },
    {
      "id": 3,
      "slug": "library",
      "name": "E-Library/Perpustakaan",
      "description": "Koleksi pustaka digital, e-book, buku fisik, dan Taskap",
      "icon_name": "library",
      "total_resources": 14
    },
    {
      "id": 4,
      "slug": "kurikulum",
      "name": "Kurikulum & Standar Layanan",
      "description": "Struktur kurikulum, SKL, silabus pendidikan kepolisian",
      "icon_name": "layers",
      "total_resources": 19
    },
    {
      "id": 5,
      "slug": "sop",
      "name": "SOP",
      "description": "Standar Operasional Prosedur kedinasan dan diklat",
      "icon_name": "file-check",
      "total_resources": 35
    },
    {
      "id": 6,
      "slug": "pedoman",
      "name": "Pedoman",
      "description": "Petunjuk teknis penyelenggaraan pendidikan kepolisian",
      "icon_name": "compass",
      "total_resources": 22
    },
    {
      "id": 7,
      "slug": "manual",
      "name": "Manual Book",
      "description": "Panduan sistem informasi pembelajaran SIPINTAR",
      "icon_name": "help-circle",
      "total_resources": 6
    },
    {
      "id": 8,
      "slug": "search",
      "name": "Pencarian Terpadu",
      "description": "Pencarian cerdas terintegrasi lintas seluruh repositori",
      "icon_name": "search",
      "total_resources": 108
    }
  ]
}
```

---

#### 3.2. Mengambil Subkategori Berdasarkan Kategori
- **Endpoint:** `GET /api/v1/categories/:id/subcategories`
- **Parameter URL:** `:id` (dapat berupa ID numerik `2` atau slug `'modul'`)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar subkategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "category_id": 2,
      "slug": "hanjar-utama",
      "name": "Bahan Ajar Utama (Hanjar)",
      "description": "Naskah materi pokok ajar Sespimma TA 2025/2026"
    },
    {
      "id": 2,
      "category_id": 2,
      "slug": "modul-praktik",
      "name": "Modul Praktik & Latihan",
      "description": "Lembar kerja sindikat dan simulasi taktis kepemimpinan"
    }
  ]
}
```

---

### Modul 4: Katalog Sumber Belajar (Resources)

#### 4.1. Katalog Sumber Belajar dengan Filter Multi-Kriteria
- **Endpoint:** `GET /api/v1/resources`
- **Hak Akses:** Publik (Hanya melihat `Dipublikasikan`), atau Authenticated (Privileged dapat melihat `Draft`/`Arsip` dengan menyertakan `status=...`).
- **Parameter Query (Opsional):**
  - `page`: nomor halaman (default `1`)
  - `limit`: jumlah per halaman (default `10`, maks `100`)
  - `category_id` atau `category`: ID kategori atau slug (`modul`, `kurikulum`, `sop`, `pedoman`, `manual`)
  - `status` atau `lifecycle_status`: status naskah (`Dipublikasikan`, `Draft`, `Arsip`, atau `all`)
  - `access_classification`: filter klasifikasi (`Terbuka`, `Internal`, `Terbatas`, `Metadata Saja`)
  - `tag`: filter tag spesifik (contoh `?tag=Kepemimpinan`)
  - `q` atau `search`: kata kunci pencarian naskah
- **Contoh URL:** `GET /api/v1/resources?category=modul&page=1&limit=2`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar sumber belajar berhasil diambil",
  "data": [
    {
      "id": 1,
      "uuid": "res-hanjar-sespimma-01",
      "title": "Hanjar 01: Peran Polri dalam Optimalisasi Sektor Pangan",
      "category_id": 2,
      "category_name": "Modul & Hanjar",
      "category_slug": "modul",
      "sub_category_id": 1,
      "sub_category_name": "Bahan Ajar Utama (Hanjar)",
      "sub_category_text": "Bahan Ajar Pokok",
      "description": "Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025 mengenai strategi pengawalan swasembada pangan nasional...",
      "author_or_instructor": "Tim Pokja Hanjar Sespimma Lemdiklat Polri",
      "unit_or_source": "Bag Jarlat Sespimma Lemdiklat Polri",
      "lifecycle_status": "Dipublikasikan",
      "access_classification": "Internal",
      "has_digital_file": 1,
      "file_format": "PDF",
      "file_size_bytes": 14200000,
      "file_size_label": "14.2 MB",
      "physical_location": null,
      "published_at": "2026-01-15T08:00:00.000Z",
      "created_at": "2026-01-10T08:00:00.000Z",
      "tags": ["Ketahanan Pangan", "Strategi Nasional", "Hanjar 2025", "Swasembada"]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 2,
    "total": 78,
    "totalPages": 39
  }
}
```

---

#### 4.2. Detail Sumber Belajar
- **Endpoint:** `GET /api/v1/resources/:id`
- **Parameter URL:** `:id` (dapat berupa ID integer `1` atau UUID `'res-hanjar-sespimma-01'`)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Detail sumber belajar berhasil diambil",
  "data": {
    "id": 1,
    "uuid": "res-hanjar-sespimma-01",
    "title": "Hanjar 01: Peran Polri dalam Optimalisasi Sektor Pangan",
    "category_id": 2,
    "category_name": "Modul & Hanjar",
    "category_slug": "modul",
    "description": "Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025 mengenai strategi pengawalan swasembada pangan nasional...",
    "author_or_instructor": "Tim Pokja Hanjar Sespimma Lemdiklat Polri",
    "unit_or_source": "Bag Jarlat Sespimma Lemdiklat Polri",
    "lifecycle_status": "Dipublikasikan",
    "access_classification": "Internal",
    "has_digital_file": 1,
    "file_format": "PDF",
    "file_size_label": "14.2 MB",
    "file_url": "/hanjar-01-sektor-pangan.pdf",
    "creator_name": "AKBP Dewi Susilo Pangestuti, S.Ak.",
    "verifier_name": "AKBP Dr. Bambang Sudarmono, M.Hum.",
    "tags": ["Ketahanan Pangan", "Strategi Nasional", "Hanjar 2025", "Swasembada"],
    "tag_details": [
      { "id": 1, "tag_name": "Ketahanan Pangan" },
      { "id": 2, "tag_name": "Strategi Nasional" }
    ]
  }
}
```

---

#### 4.3. Rekomendasi Materi Terkait (Related Resources)
- **Endpoint:** `GET /api/v1/resources/:id/related`
- **Parameter Query:** `limit` (default `4`)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar materi terkait berhasil diambil",
  "data": [
    {
      "id": 14,
      "uuid": "res-hanjar-sespimma-14",
      "title": "Hanjar 14: Tata Kelola Logistik dan Rantai Pasok Pangan",
      "category_id": 2,
      "category_name": "Modul & Hanjar",
      "author_or_instructor": "Tim Pokja Hanjar Sespimma Lemdiklat Polri",
      "lifecycle_status": "Dipublikasikan",
      "access_classification": "Internal",
      "file_format": "PDF",
      "file_size_label": "12.8 MB",
      "shared_tags_count": 2,
      "tags": ["Ketahanan Pangan", "Logistik"]
    }
  ]
}
```

---

### Modul 5: Direktori Tenaga Pendidik (Gadik)

#### 5.1. Daftar Personel Fungsional Gadik & Rekapitulasi Kepakaran
- **Endpoint:** `GET /api/v1/gadik`
- **Parameter Query (Opsional):**
  - `fungsional`: `true` (filter personel aktif fungsional Lemdiklat)
  - `pangkat`: `'KOMBES POL'`, `'AKBP'`, `'KOMPOL'`, `'IPTU'`
  - `search`: cari nama, NRP, atau jabatan
  - `page`, `limit`
- **Contoh URL:** `GET /api/v1/gadik?fungsional=true`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar tenaga pendidik berhasil diambil",
  "data": [
    {
      "id": 14,
      "uuid": "usr-gadik-08",
      "nrp_nip": "80010001",
      "nama_lengkap": "DEWI SUSILO PANGESTUTI, S.Ak.",
      "email": "dewi.susilo@sespimma.lemdiklat.polri.go.id",
      "no_urut_nominatif": 8,
      "pangkat": "AKBP",
      "jabatan": "GADIK MADYA SESPIMMA",
      "kategori_jabatan": "Gadik Madya",
      "agama": "ISLAM",
      "eselon": "III A2",
      "golongan": "IV-B",
      "status_fungsional": "Aktif Fungsional",
      "no_sprint": "Sprin/128/X/DIK.2.1./2026",
      "bio": "Tenaga Pendidik Madya Sespimma Lemdiklat Polri sekaligus Inovator Utama SIPINTAR...",
      "competencies": [
        { "id": 43, "name": "Manajemen Logistik Kepolisian", "type": "kepakaran" },
        { "id": 44, "name": "Akuntansi & Tata Kelola Keuangan Polri", "type": "kepakaran" },
        { "id": 45, "name": "Sistem Informasi Pembelajaran Terpadu", "type": "kepakaran" },
        { "id": 46, "name": "Manajemen Aset dan Rantai Pasok", "type": "mata_ajar" }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 16,
    "totalPages": 1
  }
}
```

---

#### 5.2. Detail Gadik Beserta Karya Materi Binaan (`/gadik/:id`)
- **Endpoint:** `GET /api/v1/gadik/:id`
- **Parameter URL:** `:id` (dapat berupa ID integer `14`, UUID `'usr-gadik-08'`, atau NRP `'80010001'`)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Detail tenaga pendidik berhasil diambil",
  "data": {
    "id": 14,
    "uuid": "usr-gadik-08",
    "nrp_nip": "80010001",
    "nama_lengkap": "DEWI SUSILO PANGESTUTI, S.Ak.",
    "pangkat": "AKBP",
    "jabatan": "GADIK MADYA SESPIMMA",
    "kategori_jabatan": "Gadik Madya",
    "no_sprint": "Sprin/128/X/DIK.2.1./2026",
    "status_fungsional": "Aktif Fungsional",
    "bio": "Tenaga Pendidik Madya Sespimma Lemdiklat Polri...",
    "competencies": [
      { "id": 43, "competency_name": "Manajemen Logistik Kepolisian", "competency_type": "kepakaran" }
    ],
    "associated_resources": [
      {
        "id": 16,
        "uuid": "res-book-01",
        "title": "Manajemen Logistik dan Pengadaan Polri Modern (Edisi Hardcover Cetak)",
        "category_id": 3,
        "category_name": "E-Library/Perpustakaan",
        "category_slug": "library",
        "author_or_instructor": "AKBP Dewi Susilo Pangestuti, S.Ak. & Tim Ahli Logistik",
        "lifecycle_status": "Dipublikasikan",
        "access_classification": "Internal",
        "file_format": "PDF",
        "file_size_label": "18.5 MB",
        "published_at": "2026-02-01T08:00:00.000Z"
      }
    ]
  }
}
```

---

### Modul 6: Perpustakaan & E-Library

#### 6.1. Daftar 4 Kategori Perpustakaan
- **Endpoint:** `GET /api/v1/library/categories`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Kategori perpustakaan berhasil diambil",
  "data": [
    {
      "id": "buku-fisik",
      "name": "Koleksi Buku Fisik",
      "description": "Buku teks cetak dan monograf referensi di rak Gedung Perpustakaan Sespimma.",
      "total_books": 4,
      "books_available": 4
    },
    {
      "id": "ebook",
      "name": "E-Book",
      "description": "Buku digital berformat PDF/EPUB dengan fitur pratinjau sampel bab awal.",
      "total_books": 4,
      "books_available": 4
    },
    {
      "id": "taskap",
      "name": "Karya Tulis Kepolisian (Taskap)",
      "description": "Kertas Karya Perorangan (Taskap) peserta didik Sespimma.",
      "total_books": 4,
      "books_available": 4
    },
    {
      "id": "jurnal",
      "name": "Jurnal Ilmiah Terbitan",
      "description": "Publikasi berkala ilmiah, riset empiris kepolisian, dan prosiding seminar.",
      "total_books": 2,
      "books_available": 2
    }
  ]
}
```

---

#### 6.2. Katalog Koleksi Buku & Pustaka
- **Endpoint:** `GET /api/v1/library/books`
- **Parameter Query (Opsional):**
  - `category` atau `category_id`: `'buku-fisik'`, `'ebook'`, `'taskap'`, `'jurnal'`, atau `'all'`
  - `author`: filter nama penulis
  - `stock_available`: `true`
  - `q`: pencarian judul, sinopsis, atau nomor panggil (*call number*)
- **Contoh URL:** `GET /api/v1/library/books?category=ebook&page=1&limit=2`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar buku perpustakaan berhasil diambil",
  "data": [
    {
      "id": 5,
      "uuid": "book-ebook-01",
      "isbn": "978-602-0055-12-8",
      "title": "Kepemimpinan Strategis Transformasional Polri di Era Digital",
      "author": "Irjen Pol. Prof. Dr. Chryshnanda Dwilaksana, M.Si.",
      "publisher": "Lemdiklat Polri Press",
      "published_year": 2024,
      "synopsis": "Kajian mendalam mengenai urgensi perubahan paradigma kepemimpinan transformasional...",
      "library_category_id": "ebook",
      "library_category_name": "E-Book",
      "call_number": "EB 355.33 CHR k",
      "physical_location": "Server Pustaka Digital Sespimma",
      "access_classification": "Internal",
      "has_digital_file": 1,
      "has_preview": 1,
      "file_format": "PDF",
      "file_size_label": "24.6 MB",
      "total_pages": 384,
      "preview_pages": 25
    }
  ],
  "meta": {
    "page": 1,
    "limit": 2,
    "total": 4,
    "totalPages": 2
  }
}
```

---

#### 6.3. Detail Buku Bibliografis (`/library/books/:id`)
- **Endpoint:** `GET /api/v1/library/books/:id`
- **Parameter URL:** `:id` (ID integer `5` atau UUID `'book-ebook-01'`)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Detail buku perpustakaan berhasil diambil",
  "data": {
    "id": 5,
    "uuid": "book-ebook-01",
    "isbn": "978-602-0055-12-8",
    "title": "Kepemimpinan Strategis Transformasional Polri di Era Digital",
    "author": "Irjen Pol. Prof. Dr. Chryshnanda Dwilaksana, M.Si.",
    "publisher": "Lemdiklat Polri Press",
    "published_year": 2024,
    "synopsis": "Kajian mendalam...",
    "library_category_id": "ebook",
    "library_category_name": "E-Book",
    "call_number": "EB 355.33 CHR k",
    "stock_total": 50,
    "stock_available": 48,
    "access_classification": "Internal",
    "total_pages": 384,
    "preview_pages": 25,
    "preview_file_path": "/sample-ebook-kepemimpinan.pdf",
    "file_path": "/full-ebook-kepemimpinan.pdf"
  }
}
```
*(Catatan Keamanan: Jika `access_classification === 'Metadata Saja'`, properti `file_path` secara otomatis dihapus dari respon agar tautan langsung tidak terekspos).*

---

### Modul 7: Berkas Digital & Streaming Pembaca In-App

#### 7.1. Streaming / Unduhan Berkas Materi Ajar
- **Endpoint:** `GET /api/v1/resources/:id/file`
- **Hak Akses:** Sesuai Klasifikasi Akses Naskah
- **Parameter Query (Opsional):** `download=true` (menghasilkan header `Content-Disposition: attachment; filename="..."`; tanpa parameter ini menghasilkan `Content-Disposition: inline` untuk pembaca PDF di peramban).
- **Perlindungan Dokumen 'Metadata Saja' (HTTP 403 FORBIDDEN):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Akses berkas digital dibatasi: Dokumen ini berstatus 'Metadata Saja' (Karya tulis Taskap / Koleksi fisik perpustakaan). Berkas utuh tidak tersedia untuk diunduh.",
    "details": []
  }
}
```

---

#### 7.2. Pratinjau Sampel Buku (10–25 Halaman Bab Awal)
- **Endpoint:** `GET /api/v1/library/books/:id/preview`
- **Hak Akses:** Terbuka untuk seluruh personel terdaftar
- **Header Respon:**
```http
Content-Type: application/pdf
Content-Disposition: inline; filename="sample_preview.pdf"
```

---

### Modul 8: Pencarian Terpadu (Unified Search)

#### 8.1. Pencarian Lintas Repositori (FULLTEXT Search)
- **Endpoint:** `GET /api/v1/search`
- **Parameter Query:**
  - `q`: kata kunci pencarian (contoh: `"kepemimpinan"`, `"hanjar"`, `"logistik"`)
  - `category`: `'all'`, `'resources'`, `'books'`, `'gadik'`, atau slug spesifik
  - `page`, `limit`
- **Contoh URL:** `GET /api/v1/search?q=kepemimpinan&category=all`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Pencarian berhasil dieksekusi",
  "data": [
    {
      "id": 5,
      "uuid": "book-ebook-01",
      "type": "book",
      "title": "Kepemimpinan Strategis Transformasional Polri di Era Digital",
      "subtitle": "E-Book • Irjen Pol. Prof. Dr. Chryshnanda Dwilaksana, M.Si. (EB 355.33 CHR k)",
      "description": "Kajian mendalam mengenai urgensi perubahan paradigma kepemimpinan transformasional di institusi kepolisian modern...",
      "category": "E-Book",
      "category_slug": "ebook",
      "access_classification": "Internal",
      "score": 12.84
    },
    {
      "id": 1,
      "uuid": "res-hanjar-sespimma-01",
      "type": "resource",
      "title": "Hanjar 01: Peran Polri dalam Optimalisasi Sektor Pangan",
      "subtitle": "Modul & Hanjar • Tim Pokja Hanjar Sespimma Lemdiklat Polri",
      "description": "Bahan ajar resmi Sespimma Lemdiklat Polri...",
      "category": "Modul & Hanjar",
      "category_slug": "modul",
      "access_classification": "Internal",
      "score": 5.28
    }
  ],
  "meta": {
    "query": "kepemimpinan",
    "categoryFilter": "all",
    "page": 1,
    "limit": 10,
    "total": 14,
    "totalPages": 2
  }
}
```

---

### Modul 9: Tata Kelola Naskah Admin & Gadik

#### 9.1. Membuat Draf Sumber Belajar Baru
- **Endpoint:** `POST /api/v1/admin/resources`
- **Hak Akses:** `admin`, `pengelola`, `gadik`
- **Format:** `multipart/form-data` atau `application/json` (jika tanpa berkas fisik)
- **Form Fields / JSON:**
  - `title`: Judul lengkap materi ajar *(Wajib)*
  - `category_id`: ID kategori integer (2 = Modul, 4 = Kurikulum, 5 = SOP, dst) *(Wajib)*
  - `author_or_instructor`: Nama penyusun / Gadik pengampu *(Wajib)*
  - `unit_or_source`: Unit satker (contoh: `"Bag Jarlat Sespimma"`)
  - `description`: Deskripsi / sinopsis ringkas
  - `access_classification`: `'Terbuka'`, `'Internal'`, `'Terbatas'`, atau `'Metadata Saja'` *(Default: `'Internal'`)*
  - `lifecycle_status`: `'Draft'` *(Default: `'Draft'`)*
  - `tags`: Array string tag atau string dipisah koma (contoh: `["Kepemimpinan", "Hanjar 2026"]`)
  - `file`: Berkas fisik dokumen (`.pdf`, `.docx`, `.pptx`, `.epub`, `.mp4` maks 50 MB)
- **Respon Sukses (HTTP 201 CREATED):**
```json
{
  "success": true,
  "message": "Draf sumber belajar berhasil dibuat",
  "data": {
    "id": 97,
    "uuid": "6f2e8c14-7a31-4d1a-8c9e-214e9f5a01bc",
    "title": "Modul Pengawasan dan Akuntabilitas Kinerja Kepemimpinan",
    "category_id": 2,
    "lifecycle_status": "Draft",
    "access_classification": "Internal",
    "has_digital_file": true,
    "file_url": "/1794924312175-modul-akuntabilitas.pdf",
    "file_size_label": "4.2 MB"
  }
}
```

---

#### 9.2. Memperbarui Metadata Naskah (`PUT /admin/resources/:id`)
- **Endpoint:** `PUT /api/v1/admin/resources/:id`
- **Hak Akses:** `admin`, `pengelola`, atau `gadik` pengusul draf bersangkutan
- **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "title": "Modul Pengawasan dan Akuntabilitas Kinerja Kepemimpinan (Edisi Revisi)",
  "category_id": 2,
  "author_or_instructor": "KOMBES POL Hendra Pratama, S.I.K., M.Si.",
  "description": "Pembaruan bab evaluasi indikator kinerja dan mekanisme tindak lanjut pengawasan",
  "access_classification": "Internal"
}
```
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Sumber belajar berhasil diperbarui",
  "data": {
    "id": 97,
    "uuid": "6f2e8c14-7a31-4d1a-8c9e-214e9f5a01bc",
    "title": "Modul Pengawasan dan Akuntabilitas Kinerja Kepemimpinan (Edisi Revisi)",
    "lifecycle_status": "Draft",
    "access_classification": "Internal"
  }
}
```

---

#### 9.3. Mengarsipkan Naskah / Soft Delete (`PATCH /admin/resources/:id/archive`)
- **Endpoint:** `PATCH /api/v1/admin/resources/:id/archive`
- **Hak Akses:** `admin`, `verifikator`
- **Header:** `Authorization: Bearer <token>`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Sumber belajar berhasil diarsipkan",
  "data": {
    "id": 97,
    "lifecycle_status": "Arsip"
  }
}
```

---

### Modul 10: Verifikasi Mutu Pokja Bag Jarlat

#### 10.1. Daftar Antrean Naskah Verifikasi
- **Endpoint:** `GET /api/v1/admin/verification/queue`
- **Hak Akses:** `admin`, `verifikator`
- **Header:** `Authorization: Bearer <token>`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Antrean verifikasi berhasil diambil",
  "data": [
    {
      "id": 97,
      "uuid": "6f2e8c14-...",
      "title": "Modul Pengawasan dan Akuntabilitas Kinerja Kepemimpinan",
      "category_name": "Modul & Hanjar",
      "author_or_instructor": "KOMBES POL Hendra Pratama, S.I.K., M.Si.",
      "creator_name": "KOMBES POL Hendra Pratama, S.I.K., M.Si.",
      "lifecycle_status": "Draft",
      "access_classification": "Internal",
      "file_format": "PDF",
      "file_size_label": "4.2 MB",
      "created_at": "2026-11-17T14:00:00.000Z"
    }
  ]
}
```

---

#### 10.2. Penilaian Mutu Naskah (Setujui atau Kembalikan Revisi)
- **Endpoint:** `POST /api/v1/admin/verification/:id/review`
- **Hak Akses:** `admin`, `verifikator`
- **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body - Persetujuan Publikasi (Approve):**
```json
{
  "decision": "approve",
  "notes": "Materi telah memenuhi standar baku kurikulum Lemdiklat Polri dan format tata naskah dinas."
}
```
- **Request Body - Pengembalian Draf (Reject / Perlu Revisi):**
```json
{
  "decision": "reject",
  "notes": "Mohon lengkapi lembar studi kasus sindikat pada Bab III halaman 45."
}
```
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Verifikasi sumber belajar berhasil diproses (Status: Dipublikasikan)",
  "data": {
    "id": 97,
    "lifecycle_status": "Dipublikasikan",
    "verified_by": 4,
    "verifier_name": "AKBP Dr. Bambang Sudarmono, M.Hum.",
    "verified_at": "2026-11-17T14:05:00.000Z"
  }
}
```

---

### Modul 11: Manajemen Pengguna & Hak Akses

#### 11.1. Daftar Seluruh Akun Pengguna
- **Endpoint:** `GET /api/v1/admin/users`
- **Hak Akses:** Khusus `admin`
- **Parameter Query (Opsional):**
  - `role`: filter kode peran (`'serdik'`, `'gadik'`, `'pengelola'`, `'verifikator'`, `'admin'`, `'pimpinan'`)
  - `is_active`: `1` (aktif) atau `0` (non-aktif)
  - `search`: cari nama, NRP, atau email
  - `page`, `limit`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Daftar pengguna berhasil diambil",
  "data": [
    {
      "id": 5,
      "uuid": "usr-serdik-01",
      "nrp_nip": "85071234",
      "nama_lengkap": "KOMPOL Arya Ramadhan, S.I.K.",
      "email": "arya.ramadhan@serdik.polri.go.id",
      "role_code": "serdik",
      "role_name": "Peserta Didik (Serdik)",
      "is_active": 1,
      "created_at": "2026-10-14T08:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

---

#### 11.2. Mengubah Peran Pengguna (`PATCH /admin/users/:id/role`)
- **Endpoint:** `PATCH /api/v1/admin/users/:id/role`
- **Hak Akses:** Khusus `admin`
- **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "role_code": "verifikator"
}
```
*(Daftar peran yang diterima: `"serdik"`, `"gadik"`, `"pengelola"`, `"verifikator"`, `"admin"`, `"pimpinan"`).*
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Peran pengguna berhasil diubah menjadi verifikator",
  "data": {
    "user_id": 23,
    "user_name": "KOMPOL Fajar Nugraha, S.I.K.",
    "new_role": "verifikator"
  }
}
```

---

#### 11.3. Aktivasi / Deaktivasi Status Akun Pengguna (`PATCH /admin/users/:id/status`)
- **Endpoint:** `PATCH /api/v1/admin/users/:id/status`
- **Hak Akses:** Khusus `admin`
- **Header:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (JSON):**
```json
{
  "is_active": false
}
```
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Status akun pengguna berhasil dinonaktifkan",
  "data": {
    "user_id": 23,
    "user_name": "KOMPOL Fajar Nugraha, S.I.K.",
    "is_active": false
  }
}
```
- **Proteksi Keamanan Self-Deactivation Guard (HTTP 400 INVALID_ACTION):**
Jika seorang administrator mencoba menonaktifkan akunnya sendiri yang sedang aktif:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ACTION",
    "message": "Administrator tidak dapat menonaktifkan akun miliknya sendiri yang sedang aktif.",
    "details": []
  }
}
```

---

### Modul 12: Pemantauan Eksekutif & Jejak Audit

#### 12.1. Statistik Real-Time Agregat Sistem
- **Endpoint:** `GET /api/v1/admin/monitoring/stats`
- **Hak Akses:** `admin`, `pimpinan`
- **Header:** `Authorization: Bearer <token>`
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Statistik sistem berhasil diambil",
  "data": {
    "resources": {
      "total": 78,
      "published": 76,
      "draft": 2,
      "archived": 0,
      "inactive": 0
    },
    "books": {
      "total": 14,
      "published": 14,
      "by_category": {
        "buku-fisik": 4,
        "ebook": 4,
        "taskap": 4,
        "jurnal": 2
      }
    },
    "users": {
      "total": 24,
      "active": 24,
      "by_role": {
        "admin": 2,
        "serdik": 2,
        "gadik": 16,
        "verifikator": 2,
        "pengelola": 1,
        "pimpinan": 1
      }
    },
    "access_classifications": {
      "internal": 82,
      "terbuka": 6,
      "terbatas": 4
    },
    "storage": {
      "total_files": 92,
      "total_size_mb": 482.4
    }
  }
}
```

---

#### 12.2. Rekam Jejak Audit & Aktivitas Mutasi (Audit Trail)
- **Endpoint:** `GET /api/v1/admin/monitoring/logs`
- **Hak Akses:** `admin`, `pimpinan`
- **Parameter Query (Opsional):** `action`, `limit` (default 50)
- **Respon Sukses (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Log aktivitas berhasil diambil",
  "data": [
    {
      "id": 142,
      "user_id": 1,
      "user_name": "AKBP Dewi Susilo Pangestuti, S.Ak.",
      "role": "admin",
      "action_type": "UPDATE_STATUS",
      "entity_type": "users",
      "entity_id": 23,
      "description": "Administrator memperbarui status akun pengguna 23 menjadi aktif",
      "ip_address": "127.0.0.1",
      "created_at": "2026-11-17T13:40:00.000Z"
    }
  ]
}
```

---

## 3. Panduan Integrasi Klien Frontend (TypeScript / Next.js)

### A. Contoh Klien Sentral (`src/lib/apiClient.ts`)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; meta?: any }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sipintar_auth_token') : null;

  const headers: HeadersInit = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    const error = new Error(json.error?.message || 'Permintaan API gagal');
    (error as any).code = json.error?.code;
    (error as any).status = response.status;
    throw error;
  }

  return json;
}
```

---

### B. Contoh Pengiriman Draf dengan Unggah File (FormData)

```typescript
export async function uploadNewDraft(formData: FormData) {
  // Jangan set 'Content-Type': browser otomatis menyematkan boundary multipart
  return await apiRequest('/admin/resources', {
    method: 'POST',
    body: formData,
  });
}

// Cara Penggunaan di Komponen React:
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const data = new FormData();
  data.append('title', 'Hanjar Manajemen Krisis Terpadu');
  data.append('category_id', '2');
  data.append('author_or_instructor', 'KOMBES POL Purwanto, S.I.K.');
  data.append('description', 'Bahan ajar latihan simulasi kontinjensi');
  data.append('access_classification', 'Internal');
  if (selectedFile) {
    data.append('file', selectedFile);
  }

  try {
    const res = await uploadNewDraft(data);
    alert(`Draf berhasil disimpan! ID: ${res.data.id}`);
  } catch (err: any) {
    alert(`Gagal: ${err.message}`);
  }
};
```

---

### C. Contoh Penanganan Hak Unduh File 'Metadata Saja'

```typescript
export function handleDocumentAction(resource: { id: number; access_classification: string }) {
  if (resource.access_classification === 'Metadata Saja') {
    alert('Naskah berklasifikasi "Metadata Saja". Berkas fisik tersedia di ruang baca Sespimma dan tidak dapat diunduh.');
    return;
  }
  
  // Buka penampil streaming in-app
  const fileUrl = `${BASE_URL}/resources/${resource.id}/file`;
  window.open(fileUrl, '_blank');
}
```

---

*Dokumen ini diperbarui secara berkala dan diverifikasi penuh melalui 30 skenario uji integrasi otomatis.*

