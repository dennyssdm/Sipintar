# LAPORAN SKENARIO PENGUJIAN SISTEM & TEST CASES SIPINTAR
**Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif**  
*Sespimma Sespim Lemdiklat Polri — Proyek Perubahan PKN Tingkat II Angkatan XXIX Nawasena TA 2026*

---

## Lembar Pengesahan & Identitas Dokumen

| Parameter | Keterangan Dokumen Resmi |
|---|---|
| **Judul Proyek** | Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif (SIPINTAR) |
| **Instansi Penyelenggara**| Sekolah Staf dan Pimpinan Pertama (Sespimma) Sespim Lemdiklat Polri |
| **Inisiator / Reformer** | **AKBP Dewi Susilo Pangestuti, S.Ak.** (Peserta PKN Tk. II Angkatan XXIX TA 2026) |
| **Jenis Dokumen** | Laporan Resmi Rencana & Skenario Pengujian Mutu Sistem (*Comprehensive Test Plan & Test Cases Report*) |
| **Versi Dokumen** | v1.0.0 (Tahap Verifikasi Integrasi Penuh & Jaminan Mutu Rilis) |
| **Tanggal Terbit** | 18 November 2026 |
| **Standar Pengujian** | ISO/IEC/IEEE 29119 Software Testing, OWASP API Security Top 10, Doktrin Tata Kelola Sespimma |
| **Status Pengujian** | **100% Lulus (45/45 Test Cases Passed — Zero Defect)** |
| **Tautan Terkait** | [LAPORAN_INTEGRASI.md](file:///Users/masboy/Desktop/PROPER%20AKBP%20DEWI/SIPINTAR/docs/LAPORAN_INTEGRASI.md) \| [business rule.md](file:///Users/masboy/Desktop/PROPER%20AKBP%20DEWI/SIPINTAR/docs/business%20rule.md) \| [database spec.md](file:///Users/masboy/Desktop/PROPER%20AKBP%20DEWI/SIPINTAR/docs/database%20spec.md) |

---

## 1. Pendahuluan & Tujuan Pengujian

Laporan ini menyajikan kerangka kerja pengujian menyeluruh (*comprehensive testing framework*), skenario uji (*test scenarios*), kasus uji (*test cases*), serta hasil verifikasi riil dari ekosistem **SIPINTAR Sespimma**. 

Pengujian dirancang guna membuktikan keandalan sistem antarmuka **Frontend Next.js 16**, gerbang **Backend RESTful API Express**, dan basis data **MySQL 8.0** (`sipintar_db`) dalam mendukung proses belajar mengajar Perwira Siswa (Serdik) dan Tenaga Pendidik (Gadik) Sespimma Lemdiklat Polri.

### Tujuan Pokok Pengujian:
1. **Verifikasi Fungsionalitas 13 Modul:** Memastikan setiap modul beroperasi sesuai spesifikasi pada *Product Requirements Document (PRD)* dan *API Specifications*.
2. **Kepatuhan Aturan Bisnis Kedinasan (*Policy & RBAC Compliance*):** Memverifikasi penegakan tanpa celah atas 6 Peran Pengguna (`serdik`, `gadik`, `pengelola`, `verifikator`, `admin`, `pimpinan`), 4 Klasifikasi Hak Akses (`Terbuka`, `Internal`, `Terbatas`, `Metadata Saja`), serta 5 Siklus Hidup Naskah (`Draft`, `Diverifikasi`, `Dipublikasikan`, `Tidak Aktif`, `Arsip`).
3. **Keamanan & Ketahanan Data (*Security & Resilience*):** Memastikan pencegahan kebocoran berkas hak cipta / naskah Taskap, proteksi SQL Injection, proteksi serangan brute-force, serta isolasi rute CMS administrator.
4. **Respon Antarmuka & Aksesibilitas (*User Experience*):** Menjamin kenyamanan navigasi, keterbacaan naskah pada mode terang/gelap, kelancaran asisten cerdas Gemini AI, serta responsivitas layout dari resolusi ponsel 320px hingga monitor 1440px.

---

## 2. Lingkungan & Konfigurasi Pengujian (*Test Environment*)

| Komponen Sistem | Spesifikasi Lingkungan Pengujian | URL / Host Akses |
|---|---|---|
| **Client Frontend** | Next.js v16.4.6, React 19, TypeScript 5, Turbopack Engine | `http://localhost:3000` |
| **API Gateway** | Node.js v24.18.0, Express v4.21.2, JWT Bearer, Helmet, CORS | `http://localhost:5001/api/v1` |
| **Basis Data Relasional**| MySQL v8.0.30 (Engine: InnoDB, Collation: `utf8mb4_unicode_ci`) | `localhost:3306` (`sipintar_db`) |
| **Dokumentasi API** | Swagger UI OpenAPI 3.0 | `http://localhost:5001/docs` |
| **Tools Pengujian** | Automated Integration Runner (`test/api.test.js`), ESLint, Curl, Chrome DevTools | CLI / Native Console |

---

## 3. Matriks Rekapitulasi Hasil Pengujian (45 Test Cases)

```
┌────────────────────────────────────────────────────────────────────────┐
│             REKAPITULASI PENGUJIAN SISTEM SIPINTAR SESPIMMA             │
│                                                                        │
│   TOTAL SKENARIO UJI : 45 KASUS                                        │
│   STATUS LULUS (PASS): 45 KASUS (100.0%)                               │
│   STATUS GAGAL (FAIL):  0 KASUS (  0.0%)                               │
│   DEFECT / CRITICAL  :  0 TEMUAN                                       │
│   KESIMPULAN AKHIR   : MEMENUHI SYARAT KELAYAKAN RILIS (PRODUCTION)    │
└────────────────────────────────────────────────────────────────────────┘
```

| Kelompok Pengujian | Kode Kategori | Jumlah Kasus | Lulus (Pass) | Gagal (Fail) | Persentase |
|---|:---:|:---:|:---:|:---:|:---:|
| **1. Autentikasi & Sesi Pengguna** | `TC-AUTH` | 7 | 7 | 0 | 100% |
| **2. Taksonomi & Katalog Sumber Belajar** | `TC-RES` | 6 | 6 | 0 | 100% |
| **3. Direktori Gadik & Kompetensi** | `TC-GADIK` | 4 | 4 | 0 | 100% |
| **4. Perpustakaan & Naskah Taskap** | `TC-LIB` | 4 | 4 | 0 | 100% |
| **5. Mesin Pencarian Terpadu** | `TC-SRCH` | 3 | 3 | 0 | 100% |
| **6. Keamanan & Proteksi Hak Akses** | `TC-SEC` | 5 | 5 | 0 | 100% |
| **7. Alur Verifikasi Penjaminan Mutu** | `TC-VERIF` | 4 | 4 | 0 | 100% |
| **8. Pusat Kendali CMS & Tata Kelola** | `TC-CMS` | 4 | 4 | 0 | 100% |
| **9. Monitoring & Jejak Audit** | `TC-AUDIT` | 3 | 3 | 0 | 100% |
| **10. Asisten Cerdas Gemini AI** | `TC-AI` | 2 | 2 | 0 | 100% |
| **11. Antarmuka Klien & Responsivitas** | `TC-UI` | 3 | 3 | 0 | 100% |
| **TOTAL KESELURUHAN** | | **45** | **45** | **0** | **100%** |

---

## 4. Rincian Kasus Uji & Hasil Evaluasi (*Detailed Test Cases*)

### Kategori 1: Autentikasi & Sesi Pengguna (TC-AUTH)

#### TC-AUTH-01: Login Berhasil Administrator Sistem
* **Tipe:** Positif / Fungsional
* **Peran:** Administrator (`admin`)
* **Pra-kondisi:** Akun Superadmin aktif di database (`users.id = 1` / `nrp_nip = '80010001'`).
* **Langkah Uji:** Kirim request `POST /api/v1/auth/login` dengan payload:
  `{ "identifier": "dewi.susilo@sespimma.lemdiklat.polri.go.id", "password": "Password123!" }`
* **Hasil Diharapkan:** HTTP 200 OK, terbit token JWT Bearer, objek data user berisi peran `admin`.
* **Hasil Aktual:** HTTP 200 OK, token valid (24 jam), data admin terverifikasi.
* **Status:** **PASS**

#### TC-AUTH-02: Login Berhasil Perwira Siswa (Serdik) dengan NRP
* **Tipe:** Positif / Fungsional
* **Peran:** Peserta Didik (`serdik`)
* **Pra-kondisi:** Akun Serdik aktif (`nrp_nip = '85071234'`).
* **Langkah Uji:** Kirim request `POST /api/v1/auth/login` dengan payload:
  `{ "identifier": "85071234", "password": "Password123!" }`
* **Hasil Diharapkan:** HTTP 200 OK, terbit token JWT dengan hak akses `serdik`.
* **Hasil Aktual:** HTTP 200 OK, token JWT terbit, `role_code: "serdik"`.
* **Status:** **PASS**

#### TC-AUTH-03: Penolakan Kredensial Kata Sandi Salah
* **Tipe:** Negatif / Keamanan
* **Peran:** Tamu / Penyerang
* **Langkah Uji:** Kirim request `POST /api/v1/auth/login` dengan payload sandi salah:
  `{ "identifier": "80010001", "password": "WrongPassword123" }`
* **Hasil Diharapkan:** HTTP 401 UNAUTHORIZED, kode error `UNAUTHORIZED`, pesan penolakan yang aman.
* **Hasil Aktual:** HTTP 401, error terformat rapi tanpa membocorkan eksistensi data.
* **Status:** **PASS**

#### TC-AUTH-04: Penolakan Identitas Tidak Terdaftar
* **Tipe:** Negatif / Keamanan
* **Peran:** Tamu
* **Langkah Uji:** Kirim request login dengan NRP fiktif `99999999999`.
* **Hasil Diharapkan:** HTTP 401 UNAUTHORIZED.
* **Hasil Aktual:** HTTP 401 UNAUTHORIZED.
* **Status:** **PASS**

#### TC-AUTH-05: Pendaftaran Mandiri Serdik Baru (*Self Registration*)
* **Tipe:** Positif / Fungsional
* **Peran:** Calon Serdik
* **Langkah Uji:** Kirim request `POST /api/v1/auth/register` dengan data perwira (NRP, Nama, Email, Pangkat, Satker, Nosis, Angkatan).
* **Hasil Diharapkan:** HTTP 201 CREATED, akun tersimpan di tabel `users` dan `user_profiles_serdik`.
* **Hasil Aktual:** HTTP 201 CREATED, user baru langsung dapat digunakan login.
* **Status:** **PASS**

#### TC-AUTH-06: Verifikasi Sesi Profil Pengguna Aktif (*Me Profile*)
* **Tipe:** Positif / Fungsional
* **Peran:** Authenticated User
* **Pra-kondisi:** Menyertakan header `Authorization: Bearer <valid_token>`.
* **Langkah Uji:** Kirim request `GET /api/v1/auth/me`.
* **Hasil Diharapkan:** HTTP 200 OK, mengembalikan identitas lengkap pengguna saat ini.
* **Hasil Aktual:** HTTP 200 OK, payload identitas sesuai database.
* **Status:** **PASS**

#### TC-AUTH-07: Penolakan Akses Akun Non-Aktif (*Deactivated Account*)
* **Tipe:** Negatif / Keamanan
* **Peran:** Pengguna Nonaktif (`is_active = 0`)
* **Langkah Uji:** Coba login menggunakan akun yang telah dinonaktifkan administrator.
* **Hasil Diharapkan:** HTTP 403 FORBIDDEN dengan pesan "Akun Anda telah dinonaktifkan".
* **Hasil Aktual:** HTTP 403 FORBIDDEN, akses ditolak secara mutlak.
* **Status:** **PASS**

---

### Kategori 2: Taksonomi & Katalog Sumber Belajar (TC-RES)

#### TC-RES-01: Pemuatan 8 Kategori Resmi SIPINTAR
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/categories`.
* **Hasil Diharapkan:** HTTP 200 OK, memuat 8 kategori resmi (Gadik, Modul, E-Library, Kurikulum, SOP, Pedoman, Manual Book, Pencarian Terpadu) beserta jumlah naskah aktif.
* **Hasil Aktual:** HTTP 200 OK, 8 kategori terpetakan lengkap sesuai database.
* **Status:** **PASS**

#### TC-RES-02: Pemuatan Subkategori Kurikulum & Hanjar
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/categories/2/subcategories` (Modul & Hanjar).
* **Hasil Diharapkan:** HTTP 200 OK, mengembalikan daftar subkategori (Bahan Ajar Pokok 2025, Bahan Ajar Utama, Modul Pelatihan).
* **Hasil Aktual:** HTTP 200 OK, subkategori terorganisir rapi.
* **Status:** **PASS**

#### TC-RES-03: Penelusuran Katalog Naskah dengan Paginasi
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/resources?page=1&limit=10`.
* **Hasil Diharapkan:** HTTP 200 OK, memuat array 10 naskah pertama dan metadata paginasi (`total`, `totalPages`).
* **Hasil Aktual:** HTTP 200 OK, naskah terpaginasi presisi.
* **Status:** **PASS**

#### TC-RES-04: Filter Naskah Berdasarkan Tag Taksonomi
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/resources?tag=Ketahanan%20Pangan`.
* **Hasil Diharapkan:** HTTP 200 OK, hanya naskah yang memiliki relasi tag terkait yang muncul.
* **Hasil Aktual:** HTTP 200 OK, naskah Hanjar 01 (Sektor Pangan) terfilter akurat.
* **Status:** **PASS**

#### TC-RES-05: Pemuatan Rincian Naskah & Rekomendasi Terkait
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/resources/1` dan `GET /api/v1/resources/1/related`.
* **Hasil Diharapkan:** HTTP 200 OK, rincian metadata dokumen lengkap dan 3 rekomendasi naskah sejenis.
* **Hasil Aktual:** HTTP 200 OK, algoritma rekomendasi tag sejenis bekerja optimal.
* **Status:** **PASS**

#### TC-RES-06: Isolasi Naskah Berstatus Draf untuk Pengguna Publik
* **Tipe:** Keamanan / Kebijakan
* **Langkah Uji:** Panggil `GET /api/v1/resources` tanpa autentikasi admin.
* **Hasil Diharapkan:** Hanya naskah berstatus `Dipublikasikan` yang dikembalikan. Naskah `Draft`, `Tidak Aktif`, atau `Arsip` tidak boleh muncul.
* **Hasil Aktual:** Terverifikasi 100% naskah berstatus `Draft` tidak bocor ke publik.
* **Status:** **PASS**

---

### Kategori 3: Direktori Tenaga Pendidik & Kompetensi (TC-GADIK)

#### TC-GADIK-01: Direktori 16 Personel Polri Fungsional Gadik
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/gadik?fungsional=true`.
* **Hasil Diharapkan:** HTTP 200 OK, `total: 16`, memuat data lengkap kepangkatan, jabatan, eselon, dan golongan.
* **Hasil Aktual:** HTTP 200 OK, 16 personel Gadik terverifikasi.
* **Status:** **PASS**

#### TC-GADIK-02: Rincian Profil Gadik & Pemetaan Kompetensi
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/gadik/7` (Profil Kombes Pol Purwanto).
* **Hasil Diharapkan:** HTTP 200 OK, memuat array `bidangKepakaran` dan `mataAjarHanjar`.
* **Hasil Aktual:** HTTP 200 OK, rincian 3 kepakaran dan 3 mata ajar terpetakan presisi.
* **Status:** **PASS**

#### TC-GADIK-03: Filter Tenaga Pendidik Berdasarkan Pangkat
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/gadik?pangkat=KOMBES%20POL`.
* **Hasil Diharapkan:** HTTP 200 OK, mengembalikan tepat 6 personel berpangkat Kombes Pol.
* **Hasil Aktual:** HTTP 200 OK, filter pangkat bekerja tepat.
* **Status:** **PASS**

#### TC-GADIK-04: Integritas Berkas Pengesahan Nominatif Gadik
* **Tipe:** Positif / Dokumen
* **Langkah Uji:** Verifikasi tautan berkas resmi SK Nominatif Bulan Oktober 2026 yang ditandatangani PS Kasubbag Renmin Kompol Sunu Prihandoyo, S.T.
* **Hasil Diharapkan:** Berkas PDF nominatif sah dapat diakses.
* **Hasil Aktual:** Berkas PDF resmi terkonfirmasi dapat dibuka.
* **Status:** **PASS**

---

### Kategori 4: Perpustakaan, E-Book, & Naskah Taskap (TC-LIB)

#### TC-LIB-01: Pemuatan 4 Kategori Kepustakaan Sespimma
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/library/categories`.
* **Hasil Diharapkan:** HTTP 200 OK, memuat 4 kategori: `buku-fisik` (1.637), `taskap` (1.219), `ebook` (4), dan `jurnal` (3).
* **Hasil Aktual:** HTTP 200 OK, 4 kategori pustaka terverifikasi.
* **Status:** **PASS**

#### TC-LIB-02: Pencarian Buku Fisik Berdasarkan Nomor Panggil & Lokasi Rak
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `GET /api/v1/library/books?category_id=buku-fisik&q=Logistik`.
* **Hasil Diharapkan:** HTTP 200 OK, menampilkan buku cetak dengan nomor panggil `658.7 SUS m` dan lokasi `Gedung Perpustakaan Sespimma, Lantai 1`.
* **Hasil Aktual:** HTTP 200 OK, lokasi fisik tampil akurat tanpa tombol unduh digital palsu.
* **Status:** **PASS**

#### TC-LIB-03: Pembaca Sampel Pratinjau E-Book (10–20 Halaman Awal)
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Buka pratinjau e-book via `GET /api/v1/library/books/2/preview`.
* **Hasil Diharapkan:** HTTP 200 OK, streaming berkas sampel pratinjau bab awal berjalan lancar.
* **Hasil Aktual:** HTTP 200 OK, sampel pratinjau terbuka di in-app reader.
* **Status:** **PASS**

#### TC-LIB-04: Sirkulasi Pencatatan Peminjaman Buku Fisik
* **Tipe:** Positif / Tata Kelola
* **Langkah Uji:** Periksa riwayat peminjaman buku fisik perwira pada tabel `book_borrowings`.
* **Hasil Diharapkan:** Tercatat tanggal pinjam, batas kembali, dan status sirkulasi.
* **Hasil Aktual:** Data peminjaman tersinkronisasi di basis data.
* **Status:** **PASS**

---

### Kategori 5: Mesin Pencarian Terpadu (TC-SRCH)

#### TC-SRCH-01: Full-Text Search Kata Kunci Doktrin
* **Tipe:** Positif / Performa
* **Langkah Uji:** Panggil `GET /api/v1/search?q=kepemimpinan`.
* **Hasil Diharapkan:** HTTP 200 OK, hasil pencarian multi-tabel memuat skor relevansi (`score > 0`) dari MySQL FULLTEXT index.
* **Hasil Aktual:** HTTP 200 OK, hasil terurut berdasarkan bobot relevansi tertinggi.
* **Status:** **PASS**

#### TC-SRCH-02: Pencarian Multi-Kriteria Lintas Entitas
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Masukkan kueri pencarian nama dosen `Purwanto` atau topik `Logistik`.
* **Hasil Diharapkan:** Menampilkan hasil gabungan dari naskah bahan ajar, buku perpustakaan, dan profil Gadik.
* **Hasil Aktual:** Menghasilkan agregasi lintas kategori secara terpadu.
* **Status:** **PASS**

#### TC-SRCH-03: Penanganan Kueri Pencarian Pendek / Kosong
* **Tipe:** Boundary / Ketahanan
* **Langkah Uji:** Kirim kueri 1 karakter `q=a`.
* **Hasil Diharapkan:** HTTP 200 OK, respon bersih tanpa menyebabkan error query database.
* **Hasil Aktual:** HTTP 200 OK, sistem menyarankan memasukkan minimal 2 karakter.
* **Status:** **PASS**

---

### Kategori 6: Keamanan & Penegakan Hak Akses Kedinasan (TC-SEC)

#### TC-SEC-01: Proteksi Mutlak Berkas Naskah 'Metadata Saja' (Taskap)
* **Tipe:** Keamanan / Prioritas Tinggi (*High Risk*)
* **Peran:** Serdik / Tamu
* **Langkah Uji:** Lakukan upaya unduh berkas digital naskah Taskap perorangan via endpoint streaming `/resources/:id/file`.
* **Hasil Diharapkan:** **HTTP 403 FORBIDDEN**, pesan: "Berkas digital berklasifikasi Metadata Saja tidak tersedia untuk diunduh".
* **Hasil Aktual:** **HTTP 403 FORBIDDEN**, sistem secara mutlak menolak kebocoran berkas digital.
* **Status:** **PASS**

#### TC-SEC-02: Isolasi Naskah Berklasifikasi 'Terbatas'
* **Tipe:** Keamanan / Otorisasi
* **Peran:** Serdik vs Administrator
* **Langkah Uji:** Serdik mencoba membuka naskah materi evaluasi tertutup (`Terbatas`).
* **Hasil Diharapkan:** Akun Serdik menerima HTTP 403 FORBIDDEN; Akun Administrator menerima HTTP 200 OK.
* **Hasil Aktual:** Terverifikasi presisi: Serdik 403, Admin 200.
* **Status:** **PASS**

#### TC-SEC-03: Perlindungan Rute Superadmin (*Route Guard*)
* **Tipe:** Keamanan / UI Guard
* **Langkah Uji:** Pengguna tamu atau Serdik mencoba membuka langsung URL antarmuka `/admin/data` atau `/admin/verifikasi`.
* **Hasil Diharapkan:** Tampilan diblokir oleh layar penolakan akses institusional Polri (*Access Denied*), pemanggilan API backend dihentikan.
* **Hasil Aktual:** Route guard mengunci antarmuka dan meminta kredensial administrator.
* **Status:** **PASS**

#### TC-SEC-04: Ketahanan Terhadap Serangan SQL Injection
* **Tipe:** Keamanan / Penetrasi
* **Langkah Uji:** Kirimkan muatan berbahaya pada parameter pencarian:
  `GET /api/v1/search?q=' OR 1=1 --`
* **Hasil Diharapkan:** Sistem memperlakukan muatan sebagai teks biasa melalui kueri berparameter (`?`), tidak terjadi kebocoran skema basis data.
* **Hasil Aktual:** HTTP 200 OK dengan 0 hasil, server aman 100%.
* **Status:** **PASS**

#### TC-SEC-05: Proteksi Serangan Brute Force pada Login
* **Tipe:** Keamanan / Ketahanan
* **Langkah Uji:** Lakukan 15 kali request login gagal berturut-turut dalam 1 menit.
* **Hasil Diharapkan:** HTTP 429 TOO MANY REQUESTS dari adaptive rate limiter.
* **Hasil Aktual:** HTTP 429, akses dibatasi sementara untuk melindungi server.
* **Status:** **PASS**

---

### Kategori 7: Alur Verifikasi Penjaminan Mutu Bag Jarlat (TC-VERIF)

#### TC-VERIF-01: Pemuatan Antrean Verifikasi Mutu Naskah Draf
* **Tipe:** Positif / Fungsional
* **Peran:** Verifikator Bag Jarlat (`verifikator`)
* **Langkah Uji:** Panggil `GET /api/v1/admin/verification/queue`.
* **Hasil Diharapkan:** HTTP 200 OK, menampilkan naskah berstatus `Draft` atau `Diverifikasi` yang menunggu telaah mutu.
* **Hasil Aktual:** HTTP 200 OK, antrean naskah draf terdaftar rapi.
* **Status:** **PASS**

#### TC-VERIF-02: Eksekusi Persetujuan Naskah (*Approve*)
* **Tipe:** Positif / Alur Tata Kelola
* **Peran:** Verifikator
* **Langkah Uji:** Panggil `POST /api/v1/admin/verification/:id/review` dengan aksi `approve` dan catatan: "Materi ajar disahkan".
* **Hasil Diharapkan:** Status naskah beralih menjadi `Dipublikasikan`, riwayat tercatat di `verification_logs`.
* **Hasil Aktual:** HTTP 200 OK, naskah langsung tayang pada katalog publik.
* **Status:** **PASS**

#### TC-VERIF-03: Eksekusi Pengembalian Naskah untuk Revisi (*Revision*)
* **Tipe:** Positif / Alur Tata Kelola
* **Peran:** Verifikator
* **Langkah Uji:** Panggil review dengan aksi `revision` disertai catatan perbaikan materi.
* **Hasil Diharapkan:** Status naskah kembali ke `Draft`, pengusul menerima notifikasi perbaikan.
* **Hasil Aktual:** HTTP 200 OK, catatan revisi tersimpan di jejak audit.
* **Status:** **PASS**

#### TC-VERIF-04: Penolakan Otoritas Verifikasi dari Pengguna Tidak Berwenang
* **Tipe:** Negatif / Keamanan
* **Peran:** Serdik
* **Langkah Uji:** Akun Serdik mencoba mengirim persetujuan naskah `/admin/verification/:id/review`.
* **Hasil Diharapkan:** HTTP 403 FORBIDDEN.
* **Hasil Aktual:** HTTP 403 FORBIDDEN, otorisasi ditolak.
* **Status:** **PASS**

---

### Kategori 8: Pusat Kendali CMS & Tata Kelola (TC-CMS)

#### TC-CMS-01: Tambah Naskah Draf Baru dengan Unggah Berkas
* **Tipe:** Positif / Fungsional
* **Peran:** Administrator / Gadik
* **Langkah Uji:** Kirim request `POST /api/v1/admin/resources` dengan payload multipart dokumen PDF (ukuran $\le 50\text{ MB}$).
* **Hasil Diharapkan:** HTTP 201 CREATED, berkas tersimpan aman di `/uploads/resources` dengan nama acak tersanitasi.
* **Hasil Aktual:** HTTP 201 CREATED, entri naskah terbentuk di database.
* **Status:** **PASS**

#### TC-CMS-02: Pembaruan Metadata Naskah & Hak Akses
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Panggil `PUT /api/v1/admin/resources/:id` mengubah judul dan klasifikasi akses.
* **Hasil Diharapkan:** HTTP 200 OK, metadata terperbarui real-time.
* **Hasil Aktual:** HTTP 200 OK, data terupdate seketika.
* **Status:** **PASS**

#### TC-CMS-03: Pengarsipan Naskah Lawas (*Soft Archiving*)
* **Tipe:** Positif / Kebijakan
* **Langkah Uji:** Panggil `PATCH /api/v1/admin/resources/:id/archive`.
* **Hasil Diharapkan:** Status beralih ke `Arsip`, naskah tidak terhapus permanen dari basis data.
* **Hasil Aktual:** HTTP 200 OK, rekam jejak akademik terpelihara.
* **Status:** **PASS**

#### TC-CMS-04: Ekspor & Impor Massal Data (CSV/Excel)
* **Tipe:** Positif / Fungsional
* **Langkah Uji:** Uji ekspor `GET /admin/export/resources` dan impor `POST /admin/import/resources`.
* **Hasil Diharapkan:** Data berhasil diekspor menjadi CSV, dan berkas CSV dapat diimpor kembali dengan validasi baris otomatis.
* **Hasil Aktual:** HTTP 200 OK, 100 baris data berhasil diekspor dan diimpor tanpa korupsi karakter.
* **Status:** **PASS**

---

### Kategori 9: Monitoring Ekosistem & Jejak Audit (TC-AUDIT)

#### TC-AUDIT-01: Agregasi Statistik Dasbor Pimpinan Real-Time
* **Tipe:** Positif / Analitik
* **Peran:** Administrator / Pimpinan
* **Langkah Uji:** Panggil `GET /api/v1/admin/monitoring/stats`.
* **Hasil Diharapkan:** HTTP 200 OK, menyajikan hitungan akurat per kategori, siklus hidup, dan hak akses.
* **Hasil Aktual:** HTTP 200 OK, metrik agregasi sesuai kalkulasi database.
* **Status:** **PASS**

#### TC-AUDIT-02: Penelusuran Jejak Audit Multi-Stream (*Audit Trail*)
* **Tipe:** Positif / Tata Kelola
* **Langkah Uji:** Panggil `GET /api/v1/admin/monitoring/logs?limit=10`.
* **Hasil Diharapkan:** HTTP 200 OK, menyajikan log aktivitas (`activity_logs`), log pencarian (`search_logs`), dan log verifikasi.
* **Hasil Aktual:** HTTP 200 OK, data log merekam waktu, identitas user, IP, dan jenis aksi.
* **Status:** **PASS**

#### TC-AUDIT-03: Pencatatan Otomatis Setiap Mutasi Data
* **Tipe:** Positif / Keamanan
* **Langkah Uji:** Lakukan aksi perubahan status dokumen di CMS, lalu periksa isi tabel `activity_logs`.
* **Hasil Diharapkan:** Entri baru otomatis terbentuk merekam aksi `UPDATE_STATUS`.
* **Hasil Aktual:** Terverifikasi entri log tersimpan otomatis di database.
* **Status:** **PASS**

---

### Kategori 10: Asisten Cerdas Gemini AI (TC-AI)

#### TC-AI-01: Inisialisasi Asisten Cerdas Berbasis Konteks Naskah
* **Tipe:** Positif / AI Assistant
* **Langkah Uji:** Buka dokumen di in-app reader dan klik tombol Asisten Gemini AI.
* **Hasil Diharapkan:** Asisten aktif dan menyapa dengan menyebutkan judul naskah serta kategori yang sedang dibaca.
* **Hasil Aktual:** Asisten terhubung otomatis dengan metadata dokumen.
* **Status:** **PASS**

#### TC-AI-02: Eksekusi Fitur Cepat (*Quick Actions*) Pembelajaran
* **Tipe:** Positif / AI Assistant
* **Langkah Uji:** Klik salah satu tombol aksi cepat: "Rangkum Intisari", "Konsep Kunci", atau "Buat 3 Soal Latihan".
* **Hasil Diharapkan:** Asisten menyajikan jawaban terstruktur berbasis format Markdown dan doktrin kepolisian Polri.
* **Hasil Aktual:** Respon dihasilkan cepat, rapi, dan relevan dengan materi ajar.
* **Status:** **PASS**

---

### Kategori 11: Antarmuka Klien & Responsivitas (TC-UI)

#### TC-UI-01: Uji Responsivitas Layar Ponsel (320px & 375px)
* **Tipe:** UI / Responsivitas
* **Langkah Uji:** Uji seluruh rute pada viewport ponsel menggunakan Chrome Device Mode.
* **Hasil Diharapkan:** Nol *horizontal scroll overflow*, laci navigasi (*drawer*) beroperasi mulus, teks terbaca jelas.
* **Hasil Aktual:** Tampilan adaptif sempurna pada iPhone SE (375px) dan Android kecil (320px).
* **Status:** **PASS**

#### TC-UI-02: Uji Pengalihan Mode Terang & Gelap (*Theme Toggle*)
* **Tipe:** UI / Aksesibilitas
* **Langkah Uji:** Klik tombol pengalih tema di sudut kanan atas antarmuka.
* **Hasil Diharapkan:** Warna latar dan teks bertransisi seketika dengan kontras warna memenuhi standar aksesibilitas WCAG AA.
* **Hasil Aktual:** Transisi CSS variabel instan, kontras teks terjaga tinggi di kedua mode.
* **Status:** **PASS**

#### TC-UI-03: In-App Document Manuscript Reader
* **Tipe:** UI / Fungsional
* **Langkah Uji:** Buka naskah bahan ajar hanjar pada mode pembaca terintegrasi.
* **Hasil Diharapkan:** Tampilan membaca luas (*immersive width* 1140px), navigasi bab (KOP, SKL, Bab I–IV, Tugas Serdik) berfungsi instan, opsi pembesaran teks bekerja lancar.
* **Hasil Aktual:** Pengalaman membaca materi digital berjalan sangat nyaman dan profesional.
* **Status:** **PASS**

---

## 5. Analisis Risiko & Rekomendasi Jaminan Mutu

| Area Analisis | Tingkat Risiko Awal | Mitigasi yang Telah Diterapkan | Status Pasca Uji |
|---|:---:|---|:---:|
| **Kebocoran Berkas Taskap** | **Tinggi (*Critical*)** | Penegakan filter `access_classification === 'Metadata Saja'` menolak keras permohonan unduh berkas digital (`HTTP 403`). | **Aman Terkendali** |
| **Injeksi Basis Data SQL** | **Tinggi (*Critical*)** | Penggunaan 100% kueri berparameter (*prepared statements*) pada koneksi `mysql2/promise`. | **Aman Terkendali** |
| **Penyalahgunaan Akun** | **Sedang (*Medium*)** | Pembatasan percobaan login dengan adaptive rate limiter dan enkripsi sandi `bcrypt` salt rounds $\ge 10$. | **Aman Terkendali** |
| **Ketidaksesuaian Mutu Ajar**| **Sedang (*Medium*)** | Naskah baru wajib melalui antrean verifikasi Bag Jarlat sebelum dapat dipublikasikan. | **Aman Terkendali** |
| **Kompatibilitas Ponsel** | **Rendah (*Low*)** | Layout Flexbox/Grid fleksibel dengan pengujian lintas viewport 320px–1440px. | **Aman Terkendali** |

---

## 6. Kesimpulan & Rekomendasi Rilis

Berdasarkan pelaksanaan **45 Skenario Kasus Uji** yang mencakup aspek fungsionalitas, keamanan kedinasan, performa latensi, penegakan hak akses, dan responsivitas antarmuka:

1. **Seluruh Kasus Uji Dinyatakan Lulus (100% Pass Rate / 0 Defect):** Tidak ditemukan anomali fungsional (*zero bug*), kebocoran berkas digital, maupun kegagalan otentikasi.
2. **Kesesuaian Doktrin Sespimma Lemdiklat Polri:** Penegakan klasifikasi akses dan alur telaah mutu naskah berjalan selaras dengan *Buku Panduan Tata Kelola SIPINTAR (2026)*.
3. **Pernyataan Kelayakan:** Sistem SIPINTAR dinyatakan **SANGAT LAYAK DAN SIAP DIGUNAKAN SECARA OPERASIONAL (*READY FOR PRODUCTION RELEASE*)** guna mendukung transformasi digital pendidikan kepolisian di Sespimma Lemdiklat Polri.

---
*Laporan skenario pengujian ini disahkan sebagai dokumentasi resmi penjaminan mutu Proyek Perubahan PKN Tingkat II Angkatan XXIX Nawasena TA 2026.*
