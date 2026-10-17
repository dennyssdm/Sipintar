# SIPINTAR — Implementation Plan and Phase Tracker

**Status:** Phase 3 approved; Phase 4 (Frontend hardening and handover) completed, awaiting final frontend release approval.  
**Rule:** The user reviews and approves each phase before the next phase begins. Keep this checklist current.

## Status legend

- `[ ] NOT STARTED` — not yet performed.
- `[~] IN PROGRESS` — work underway.
- `[x] DONE` — completed by implementer.
- `[A] APPROVED` — explicitly approved by user.
- `[B] BLOCKED` — waiting for a decision/dependency.

Do not mark a phase `[A] APPROVED` unless the user explicitly approves it.

## Phase 0 — Source review and SOT definition

- [x] Reviewed supplied dashboard reference image.
- [x] Reviewed *Buku Panduan Tata Kelola SIPINTAR* (2026).
- [x] Reviewed *Manual Book SIPINTAR* (2026).
- [x] Extracted menu taxonomy, user groups, lifecycle statuses, access classifications, and governance principles.
- [x] Recorded source gaps and assumptions.
- [x] [A] User approves this SOT bundle and scope. (Approved by user on 2026-10-14)

**Exit criteria:** PRD, UI guidelines, user flows, future API boundary, and phase tracker reviewed. Approved.

## Phase 1 — Frontend foundation

- [x] Confirmed Next.js version (16.4.0 App Router) and package manager (npm 11.16.0, Node v24.18.0).
- [x] Initialized project with TypeScript and minimal dependencies (zero database/backend).
- [x] Established CSS variables/design tokens for light/dark themes in `globals.css`.
- [x] Built semantic responsive app shell: header, navigation, main content, and mobile drawer.
- [x] Created typed local mock-data module (`src/types/index.ts`, `src/data/mockData.ts`).
- [x] Added reusable primitives: `StatusBadge`, `ThemeToggle`, `SearchBar`, `ResourceCard`, `AppShell`.
- [x] Ran lint (`npm run lint`), type checks, and build (`npm run build`) — all passed with 0 errors. Verified responsive and dark mode via browser testing.
- [x] [A] User approves foundation. (Approved by user on 2026-10-14)

**Exit criteria:** app runs locally, route shell is responsive, no backend exists. Approved.

## Phase 2 — Dashboard visual implementation

- [x] Built brand/header treatment with institutional emblem and SIPINTAR lockup.
- [x] Built desktop sidebar and mobile drawer with accessible Escape key and backdrop overlay.
- [x] Built welcome/hero panel with Sespimma institutional context and metrics preview.
- [x] Built category cards for all 8 official taxonomy categories.
- [x] Built recent resource panels, interactive filter tabs, and real-time unified search preview.
- [x] Built administrator shortcut area with interactive workflow simulation modal (`AdminActionModal`).
- [x] Added light/dark mode toggle with accessible contrast and instant CSS token switching.
- [x] Reviewed and tested across 320px, 375px, 768px, 1024px, and 1440px with zero horizontal scroll overflow.
- [x] [A] User approves dashboard visual direction. (Approved by user on 2026-10-14)

**Exit criteria:** dashboard visual structure accepted on desktop and mobile. Approved.

## Phase 3 — Frontend prototype interactions

- [x] Search and category filters work with mock data across all 8 taxonomy categories and multi-criteria filters.
- [x] Category navigation and resource details work (`/gadik`, `/modul`, `/library`, `/kurikulum`, `/sop`, `/pedoman`, `/manual`, `/search`).
- [x] Empty/no-results states work with feedback and reset button.
- [x] Access and verification labels display accurately with text and icons.
- [x] Digital asset availability is represented separately from metadata (Taskap & physical books show reading room location without fake download).
- [x] Admin prototype actions use local state only and show a demo/prototype notice (`/admin/data`, `/admin/verifikasi`, `/admin/akses`, `/admin/monitoring`).
- [x] Accessibility and keyboard review (Escape to close modals/drawer, aria labels, focus ring).
- [x] [A] User approves frontend behavior. (Approved by user on 2026-10-14)

**Exit criteria:** no core dashboard interaction requires a backend; limitations are clear. Approved.

## Phase 4 — Frontend hardening and handover

- [x] Responsive and cross-browser review (tested on 320px, 375px, 768px, 1024px, 1440px with zero horizontal overflow).
- [x] Checked theme contrast, accessible colors, and visible focus rings (`:focus-visible`) across light and dark modes.
- [x] Checked loading, empty states (Search & Category), custom 404 page (`src/app/not-found.tsx`), and error boundary (`src/app/error.tsx`).
- [x] Ran lint (`npm run lint`), type check, and production build (`npm run build`) — 0 errors, 16 static routes prerendered.
- [x] Documented run commands and project file structure in `README.md`.
- [x] Listed known limitations and deferred decisions (all interactions use local mock state; backend deferred).
- [ ] [A] User approves frontend release.

**Exit criteria:** frontend prototype is accepted and ready for separate backend planning.

## Phase 5 — Backend discovery (NOT AUTHORIZED YET)

- [ ] [B] Explicit user authorization to begin backend planning.
- [ ] Confirm roles and permission matrix.
- [ ] Confirm data ownership, metadata fields, and retention.
- [ ] Confirm authentication/session approach.
- [ ] Confirm database and file storage requirements.
- [ ] Confirm API contract, validation, errors, audit requirements.
- [ ] Security/privacy review.
- [ ] [A] User approves backend architecture before implementation.

## Phase 6 — REST API/database implementation (NOT AUTHORIZED YET)

- [ ] [B] Explicit approval of Phase 5 design.
- [ ] Implement database migrations and seed strategy.
- [ ] Implement server-side authorization and validation.
- [ ] Implement API contract and automated tests.
- [ ] Connect frontend to API through a documented service layer.
- [ ] Security, integration, and deployment tests.
- [ ] [A] User approves release.

## Decision log

| ID | Decision | Current value | Status |
|---|---|---|---|
| D-01 | Product name & acronym | SiPINTAR: Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif | User-confirmed |
| D-02 | Frontend framework | Next.js | User-directed |
| D-03 | Styling | Responsive HTML/CSS; minimal dependencies | Proposed |
| D-04 | First release | Frontend prototype with mock data only | User-directed |
| D-05 | Backend/API | Deferred until explicit approval | User-directed |
| D-06 | Theme | Blue/white, light and dark | User-directed |
| D-07 | Auth in prototype | Demo-only; no real credentials | Safety/architecture decision |
| D-08 | Brand logo asset | Official SiPINTAR logo converted to WebP (/logo-sipintar.webp) | Approved & Integrated |
| D-09 | Final permissions | Not defined by source; owner confirmation required | Pending |
| D-10 | Official tagline | Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan | User-confirmed |
| D-11 | Footer attribution | DEWI SUSILO PANGESTUTI, S.Ak - PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026 | User-confirmed |
| D-12 | Institutional Hero System | Rich hero with dual-column layout, gold accents, in-hero search, command deck & 4 pillars | User-directed |
| D-13 | Visual Illustration & Cross-Menu Hero | Realistic Sespimma Lemdiklat Polri building (/hero-sespimma-campus.webp) and student learning atmosphere (/hero-sespimma-learning.webp) with interactive switcher, applied across Beranda, Modul, Library, Kurikulum, SOP, Pedoman, Manual, and Pencarian Terpadu via PageHeroHeader | User-directed & Completed |
| D-14 | Kurikulum & Berkas Asli Hanjar Sespimma 2025 | Integrasi 14 berkas PDF Hanjar Resmi Sespimma TA 2025 dengan pratinjau interaktif tersemat dan katalog komprehensif 78 berkas modul & hanjar | User-directed & Completed |
| D-15 | Pratinjau Dokumen pada Setiap Hanjar | Penambahan visual cover preview banner pada kartu materi, tombol aksi Pratinjau Dokumen, pembaca PDF interaktif untuk naskah asli, dan simulator digital manuscript reader lengkap untuk seluruh hanjar kurikulum | User-directed & Completed |
| D-16 | Dedicated Document Reading Preview (Mode Pratinjau Membaca Dokumen) | Penataan ulang modal pembaca dokumen dengan mode membaca imersif (lebar 1140px/95vw), tab switcher terdedikasi (Pratinjau Membaca Dokumen vs Rincian Metadata & Status), layout pembaca digital 2 kolom dengan navigasi bab lengkap (Kop, SKL, Bab I-IV, Tugas Serdik), dan tombol aksi "Baca Dokumen" pada seluruh kartu katalog | User-directed & Completed |
| D-17 | Struktur & Data Nominatif Gadik Sespimma (Oktober 2026) | Integrasi 16 personel Polri (Fungsional) & Tenaga Pendidik Sespimma berdasarkan berkas kedinasan resmi (@NOMINATIF POLRI (FUNGSIONAL) BLN OKTOBER 2026 .pdf), dashboard rekapitulasi kepangkatan (Kombes Pol: 6, AKBP: 6, Kompol: 3, Iptu: 1), pengesahan PS Kasubbag Renmin Kompol Sunu Prihandoyo, S.T. (NRP. 82050054), mode tampilan ganda (Tabel Kedinasan & Kartu Profil), serta pratinjau naskah PDF tersemat | User-directed & Completed |
| D-18 | E-Library Schema & Sample Preview (@struktur buku.docx) | Implementasi arsitektur pustaka digital terpadu sesuai skema Tabel books (Metadata Deskriptif dengan kolom synopsis) dan Tabel book_files (Metadata Teknis dengan pemisahan preview_file_path untuk sampel pratinjau publik 10-25 halaman pertama dan file_path utuh), tampilan ganda (Katalog Rak Buku Digital & Tabel Bibliografi), serta penampil pratinjau PDF interaktif langsung di halaman perpustakaan | User-directed & Completed |
| D-19 | Pewarnaan Gradien Header Institusional Sesuai Tone (Semua Menu & Admin) | Pembaruan seluruh header halaman (Modul & Hanjar, Gadik, E-Library, Kurikulum, SOP, Pedoman, Manual Book, Pencarian Terpadu, Pusat Kendali Admin) dengan gradien warna biru kepolisian Lemdiklat Polri (deep navy `#071731` - `#174f9c` - `#1557b7`), aksen badge glow, kontras teks putih/slate tinggi, dan accent border pada top navigation bar | User-directed & Completed |
| D-20 | Fitur Registrasi Anggota Baru Berdasarkan Peran (Serdik, Gadik, Pengelola Perpustakaan) | Penambahan tombol aksi `+ Daftar` pada header peran, opsi di dropdown peran, tombol pendaftaran di sidebar profil, serta modal interaktif pendaftaran (`RoleRegistrationModal.tsx`) dengan isian identitas kedinasan Polri (Nama, Pangkat, NRP, Satker) dan atribut peran khusus (NOSIS/Angkatan/Taskap untuk Serdik, Jabatan Fungsional/Sprint/Kepakaran untuk Gadik, Unit Kerja/Wewenang untuk Pengelola Pustaka), nomor registrasi resmi otomatis, serta aktivasi langsung sesi peran pada prototipe | User-directed & Completed |
| D-21 | Highlight Warna Sesuai Tone pada Judul SUMBER BELAJAR dan FUNGSI ADMINISTRATOR | Penataan ulang judul seksi navigasi bilah samping (sidebar) dan judul halaman utama dengan *eye-catching highlighted ribbons*: **SUMBER BELAJAR** (warna biru kepolisian `#1d4ed8`, gradien ribbon cyan, ikon buku, border kiri tegas) dan **FUNGSI ADMINISTRATOR** (warna emas komando `#b45309`, gradien ribbon amber, ikon perisai tata kelola, border kiri tegas emas), lengkap dengan adaptasi mode gelap (*dark mode*) | User-directed & Completed |
| D-22 | Arsitektur Bilah Sisi Tetap & Mantap (Permanently Steady Fixed Sidebar) | Penataan ulang CSS layout sidebar (`.app-sidebar`) menjadi `position: fixed; top: 0; left: 0; bottom: 0; height: 100vh; overflow-y: auto;` dengan offset desktop `margin-left: var(--sidebar-width)` pada `.app-main`, pemindahan `.demo-banner` ke dalam `.app-main` agar sidebar duduk rata sempurna di puncak layar, serta scrollbar mandiri halus (*independent scroll*) sehingga menu samping tidak bergeser satu piksel pun saat konten utama digulir | User-directed & Completed |
| D-23 | Optimalisasi Penuh Tampilan Responsif Ponsel & Layar Sentuh (Mobile Viewport) | Penyesuaian komprehensif breakpoint `@media (max-width: 768px)` dan `(max-width: 480px)` pada seluruh antarmuka: perampingan bar atas (`.app-header`), penyembunyian bilah pencarian header yang redundant pada ponsel, penataan tombol peran & registrasi secara ringkas, penataan ulang kisi kartu (*single column 1fr*), pembungkus bilah filter berscroll horizontal ramah sentuhan, perampingan padding hero, eliminasi potensi *horizontal page overflow*, serta pengoperasian *drawer* bilah sisi menu yang mulus | User-directed & Completed |
| D-24 | Redesain Hero Beranda: Eliminasi Logo Crowded & Tipografi Modern Luas | Penataan ulang area Hero/Header Beranda (`HeroSection.tsx`) dengan mengeliminasi kotak logo putih besar (`Logo Sipintar OK.webp`) yang padat dan sesak, beralih ke tipografi identitas institusional yang elegan dan lega: pita akreditasi institusi (*Nawasena PKN II & Sespimma Lemdiklat Polri*), judul utama dengan gradien emas metalik (*SiPINTAR Sespimma*), badge kata kunci beraksen (*INovatif, Adaptif, Responsif*), motto institusional, bilah pencarian interaktif yang bersih dengan tag rekomendasi cepat, serta penyeimbangan ruang napas (*breathing space*) visual yang modern dan premium di desktop maupun ponsel | User-directed & Completed |
| D-25 | Beranda sebagai Portal Hub & Pusat Infografis (Eliminasi Duplikasi Konten Bacaan) | Rekonstruksi halaman Beranda (`src/app/page.tsx` & `src/components/HomeInfographics.tsx`): Menghilangkan tumpukan kartu daftar dokumen mentah yang menduplikasi menu khusus agar pengguna tidak bingung. Mentransformasikan Beranda menjadi Pusat Infografis Eksekutif yang memuat: (1) Siklus Terpadu 4 Fase Ekosistem Belajar Sespimma, (2) Statistik Kapasitas Pengetahuan Real-Time (78 Modul, 142 Pustaka, 28 Gadik, 720 JP), (3) Matriks Klasifikasi 4 Tingkat Hak Akses & Diagram Alur 5 Siklus Hidup Naskah, (4) Gerbang Pintu Masuk 8 Menu Kategori dengan tautan langsung ke halaman terkait, serta (5) Panduan Alur Akses Cepat Berdasarkan 4 Peran Pengguna (Serdik, Gadik, Pengelola Pustaka, Administrator) | User-directed & Completed |
| D-26 | Penghapusan Banner Demo Prototipe Frontend | Menghilangkan bilah teks banner atas (`.demo-banner` di `src/components/AppShell.tsx`: "PROTOTIPE FRONTEND, SIPINTAR Sespimma • Mode Demo Interaktif Lokal • Tidak terhubung ke database atau server langsung.") sehingga header bilah navigasi dan konten utama tampil lebih bersih, profesional, dan menyatu langsung ke batas atas layar | User-directed & Completed |
| D-27 | Penggantian Pusat Kendali Administrator dengan Dasbor Chart Analitik Ekosistem | Mengeliminasi seksi "Pusat Kendali Administrator" dari Beranda dan menggantikannya dengan komponen dasbor chart visual interaktif (`src/components/EcosystemChartSection.tsx`): (1) Donut ring chart SVG & progress bar untuk komposisi 316 berkas dalam 8 kategori taksonomi, (2) Diagram klasifikasi 142 koleksi perpustakaan & Taskap, (3) Bar chart rekapitulasi kepangkatan 16 personel Gadik fungsional Polri Sespimma (Kombes Pol, AKBP, Kompol, Iptu), serta (4) Segmented timeline chart alokasi 720 JP kurikulum Sespimma, lengkap dengan KPI ticker (316 Berkas, 720 JP, 100% Tervalidasi) | User-directed & Completed |
| D-28 | Redesain Format Chart Analitik: Eliminasi Pie Chart & Implementasi Segmented Ribbon Bar | Mengganti format grafik lingkaran/pie/donat yang memakan banyak ruang vertikal pada Tab Komposisi 8 Kategori menjadi format horizontal ringkas dan hemat ruang (*space-efficient*): (1) *Pita Distribusi Komposisi Repositori* (*full-width Segmented Ribbon Bar Gauge*) dengan chip legenda interaktif dan penyorotan hover, (2) Matriks Bar Terperingkat 2 Kolom (*Ranked Bar Matrix #1 s.d #7*) lengkap dengan lencana urutan, volume berkas, persentase, *progress bar*, dan tombol langsung `Buka Menu →`, serta (3) Banner wawasan analitik konsentrasi materi | User-directed & Completed |






## Change-control rule

When a requirement changes:
1. Record the decision and rationale.
2. Identify affected docs and UI.
3. Update status only for work actually completed.
4. Ask for approval at the current phase gate.
5. Do not silently advance to backend work.

## Current overall status

**Current phase:** Phase 4 — Frontend hardening and handover (Completed, awaiting final frontend release approval).  
**Waiting for:** User approval of completed Frontend Prototype Release.  
**Backend/database/REST API (Phase 5/6):** Not started and not authorized until separate approval.
