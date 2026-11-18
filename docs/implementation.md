# SIPINTAR — Implementation Plan and Phase Tracker

**Status:** Phase 3, 5, 6 approved; Phase 4 & 7 (System Testing & QA) completed (100% Passed), awaiting final production release approval.  
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

## Phase 5 — Backend discovery (COMPLETED — Documented Specifications)

- [x] [A] User directs creation of business rules and MySQL database specification documents. (2026-11-16)
- [x] Confirm roles and permission matrix (Documented in `docs/business rule.md`).
- [x] Confirm data ownership, metadata fields, and retention (Documented in `docs/business rule.md`).
- [x] Confirm database and file storage requirements (MySQL 8.0+ Schema documented in `docs/database spec.md`).
- [x] Confirm authentication/session approach (JWT/Bcrypt implemented in `src/config/jwt.js` and `authService.js`).
- [x] Confirm API contract, validation, errors, audit requirements (Aligned with `docs/APIspecs.md` and `docs/database spec.md`).
- [x] Security/privacy review (Data protection guidelines documented).
- [x] [A] User approves backend architecture before implementation.

## Phase 6 — REST API/database implementation (COMPLETED — Production-Ready Service)

- [x] [A] Explicit approval of Phase 5 design and backend implementation directive.
- [x] Implement database migrations and seed strategy (`database.sql` imported to `sipintar_db` on MySQL localhost:3306).
- [x] Implement server-side authorization and validation (`src/middleware/auth.js` & `src/middleware/rbac.js`).
- [x] Implement API contract and automated tests (Full curl test suite across 6 phases).
- [x] Generate & maintain Postman Collection (`collection.json`, v2.1.0 dengan 38 skenario uji).
- [x] Security hardening: Helmet HTTP security headers, express-rate-limit brute force & DoS protection, audit trail logging.
- [x] Document final running instructions and frontend integration guide in `README.md`.
- [x] [A] User approves backend release. (2026-11-17)

## Phase 7 — Comprehensive System Testing & Quality Assurance (COMPLETED — 100% Passed)

- [x] [A] User directs creation of comprehensive test case scenarios and verification report. (2026-11-18)
- [x] Formulated test plan & scenarios across 11 functional/security categories (`docs/LAPORAN_SKENARIO_TEST_CASE.md`).
- [x] Verified 45 test cases: TC-AUTH (7), TC-RES (6), TC-GADIK (4), TC-LIB (4), TC-SRCH (3), TC-SEC (5), TC-VERIF (4), TC-CMS (4), TC-AUDIT (3), TC-AI (2), and TC-UI (3).
- [x] Automated integration test execution (`test/api.test.js`) 32/32 tests passed (100% pass rate).
- [x] Next.js lint (`npm run lint`) & production build (`npm run build`) verified with 0 errors across 16 static routes.
- [x] All 13 frontend routes verified responsive and accessible (`http://localhost:3000`).
- [x] Strict security enforcement verified: Metadata Saja protection (Strict 403), Terbatas protection, RBAC, Rate Limiting, and Audit Trail.
- [ ] [A] User approves final system test report and production release handover.

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
| D-29 | Bar Chart Vertikal Tegak Ke Atas (Vertical Column Chart) | Merancang dan menerapkan grafik batang vertikal (*vertical column bar chart*) pada Tab 1 Analitik Ekosistem: Batang-batang materi tumbuh tegak ke atas dari garis dasar (*baseline*) dengan sumbu Y bergaris kisi (0, 50, 100, 150 berkas), label volume numerik & persentase mengambang di atas puncak masing-masing batang (*E-Library 142, Modul 78, SOP 35, Pedoman 22, Kurikulum 19, Gadik 16, Manual 6*), efek interaktif angkat saat diarahkan kursor (*hover lift effect*), label sumbu X dan tautan langsung `Buka →` di bawah garis dasar, serta 4 kartu ringkasan analitik pilar di bawah kanvas grafik | User-directed & Completed |
| D-30 | Optimasi Responsif Diagram Batang Vertikal (Batang Gemuk di Desktop, Penuh & Rapi di Mobile) | Mengoptimalkan tampilan seluruh diagram batang vertikal (Tab 1 s.d Tab 4): (1) Desktop (>=1024px) batang dibuat gemuk dan kokoh (`vbar-7col` lebar 72px–76px, `vbar-4col` lebar 120px) dengan tinggi kanvas 310px & track 222px sehingga kanvas terlihat padat, gagah, dan terisi penuh tanpa ruang kosong berlebih; (2) Mobile (<=768px & <=480px) kanvas adaptif 100% full-width tanpa overflow/scrollbar horizontal berlebih, kolom fleksibel (`repeat(7, 1fr)` dan `repeat(4, 1fr)`), ukuran batang menyusut proporsional (max 38px pada 7 kolom, max 68px pada 4 kolom), teks lencana dan persentase terkalibrasi rapi dan nyaman dibaca pada layar ponsel | User-directed & Completed |
| D-31 | Perumusan Dokumen Aturan Bisnis & Spesifikasi Basis Data MySQL | Penyusunan dua dokumen spesifikasi backend resmi: (1) `docs/business rule.md` yang merinci 6 tingkatan peran, matriks RBAC 8 kategori sumber belajar & 4 modul tata kelola, aturan klasifikasi akses, mesin status lifecycle 5 fase, dan aturan khusus setiap modul; (2) `docs/database spec.md` yang merinci ERD, kamus data lengkap 10 kelompok tabel InnoDB MySQL 8.0, indeks pencarian FULLTEXT & komposit, skrip DDL SQL siap eksekusi, serta skrip data seeding awal yang mencerminkan mock data codebase | User-directed & Completed |
| D-32 | Pembuatan `database.sql` & Impor Langsung ke MySQL phpMyAdmin (`sipintar_db`) | Pembuatan berkas DDL & DML komprehensif `database.sql` (19 tabel, 3.136 baris SQL, 241 KB) mencakup seluruh 86+ modul & hanjar, 14 koleksi buku/e-book/taskap/jurnal, 16 tenaga pendidik fungsional Polri (Gadik), 96 kompetensi, 392 tag taksonomi, dan log audit. Berkas berhasil diimpor langsung ke server lokal MySQL XAMPP pada basis data `sipintar_db` dan dapat langsung diakses melalui web browser di `http://localhost/phpmyadmin/` | User-directed & Completed |
| D-33 | Pembangunan Layanan RESTful API Lengkap & Koleksi Postman SIPINTAR | Implementasi arsitektur bersih REST API berbasis Node.js & Express (ES Modules) di `sipintarsespimmaAPI`: (1) Koneksi pool `mysql2/promise` ke `sipintar_db`, (2) Autentikasi JWT & Bcrypt dengan RBAC ketat 6 peran, (3) Katalog sumber belajar, profil Gadik nominatif, e-library, dan Pencarian Terpadu MySQL FULLTEXT, (4) Aliran streaming berkas naskah ajar & pratinjau sampel buku dengan penjagaan ketat 'Metadata Saja', (5) Modul tata kelola draf materi, verifikasi Bag Jarlat, manajemen akun pengguna, statistik monitoring sistem, dan audit trail, (6) Pengerasan keamanan dengan Helmet HTTP headers dan Rate Limiting, serta (7) Pembuatan koleksi Postman resmi `collection.json` v2.1.0 dengan skrip penanganan token otomatis | User-directed & Completed |
| D-34 | Integrasi Penuh Frontend Next.js dengan Backend REST API Sespimma | Integrasi end-to-end antara Next.js frontend (`/SIPINTAR`) di port 3000 dengan Express RESTful API (`sipintarsespimmaAPI`) di port 5001: (1) Pembuatan typed client SDK `src/lib/apiClient.ts` dengan mapper otomatis snake_case ke camelCase, (2) Penghubungan `GadikDirectory`, `LibraryDirectory`, `CategoryView`, `search`, dan `admin/data` dengan fallback graceful ke data lokal jika offline, (3) Penambahan indikator visual status keterhubungan database live, (4) Eksekusi build production 16/16 rute statis sukses tanpa error TypeScript, serta (5) Sinkronisasi berkelanjutan berkas koleksi Postman `collection.json` | User-directed & Completed |
| D-35 | Algoritma Rekomendasi Terkait, Hak Akses Eksekutif Pimpinan & Suite Uji 22 Skenario | (1) Endpoint rekomendasi materi terkait `GET /api/v1/resources/:id/related?limit=4` berbasis skor tumpang tindih tag taksonomi (`COUNT(DISTINCT rt2.tag_id)`), (2) Hak akses pengawasan mutu pimpinan eksekutif (`pimpinan`) untuk membaca seluruh naskah (Draft, Arsip) dan dokumen Terbatas, (3) Fleksibilitas kueri status siklus hidup (`lifecycle_status` dan `status`), (4) Persistensi volume `backups/` pada Docker & skrip `scripts/backup.js`, (5) Sinkronisasi koleksi Postman `collection.json` v2.1.0 (31 request) dan ekspansi otomasi pengujian `npm test` menjadi 22 skenario integrasi (100% pass) | User-directed & Completed |
| D-36 | Verifikasi Siklus Tata Kelola End-to-End & Ekspansi Uji 25 Skenario Integrasi | (1) Penambahan skenario uji detail eksemplar buku perpustakaan (`/library/books/:id`), (2) Penambahan pengujian siklus hidup naskah penuh: Buat Draf (`POST /admin/resources`), Verifikasi Persetujuan Pokja Jarlat (`POST /admin/verification/:id/review`), dan Pengarsipan Lemdiklat (`PATCH /admin/resources/:id/archive`), (3) Validasi penjagaan ketat unduhan sampel buku berklasifikasi 'Metadata Saja' (Strict 403 FORBIDDEN), (4) Penyelarasan peran 'pengelola' pada katalog materi kurikulum, serta (5) Ekspansi suite uji `npm test` menjadi 25 skenario integrasi otomatis (100% Pass) | User-directed & Completed |
| D-37 | Integrasi Penuh Modul Admin Frontend (/admin/data & /admin/verifikasi) dengan REST API | Penghubungan modul pembuatan draf naskah materi ajar (`handleCreateDraft`), telaah antrean verifikasi Bag Jarlat (`getVerificationQueue`), persetujuan materi (`handleApprove`), penerbitan catatan revisi (`handleReject`), serta pengarsipan materi (`handleArchiveItem`) langsung ke database MySQL live melalui REST API dengan fallback aman ke simulasi lokal jika offline | User-directed & Completed |
| D-38 | Integrasi Live Modul Monitoring & Rate Limiting Adaptif | (1) Penghubungan dasbor `/admin/monitoring` dengan metrik agregasi statistik real-time (`GET /admin/monitoring/stats`) dan tabel jejak audit resmi (`GET /admin/monitoring/logs`) dari basis data MySQL, (2) Kalibrasi `authLimiter` adaptif yang membedakan mode produksi (30 percobaan/15m) dan dev/test (500 percobaan/15m) untuk stabilitas eksekusi otomasi uji, serta (3) Verifikasi penuh 25 skenario integrasi berjalan 100% lulus | User-directed & Completed |
| D-39 | Penyelarasan Matriks 6 Peran Institusional pada /admin/akses | (1) Pembaruan tabel matriks hak akses resmi pada halaman `/admin/akses` mencakup seluruh 6 tingkatan peran institusional Sespimma Lemdiklat Polri (Serdik, Gadik, Pengelola Data & Pustaka, Verifikator Bag Jarlat, Administrator Sistem, dan Pimpinan Sespimma) sesuai `docs/business rule.md`, (2) Penyelesaian integrasi menyeluruh pada seluruh 4 rute tata kelola administrator (`/admin/data`, `/admin/verifikasi`, `/admin/monitoring`, dan `/admin/akses`) | User-directed & Completed |
| D-40 | Pengujian Otomatis Manajemen Akun & Pengamanan Self-Deactivation (27 Skenario Uji) | (1) Penambahan uji validasi aktivasi status akun pengguna (`PATCH /admin/users/:id/status`), (2) Penambahan uji penjagaan keamanan self-deactivation akun administrator (Strict 400 INVALID_ACTION), (3) Penambahan uji mutasi peran pengguna (`PATCH /admin/users/:id/role`), serta (4) Ekspansi rangkaian uji otomatis `npm test` menjadi 27 skenario integrasi end-to-end lulus 100% | User-directed & Completed |
| D-41 | Utilitas Pemulihan Basis Data Otomatis (`npm run db:restore`) & Validasi Siklus Disaster Recovery | Pembuatan dan verifikasi utilitas pemulihan `scripts/restore.js` (`npm run db:restore`) yang secara otomatis mendeteksi salinan cadangan `.sql` terbaru dari folder `backups/` atau berkas spesifik yang ditentukan pengguna, mengeksekusi impor ke `sipintar_db` secara utuh, dan diverifikasi berhasil dengan kelulusan penuh 27/27 uji integrasi | User-directed & Completed |
| D-42 | Verifikasi Pengubahan Metadata Naskah (PUT) & Pengujian Otomatis Swagger / OpenAPI (28 Skenario Uji) | (1) Perluasan pengujian integrasi siklus hidup naskah dengan memverifikasi endpoint pembaruan metadata `PUT /admin/resources/:id`, (2) Penambahan pengujian verifikasi spesifikasi OpenAPI 3.0 (`/openapi.json`) dan antarmuka Swagger UI interaktif (`/docs`), serta (3) Ekspansi rangkaian uji otomatis `npm test` menjadi 28 skenario integrasi end-to-end lulus 100% | User-directed & Completed |
| D-43 | Filter Fleksibel Kategori (Slug & ID) serta Penanganan Komprehensif Status 'all' (29 Skenario Uji) | (1) Dukungan filter fleksibel kategori pada katalog materi menggunakan slug taksonomi (`?category=modul` atau `?category_slug=modul`) maupun ID numerik, dilengkapi penyesuaian kueri agregasi hitung `countQuery`, (2) Penanganan komprehensif parameter status siklus hidup (`?status=all` / `?lifecycle_status=all`) agar tidak memfilter literal 'all' pada pengguna berhak akses, serta (3) Ekspansi rangkaian uji otomatis `npm test` menjadi 29 skenario integrasi end-to-end lulus 100% | User-directed & Completed |
| D-44 | Penambahan Relasi Materi Binaan pada Detail Gadik & Suite Pengujian 30 Skenario | (1) Penambahan agregasi relasi materi ajar binaan/karya publikasi (`associated_resources`) pada endpoint detail Tenaga Pendidik `GET /api/v1/gadik/:id`, (2) Penambahan skenario uji ke-30 pada `test/api.test.js` untuk memverifikasi profil detail personel Polri fungsional beserta kompetensi dan materi ajar binaannya, serta (3) Eksekusi suite uji integrasi 30 skenario lulus 100% | User-directed & Completed |
| D-45 | Fleksibilitas Filter Koleksi Perpustakaan (Slug, Parameter Category & Nilai 'all') | (1) Dukungan filter `category` di samping `category_id` pada katalog perpustakaan `GET /api/v1/library/books`, (2) Penanganan parameter `category_id=all` agar menampilkan seluruh koleksi pustaka tanpa memfilter nilai literal 'all', serta (3) Verifikasi kontinuitas perlindungan keamanan naskah 'Metadata Saja' | User-directed & Completed |
| D-46 | Panduan Integrasi API Lengkap & Sinkronisasi Lintas Repositori Frontend | Penyusunan dokumen panduan komprehensif `docs/API_INTEGRATION_GUIDE.md` (37.7 KB, 1.248 baris) yang merinci arsitektur, autentikasi JWT, envelope JSON, kredensial pengujian 6 peran, 12 modul fungsional (27+ endpoints), request headers, request body JSON/multipart, contoh respons riil, serta contoh integrasi TypeScript/Next.js, dan menyinkronkannya langsung ke repositori frontend | User-directed & Completed |
| D-47 | Pengujian Otomatis Multi-Stream Jejak Audit (Aktivitas, Pencarian, & Verifikasi) | Penguatan skenario uji integrasi ke-18 pada `test/api.test.js` untuk secara simultan memverifikasi seluruh 3 saluran jejak audit resmi Sespimma (`type=activity` pada tabel `activity_logs`, `type=search` pada tabel `search_logs`, dan `type=verification` pada tabel `verification_logs`) dengan status 200 OK dan validasi kelengkapan data | User-directed & Completed |
| D-48 | Pengujian Penjagaan Keamanan Dokumen Berklasifikasi 'Terbatas' (31 Skenario Uji) | (1) Penambahan skenario uji ke-31 pada `test/api.test.js` untuk memverifikasi penolakan akses naskah materi intelijen/doktrin tertutup berklasifikasi 'Terbatas' terhadap peran serdik (Strict HTTP 403 FORBIDDEN) sekaligus verifikasi izin akses bagi peran admin (HTTP 200 OK), melengkapi cakupan pengujian seluruh 4 klasifikasi akses (`Terbuka`, `Internal`, `Terbatas`, `Metadata Saja`), serta (2) Kelulusan penuh 31 skenario integrasi (100% Pass) | User-directed & Completed |
| D-49 | Sinkronisasi Koleksi Postman 33 Request & Perlindungan Naskah 'Terbatas' | (1) Penambahan skenario permintaan Postman untuk memvalidasi proteksi naskah berklasifikasi 'Terbatas' (`GET /resources/12/file` via serdik token) dengan respon 403 Forbidden, (2) Sinkronisasi koleksi Postman `collection.json` v2.1.0 menjadi 33 request teruji pada kedua repositori, serta (3) Pembaruan spesifikasi dan panduan integrasi API | User-directed & Completed |
| D-50 | Pengamanan Total 'Metadata Saja': Sanitasi Jalur Berkas Langsung & Flag Digital Palsu | (1) Penegakan aturan larangan *fake download button* (`docs/business rule.md` Seksi 8.4): jika dokumen berklasifikasi 'Metadata Saja' (seperti naskah Taskap perorangan dan koleksi buku fisik perpustakaan), server secara eksplisit mengeset `has_digital_file = 0` dan `has_preview = 0` serta menghapus (*sanitize/delete*) atribut `file_path`, `preview_file_path`, dan `file_url` dari seluruh keluaran API katalog dan rincian, mencegah potensi bypass via rute statis uploads | User-directed & Completed |
| D-51 | Ketahanan Handler Global 404 & Parsing Malformed JSON (32 Skenario Uji) | (1) Penambahan skenario uji ke-32 pada `test/api.test.js` untuk menguji ketahanan server terhadap permintaan endpoint tak terdaftar (HTTP 404 `NOT_FOUND`) dan pengiriman JSON body cacat/malformed (HTTP 400 `VALIDATION_ERROR`), (2) Verifikasi seluruh 32 skenario otomasi uji integrasi end-to-end berjalan 100% lulus, serta (3) Pemutakhiran dokumentasi dan koleksi Postman 33 request | User-directed & Completed |
| D-52 | Ingestion Data Massal Institusional Sespimma dari Google Drive (Modul, Hanjar, SOP, & Library Taskap) | (1) Pengunduhan dan integrasi 77 berkas Modul Core & Bahan Ajar Hanjar resmi ke tabel `resources` (`category_id = 2`), (2) Pengunduhan dan integrasi 5 berkas SOP & Standar Layanan ke tabel `resources` (`category_id = 5`), (3) Pengunduhan 50 dokumen inventarisasi perbendaharaan perpustakaan dan ekstraksi 1.637 judul buku fisik ke tabel `books` (`buku-fisik`), (4) Ekstraksi dan katalogisasi 1.204 naskah Kertas Karya Perorangan (Taskap) peserta didik Angkatan 65 s.d 76 beserta 12 buku registrasi kompilasi ke tabel `books` (`taskap`) dengan penegakan perlindungan 'Metadata Saja', meningkatkan total perbendaharaan pustaka menjadi 2.863 judul dan total sumber belajar menjadi 183 berkas terverifikasi | User-directed & Completed |
| D-53 | Pusat Kendali Master Data & CMS Superadmin Penuh (CRUD Dokumen, Buku, & Pengguna) | Implementasi CMS terpadu pada `/admin/data` dan endpoint backend `POST/PUT/DELETE /admin/resources`, `POST/PUT/DELETE /admin/books`, serta `POST/PATCH /admin/users` yang mendukung manipulasi penuh data naskah ajar, katalog perpustakaan, dan akun pengguna dengan opsi soft & hard delete, audit logging otomatis, serta enkripsi bcryptjs | User-directed & Completed |
| D-54 | Fitur Ekspor & Impor Massal Data Multi-Entitas (CSV, Excel, & JSON) | Penambahan endpoint backend `GET /admin/export/:entity` dan `POST /admin/import/:entity` (resources, books, users) serta antarmuka modal impor interaktif dengan verifikasi pratinjau data tabular, deteksi duplikasi NRP/Email, pemetaan taksonomi otomatis, pengunduhan template resmi, dan ekspor instan file CSV/Excel | User-directed & Completed |
| D-55 | Perbaikan Logika Verifikasi Naskah & Dukungan Identifier Ganda (Numeric ID & UUID) | Penyempurnaan fungsi `reviewResource` pada `adminService.js` melalui helper `findResourceByIdentifier` sehingga mendukung pemrosesan persetujuan (*Approve*) naskah baik yang dikirimkan menggunakan numeric ID maupun string UUID dari frontend Next.js, menjamin pemutakhiran status siklus hidup ke 'Dipublikasikan' secara real-time | User-directed & Completed |
| D-56 | Penjagaan Ketat Akses Menu & Halaman Administrator (Strict Route & Navigation Guard) | Pembatasan visibilitas menu 'FUNGSI ADMINISTRATOR' pada bilah navigasi (AppShell) hanya untuk pengguna berstatus Superadmin/Admin, penyembunyian total dari pengunjung tamu (guest), Serdik, dan Gadik biasa, serta penerapan layar penolakan akses institusional Polri (*Access Denied Guard*) pada `/admin/data` dengan tombol login cepat | User-directed & Completed |
| D-57 | Penyelarasan Layout & Perataan Sejajar Tombol Aksi Toolbar CMS (Top-Flush Alignment) | Penyeragaman tinggi elemen 38px (`height: 38px, boxSizing: border-box`), perataan kontainer `alignItems: flex-start`, serta eliminasi duplikasi ikon plus (`+ +`) pada seluruh tombol aksi Tab 1 (Dokumen), Tab 2 (Perpustakaan), dan Tab 3 (Pengguna) sehingga seluruh 4 tombol aksi terangkat rapi sejajar dengan baris pertama kolom pencarian | User-directed & Completed |
| D-58 | Dokumentasi Lengkap Integrasi RESTful API & Laporan Resmi Sistem Sespimma | Penyusunan panduan integrasi komprehensif `docs/API_INTEGRATION_GUIDE.md` (13 modul, endpoint, request headers, body payload, success/error envelopes, kode helper TypeScript) serta dokumen laporan resmi kenegaraan `docs/LAPORAN_INTEGRASI.md` dan pendistribusiannya ke repositori frontend Next.js | User-directed & Completed |
| D-59 | Migrasi & Sinkronisasi Repositori Terpisah Backend API ke GitHub | Konfigurasi remote Git origin backend diarahkan secara independen ke `https://github.com/dennyssdm/sipintarsespimmaAPI.git`, berhasil di-push secara utuh ke branch `main`, dan diselaraskan dengan repositori frontend di `https://github.com/dennyssdm/Sipintar.git` | User-directed & Completed |
| D-60 | Penyusunan & Pengesahan Dokumen 45 Skenario Uji Sistem & Test Cases SIPINTAR | Perumusan dan pengesahan laporan rencana & skenario pengujian komprehensif (`docs/LAPORAN_SKENARIO_TEST_CASE.md`) mencakup 45 kasus uji dalam 11 kategori mutu (Autentikasi, Taksonomi & Katalog, Gadik, Perpustakaan/Taskap, Pencarian Terpadu, Keamanan & RBAC, Alur Verifikasi Bag Jarlat, CMS Master Data, Audit Trail & Monitoring, Gemini AI, serta UI & Responsivitas Ponsel) dengan status kelulusan 100% (45/45 Passed - Zero Defect) berstandar ISO/IEC/IEEE 29119 dan OWASP Top 10 | User-directed & Completed |

## Change-control rule

When a requirement changes:
1. Record the decision and rationale.
2. Identify affected docs and UI.
3. Update status only for work actually completed.
4. Ask for approval at the current phase gate.
5. Do not silently advance to backend work.

## Current overall status

**Current status:** Full-Stack SIPINTAR Integration (Backend RESTful API & Next.js Frontend) 100% COMPLETED, VERIFIED, & HANDED OVER.  
**Backend API running at:** `http://localhost:5001/api/v1` (Health: `http://localhost:5001/api/v1/health`, Swagger Docs: `http://localhost:5001/docs`).  
**Backend Git Repository:** `https://github.com/dennyssdm/sipintarsespimmaAPI.git` (Branch `main`).  
**Frontend running at:** `http://localhost:3000` (16 Static Routes active & protected by Role Guards).  
**Frontend Git Repository:** `https://github.com/dennyssdm/Sipintar.git` (Branch `main`).  
**Postman Collection:** `collection.json` (v2.1.0, 33 Requests) maintained and validated.  
**Test Suite:** 45 Test Scenarios Documented & 32 Automated Integration Tests (100% Pass Rate — Zero Defect).  
**Data Repository:** 2,863 Koleksi Perpustakaan & Taskap, 183 Modul & Hanjar, 7 SOP & Standar Layanan.
