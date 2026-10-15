# SiPINTAR — Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif

> **Tagline:** *"Mengintegrasikan Pengetahuan, Mengaselerasikan Kepemimpinan"*  
> **Inisiator / Project Leader:** DEWI SUSILO PANGESTUTI, S.Ak — PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026

Prototipe antarmuka frontend resmi untuk **SiPINTAR** (*Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif*) di lingkungan **Sespimma Sespim Lemdiklat Polri**, dibangun berdasarkan *Buku Panduan Tata Kelola SiPINTAR* dan *Manual Book SiPINTAR (2026)*.

---

## 1. Karakteristik & Batasan Prototipe (Non-Negotiable)

- **Frontend First**: Dibangun menggunakan Next.js App Router dan TypeScript tanpa dependensi berlebih.
- **Mock Data Lokal**: Menggunakan data fiktif bertipe pada modul `src/data/mockData.ts`.
- **Tanpa Backend Aktif**: Tidak terhubung ke database produksi, REST API, sistem otentikasi nyata, maupun penyimpanan berkas eksternal sampai ada persetujuan eksplisit.
- **Pembedaan Berkas Digital**: Dokumen fisik perpustakaan dan Taskap kepolisian dipisahkan dengan jelas dari berkas digital dan tidak menyediakan tautan unduh palsu.
- **Aksesibilitas & Tema**: Mendukung Mode Terang (Light) dan Gelap (Dark) dengan CSS variable tokens berstandar institusional.

---

## 2. Struktur Proyek

```
SIPINTAR/
├── docs/                      # Dokumen Source of Truth (PRD, UI Guidelines, Userflow, API Specs, Implementation)
├── public/                    # Aset statis & favicon
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/
│   │   │   ├── akses/         # Matriks Hak Akses Peran Pengguna
│   │   │   ├── data/          # Manajemen Data (Entri Draf & Arsip Mock)
│   │   │   ├── monitoring/    # Monitoring Retensi & Log Aktivitas
│   │   │   └── verifikasi/    # Antrean Verifikasi & Validasi
│   │   ├── gadik/             # Kategori: Gadik & Kompetensi
│   │   ├── kurikulum/         # Kategori: Kurikulum & Standar Layanan
│   │   ├── library/           # Kategori: E-Library / Perpustakaan & Taskap
│   │   ├── manual/            # Kategori: Manual Book SIPINTAR
│   │   ├── modul/             # Kategori: Modul & Hanjar
│   │   ├── pedoman/           # Kategori: Pedoman Akademik & Juknis
│   │   ├── search/            # Pencarian Terpadu (Unified Search)
│   │   ├── sop/               # Kategori: Standar Operasional Prosedur
│   │   ├── error.tsx          # Error Boundary
│   │   ├── globals.css        # Desain Sistem & Variabel CSS
│   │   ├── layout.tsx         # Root Layout & Metadata
│   │   ├── not-found.tsx      # Tampilan 404 Kustom Institusi
│   │   └── page.tsx           # Beranda Dashboard Utama
│   ├── components/            # Komponen Primitif & UI
│   │   ├── AdminActionModal.tsx   # Modal Interaktif Alur Administrator
│   │   ├── AppShell.tsx           # Shell Aplikasi (Header, Sidebar, Mobile Drawer)
│   │   ├── BrandLogo.tsx          # Lambang Perisai Institusional SIPINTAR
│   │   ├── CategoryView.tsx       # Tampilan Serbaguna Direktori Kategori
│   │   ├── ResourceCard.tsx       # Kartu Sumber Belajar & Indikator Berkas
│   │   ├── ResourceDetailModal.tsx# Modal Rincian Metadata & Akses
│   │   ├── SearchBar.tsx          # Bilah Input Pencarian Cerdas
│   │   ├── StatusBadge.tsx        # Lencana Siklus & Klasifikasi Akses
│   │   └── ThemeToggle.tsx        # Tombol Alih Mode Terang / Gelap
│   ├── data/
│   │   └── mockData.ts        # Kumpulan Mock Data Terpadu
│   └── types/
│       └── index.ts           # Definisi Tipe Domain SIPINTAR
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Cara Menjalankan Proyek Secara Lokal

Pastikan Node.js (>= 20) dan npm telah terpasang di komputer Anda.

### Menjalankan Development Server:
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

### Menjalankan Pemeriksaan Lint:
```bash
npm run lint
```

### Menguji Build Produksi:
```bash
npm run build
npm run start
```

---

## 4. Taksonomi Menu & Peran Pengguna

### Menu Utama:
1. **Beranda**: Ringkasan metrik institusi, kartu kategori, pintasan admin, dan koleksi terkini.
2. **Gadik & Kompetensi**: Profil tenaga pendidik, rekam jejak, dan keahlian spesifik.
3. **Modul & Hanjar**: Bahan ajar pokok, slide materi, dan panduan belajar.
4. **E-Library/Perpustakaan**: Buku teks fisik, e-book, dan naskah Taskap.
5. **Kurikulum & Standar Layanan**: Silabus, penjaminan mutu, dan SPM.
6. **SOP**: Prosedur operasional tetap kegiatan diklat dan sarpras.
7. **Pedoman**: Juknis penulisan Taskap dan kode etik akademik.
8. **Manual Book**: Panduan operasional sistem bagi seluruh pengguna.
9. **Pencarian Terpadu**: Eksplorasi multi-filter lintas kategori.

### Fungsi Administrator:
- **Manajemen Data**: Tambah data draf baru dan pengarsipan lokal.
- **Verifikasi**: Alur otorisasi dan penerbitan naskah usulan.
- **Hak Akses**: Matriks kewenangan 4 peran (*Serdik, Gadik, Pengelola, Administrator*).
- **Monitoring**: Pengawasan masa berlaku naskah dan log aktivitas akses.
