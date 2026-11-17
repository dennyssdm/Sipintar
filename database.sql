-- ==============================================================
-- SIPINTAR — BASIS DATA LENGKAP MYSQL 8.0+ / PHPMYADMIN
-- Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif
-- Sespimma Sespim Lemdiklat Polri
--
-- Generated for phpMyAdmin / MySQL 8.0+
-- Basis Sumber: Buku Panduan Tata Kelola & Manual Book SIPINTAR (2026)
-- Tanggal Pembuatan: 16 November 2026
-- ==============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- --------------------------------------------------------------
-- 0. INISIALISASI DATABASE
-- --------------------------------------------------------------
DROP DATABASE IF EXISTS `sipintar_db`;
CREATE DATABASE `sipintar_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `sipintar_db`;

-- --------------------------------------------------------------
-- 1. TABEL ROLES (HAK AKSES / PERAN)
-- --------------------------------------------------------------
CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `role_code` VARCHAR(30) NOT NULL UNIQUE,
    `role_name` VARCHAR(60) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_code`, `role_name`, `description`) VALUES
(1, 'serdik', 'Peserta Didik (Serdik)', 'Peserta pendidikan Sespimma Lemdiklat Polri.'),
(2, 'gadik', 'Tenaga Pendidik (Gadik)', 'Dosen, Widyaiswara, dan instruktur kepolisian.'),
(3, 'pengelola', 'Pengelola Data & Pustaka', 'Pengelola administrasi berkas dan perpustakaan.'),
(4, 'verifikator', 'Tim Verifikator', 'Pejabat Bag Jarlat penilai mutu naskah ajar.'),
(5, 'admin', 'Administrator Sistem', 'Pengelola penuh infrastruktur aplikasi SIPINTAR.'),
(6, 'pimpinan', 'Pimpinan Sespimma', 'Kasespimma / Waka untuk pemantauan eksekutif.');

-- --------------------------------------------------------------
-- 2. TABEL USERS (PENGGUNA UTAMA)
-- --------------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL UNIQUE,
    `nrp_nip` VARCHAR(20) NOT NULL UNIQUE,
    `nama_lengkap` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role_id` INT UNSIGNED NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `avatar_url` VARCHAR(255) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `last_login_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_users_nrp` (`nrp_nip`),
    INDEX `idx_users_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Users:
-- Admin, Verifikator, Pengelola, Pimpinan, Serdik 1, Serdik 2, dan 16 Gadik
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES
(1, 'usr-uuid-admin-001', '80010001', 'AKBP Dewi Susilo Pangestuti, S.Ak.', 'dewi.susilo@sespimma.lemdiklat.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 5, '081234567890', '/avatar-admin.webp', 1),
(2, 'usr-uuid-verif-001', '75040112', 'Kasubbag Jarlat Sespimma', 'verifikator@sespimma.lemdiklat.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 4, '081234567891', NULL, 1),
(3, 'usr-uuid-pustaka-001', '1982050012', 'Pustakawan Sespimma', 'perpustakaan@sespimma.lemdiklat.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 3, '081234567892', NULL, 1),
(4, 'usr-uuid-pimpinan-001', '69080001', 'Kasespimma Sespim Lemdiklat Polri', 'kasespimma@sespimma.lemdiklat.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 6, '081234567893', NULL, 1),
(5, 'usr-uuid-serdik-001', '85071234', 'KOMPOL Arya Ramadhan, S.I.K.', 'arya.ramadhan@serdik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 1, '081234567894', NULL, 1),
(6, 'usr-uuid-serdik-002', '86030987', 'KOMPOL Budi Santoso, S.H.', 'budi.santoso@serdik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 1, '081234567895', NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (7, 'usr-gadik-72010235', '72010235', 'PURWANTO, S.I.K., M.Si.', 'purwanto@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (8, 'usr-gadik-79040926', '79040926', 'EFRIANZA, S.I.K.', 'efrianza@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (9, 'usr-gadik-76030911', '76030911', 'HIDAYAT, S.H., S.I.K.', 'hidayat@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (10, 'usr-gadik-76110038', '76110038', 'GRACE KRISNA D. RAHAKBAU, S.I.K., M.Si.', 'grace.krisna.d..rahakbau@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (11, 'usr-gadik-78081568', '78081568', 'DHANI GUMILAR, S.H., S.I.K., M.H.', 'dhani.gumilar@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (12, 'usr-gadik-74090553', '74090553', 'DIDIT EKO HERAWANTO, S.I.K., S.H.', 'didit.eko.herawanto@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (13, 'usr-gadik-70070807', '70070807', 'ASEP KAMALUDIN, M.M.', 'asep.kamaludin@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (14, 'usr-gadik-73040574', '73040574', 'DEWI SUSILO PANGESTUTI, S.Ak.', 'dewi.susilo.pangestuti@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (15, 'usr-gadik-76071042', '76071042', 'SANTHI RIANAWATI, S.H.', 'santhi.rianawati@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (16, 'usr-gadik-82071408', '82071408', 'LUSY JULI INDRIANI, S.I.K.', 'lusy.juli.indriani@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (17, 'usr-gadik-87061679', '87061679', 'RAHMAWATY TUMULO, S.I.K., M.M.', 'rahmawaty.tumulo@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (18, 'usr-gadik-84111638', '84111638', 'DINA NOVITASARI, S.H., S.I.K., M.H.', 'dina.novitasari@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (19, 'usr-gadik-74030201', '74030201', 'HENI MARDIYATMI, S.I.P., S.Sos., M.Sc.', 'heni.mardiyatmi@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (20, 'usr-gadik-88021042', '88021042', 'M. ICHWAN NUGRAHA, S.I.K., M.Si.', 'm..ichwan.nugraha@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (21, 'usr-gadik-88110791', '88110791', 'RENTHA ULI NOVITA PARDEDE, S.H., S.I.K.', 'rentha.uli.novita.pardede@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);
INSERT INTO `users` (`id`, `uuid`, `nrp_nip`, `nama_lengkap`, `email`, `password_hash`, `role_id`, `phone_number`, `avatar_url`, `is_active`) VALUES (22, 'usr-gadik-83091326', '83091326', 'MUGIARTO, S.H., M.H.', 'mugiarto@gadik.polri.go.id', '$2y$10$YFqF9.VzV7gQ1h3rXQeU5.Gf0V8G6K4L1P3M5O7R9T1V3X5Z7B9D', 2, NULL, NULL, 1);

-- --------------------------------------------------------------
-- 3. TABEL PROFIL PENGGUNA (SERDIK, GADIK, PENGELOLA)
-- --------------------------------------------------------------
CREATE TABLE `user_profiles_serdik` (
    `user_id` BIGINT UNSIGNED PRIMARY KEY,
    `nosis` VARCHAR(30) NOT NULL UNIQUE,
    `pangkat` VARCHAR(50) NOT NULL DEFAULT 'KOMPOL',
    `angkatan` VARCHAR(60) NOT NULL,
    `sindikat` VARCHAR(30) NULL,
    `satuan_asal` VARCHAR(120) NULL,
    `rencana_judul_taskap` TEXT NULL,
    CONSTRAINT `fk_serdik_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_profiles_serdik` (`user_id`, `nosis`, `pangkat`, `angkatan`, `sindikat`, `satuan_asal`, `rencana_judul_taskap`) VALUES
(5, '2026073001', 'KOMPOL', 'Sespimma Angkatan 73 TA 2026', 'Sindikat 03', 'Polda Metro Jaya', 'Optimalisasi Manajemen Logistik dan Rantai Pasok Guna Mendukung Presisi'),
(6, '2026073002', 'KOMPOL', 'Sespimma Angkatan 73 TA 2026', 'Sindikat 01', 'Polda Jawa Barat', 'Strategi Penegakan Hukum Lalu Lintas Berbasis Smart City');

CREATE TABLE `user_profiles_gadik` (
    `user_id` BIGINT UNSIGNED PRIMARY KEY,
    `no_urut_nominatif` INT UNSIGNED NULL,
    `pangkat` ENUM('KOMBES POL', 'AKBP', 'KOMPOL', 'IPTU') NOT NULL,
    `jabatan` VARCHAR(150) NOT NULL,
    `kategori_jabatan` ENUM(
        'Anjak Madya',
        'Widyaiswara Madya Tk. III',
        'Gadik Madya',
        'Widyaiswara Muda Tk. I',
        'Widyaiswara Pratama Tk. I'
    ) NOT NULL,
    `agama` ENUM('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU') NOT NULL DEFAULT 'ISLAM',
    `eselon` ENUM('II B3', 'III A2', 'III B', 'IV B') NOT NULL,
    `golongan` ENUM('IV-C', 'IV-B', 'IV-A', 'III-C', 'III-B') NOT NULL,
    `status_fungsional` VARCHAR(50) NOT NULL DEFAULT 'Aktif Fungsional',
    `no_sprint` VARCHAR(80) NULL,
    `bio` TEXT NULL,
    CONSTRAINT `fk_gadik_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (7, 1, 'KOMBES POL', 'ANJAK MADYA SESPIMMA', 'Anjak Madya', 'ISLAM', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Perwira Menengah Polri berpangkat Kombes Pol dengan penugasan sebagai Analis Kebijakan Madya (Anjak Madya) Sespimma Sespim Lemdiklat Polri. Berpengalaman luas dalam perencanaan strategis kepolisian dan pembimbingan Taskap.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (8, 2, 'KOMBES POL', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI', 'Widyaiswara Madya Tk. III', 'ISLAM', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Madya Tingkat III Sespimma Sespim Lemdiklat Polri. Berpengalaman dalam pengembangan kepemimpinan kepolisian berkarakter presisi dan adaptif.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (9, 3, 'KOMBES POL', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI', 'Widyaiswara Madya Tk. III', 'ISLAM', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Madya Tingkat III spesialisasi hukum dan hak asasi manusia. Mengampu mata kuliah penegakan hukum berkeadilan dan penerapan keadilan restoratif.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (10, 4, 'KOMBES POL', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI', 'Widyaiswara Madya Tk. III', 'KRISTEN', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Madya Tingkat III dengan kepakaran mendalam di bidang strategi kehumasan institusi, mitigasi krisis komunikasi publik, dan literasi media.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (11, 5, 'KOMBES POL', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI', 'Widyaiswara Madya Tk. III', 'ISLAM', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Madya Tingkat III berpengalaman dalam penyidikan tindak pidana korupsi dan narkoba tingkat lanjut serta penelusuran aset kejahatan kerah putih.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (12, 6, 'KOMBES POL', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI', 'Widyaiswara Madya Tk. III', 'ISLAM', 'II B3', 'IV-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Madya Tingkat III pakar di bidang intelijen kepolisian, deteksi dini ancaman kamtibmas, dan manajemen perkiraan intelijen kontinjensi.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (13, 7, 'AKBP', 'GADIK MADYA SESPIMMA', 'Gadik Madya', 'ISLAM', 'III A2', 'IV-B', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Tenaga Pendidik Madya (Gadik Madya) Sespimma dengan kepakaran pada manajemen SDM unggul Polri, sistem penilaian kinerja berbasis kompetensi, dan psikologi organisasi.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (14, 8, 'AKBP', 'GADIK MADYA SESPIMMA', 'Gadik Madya', 'ISLAM', 'III A2', 'IV-B', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Tenaga Pendidik Madya (Gadik Madya) Sespimma Lemdiklat Polri sekaligus Inovator Utama Sistem Informasi Pembelajaran Terpadu SIPINTAR (Proyek Perubahan PKN Tingkat II Angkatan XXIX TA 2026). Pakar manajemen logistik dan akuntansi kepolisian.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (15, 9, 'AKBP', 'GADIK MADYA SESPIMMA', 'Gadik Madya', 'ISLAM', 'III A2', 'IV-B', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Tenaga Pendidik Madya (Gadik Madya) Sespimma bidang analisis kebijakan kuantitatif dan kualitatif. Menguasai pemodelan keputusan berjenjang (AHP) dan perumusan strategi pemecahan masalah institusi.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (16, 10, 'AKBP', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'KRISTEN', 'III A2', 'IV-A', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I spesialisasi pembinaan masyarakat dan pemolisian komunitas. Berpengalaman mendesain strategi sinergi Bhabinkamtibmas dan tokoh masyarakat.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (17, 11, 'AKBP', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'ISLAM', 'III A2', 'IV-A', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I berfokus pada pengembangan pola pikir kreatif, akselerasi inovasi pelayanan kepolisian, dan adopsi teknologi di era industri 4.0.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (18, 12, 'AKBP', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'ISLAM', 'III A2', 'IV-A', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I dengan keahlian dalam penanganan tindak pidana siber mutakhir, sindikat judi online transnasional, dan digital investigation.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (19, 13, 'KOMPOL', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'ISLAM', 'III A2', 'IV-A', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I dengan latar belakang multidisiplin ilmu sosial dan kebijakan publik, mengampu modul pemahaman peradaban manusia serta pendekatan humanis kepolisian.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (20, 14, 'KOMPOL', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'ISLAM', 'III A2', 'IV-A', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I spesialisasi ketahanan pangan dan pengawalan program strategis nasional. Mengampu hanjar utama optimalisasi peran kepolisian dalam swasembada pangan.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (21, 15, 'KOMPOL', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA', 'Widyaiswara Muda Tk. I', 'ISLAM', 'III B', 'III-C', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Muda Tingkat I dengan rekam jejak pada pengawasan internal kepolisian, penegakan disiplin anggota, dan standarisasi proses penyidikan berkeadilan.');
INSERT INTO `user_profiles_gadik` (`user_id`, `no_urut_nominatif`, `pangkat`, `jabatan`, `kategori_jabatan`, `agama`, `eselon`, `golongan`, `status_fungsional`, `no_sprint`, `bio`) VALUES (22, 16, 'IPTU', 'WIDYAISWARA KEPOLISIAN PRATAMA TK. I SESPIMMA', 'Widyaiswara Pratama Tk. I', 'ISLAM', 'IV B', 'III-B', 'Aktif Fungsional', 'Sprin/128/X/DIK.2.1./2026', 'Widyaiswara Kepolisian Pratama Tingkat I dengan keahlian teknis hukum pidana acara, simulasi peradilan semu (moot court), serta pendampingan advokasi hukum institusi.');

CREATE TABLE `user_profiles_pengelola` (
    `user_id` BIGINT UNSIGNED PRIMARY KEY,
    `unit_kerja` VARCHAR(100) NOT NULL DEFAULT 'Subbag Renmin / Unit Perpustakaan Sespimma',
    `lingkup_akses` VARCHAR(255) NULL,
    CONSTRAINT `fk_pengelola_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_profiles_pengelola` (`user_id`, `unit_kerja`, `lingkup_akses`) VALUES
(3, 'Subbag Renmin / Unit Perpustakaan Sespimma', 'Katalogisasi Buku Fisik, Manajemen Sirkulasi Peminjaman, Unggah E-Book');

-- --------------------------------------------------------------
-- 4. TABEL GADIK KOMPETENSI (KEPAKARAN & MATA AJAR)
-- --------------------------------------------------------------
CREATE TABLE `gadik_competencies` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `competency_name` VARCHAR(150) NOT NULL,
    `competency_type` ENUM('kepakaran', 'mata_ajar') NOT NULL DEFAULT 'kepakaran',
    CONSTRAINT `fk_gc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX `idx_gc_user_type` (`user_id`, `competency_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (1, 7, 'Analisis Kebijakan Strategis Polri', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (2, 7, 'Manajemen Strategik Organisasi Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (3, 7, 'Supervisi & Pengendalian Mutu Akademik', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (4, 7, 'Analisis SWOT dan AHP', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (5, 7, 'Manajemen Perubahan & Pengendalian Mutu', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (6, 7, 'Kepemimpinan Transformasional Polri', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (7, 8, 'Kepemimpinan Strategis POLRI', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (8, 8, 'Manajemen Perubahan & Budaya Organisasi', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (9, 8, 'Taktik dan Teknis Operasional Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (10, 8, 'Pengantar Kepemimpinan Strategis POLRI (Hanjar 01)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (11, 8, 'Manajemen Operasional Kepolisian Modern', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (12, 8, 'Pengambilan Keputusan Taktis di Lapangan', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (13, 9, 'Penegakan HAM, Hukum dan Keadilan', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (14, 9, 'Hukum Acara Pidana Khusus', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (15, 9, 'Etika Profesi dan Kepatuhan Hukum', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (16, 9, 'Penegakan HAM, Hukum, dan Keadilan (Hanjar 11)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (17, 9, 'Hukum Pembuktian Modern', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (18, 9, 'Restorative Justice dan Perlindungan HAM', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (19, 10, 'Manajemen Kehumasan Polri', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (20, 10, 'Komunikasi Publik & Manajemen Reputasi Media', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (21, 10, 'Hubungan Antar Lembaga dan Kemitraan Strategis', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (22, 10, 'Manajemen Kehumasan Polri (Hanjar 02)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (23, 10, 'Komunikasi Krisis dan Strategi Media Digital', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (24, 10, 'Membangun Kemitraan Multi-Stakeholder', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (25, 11, 'Tindak Pidana Korupsi (TP Korupsi)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (26, 11, 'Tindak Pidana Narkotika (TP Narkoba)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (27, 11, 'Investigasi Tindak Pidana Pencucian Uang (TPPU)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (28, 11, 'Tindak Pidana Korupsi (Hanjar 07)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (29, 11, 'Tindak Pidana Narkotika (Hanjar 03)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (30, 11, 'Audit Investigatif dan Tracing Aset Kejahatan', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (31, 12, 'Manajemen & Standar Keberhasilan Fungsi Intelkam', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (32, 12, 'Analisis Intelijen Strategis & Kontinjensi', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (33, 12, 'Early Warning System & Deteksi Dini Kerawanan Wilayah', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (34, 12, 'Manajemen & Standar Keberhasilan Fungsi Intelkam (Hanjar 12)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (35, 12, 'Intelijen Taktis dan Analisis Kerawanan Pemilu', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (36, 12, 'Penyusunan Perkiraan Keadaan Khusus (Kirpat)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (37, 13, 'Manajemen Sumber Daya Manusia Polri (SDM)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (38, 13, 'Pembinaan Karier Berbasis Meritokrasi', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (39, 13, 'Assessment Center dan Penilaian Kinerja Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (40, 13, 'Manajemen SDM Polri (Hanjar 14)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (41, 13, 'Standar Pembinaan Karier & Manajemen Talenta Polri', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (42, 13, 'Etika Kepemimpinan Birokrasi SDM', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (43, 14, 'Manajemen Logistik dan Pengadaan Polri', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (44, 14, 'Manajemen Keuangan dan Akuntabilitas Anggaran', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (45, 14, 'Inovasi Tata Kelola Sumber Belajar Digital (SIPINTAR)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (46, 14, 'Manajemen Logistik Sespimma 2025 (Hanjar 10)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (47, 14, 'Manajemen Keuangan Negara & Audit Akuntabilitas (Hanjar 09)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (48, 14, 'Tata Kelola Ekosistem Digital SIPINTAR & Knowledge Management', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (49, 15, 'Analisis SWOT dan Analytic Hierarchy Process (AHP)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (50, 15, 'Problem Solving and Decision Making Strategis', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (51, 15, 'Metodologi Riset Terapan Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (52, 15, 'Analisis SWOT dan AHP Sespimma (Hanjar 08)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (53, 15, 'Metodologi Penulisan Kertas Karya Perorangan (Taskap)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (54, 15, 'Matriks Analisis Keputusan Kebijakan Wilayah', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (55, 16, 'Manajemen & Standar Keberhasilan Fungsi Binmas', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (56, 16, 'Pemolisian Komunitas (Community Policing / Polmas)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (57, 16, 'Pemberdayaan Masyarakat dan Mediasi Sengketa Sosial', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (58, 16, 'Manajemen & Standar Keberhasilan Fungsi Binmas (Hanjar 13)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (59, 16, 'Strategi Polmas & Forum Kemitraan Perpolisian Masyarakat (FKPM)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (60, 16, 'Pencegahan Kejahatan Melalui Komunikasi Sosial', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (61, 17, 'Inovasi dan Kreatifitas Pelayanan Publik', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (62, 17, 'Transformasi Digital dan Smart Policing', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (63, 17, 'Desain Pembelajaran Interaktif Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (64, 17, 'Inovasi dan Kreatifitas Sespimma 2025 (Hanjar 06)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (65, 17, 'Penerapan Smart City & Pelayanan Publik Digital', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (66, 17, 'Manajemen Desain Inovasi Birokrasi Polri', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (67, 18, 'Tindak Pidana Judi Online (TP Judol)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (68, 18, 'Penyidikan Kejahatan Siber (Cybercrime)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (69, 18, 'Digital Forensik & Penanganan Barang Bukti Elektronik', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (70, 18, 'Tindak Pidana Judi Online (Hanjar 04)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (71, 18, 'Investigasi Siber dan Penanganan Bukti Digital', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (72, 18, 'Hukum Siber dan Transaksi Elektronik', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (73, 19, 'Manusia dan Peradaban dalam Perspektif Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (74, 19, 'Sosiologi Hukum & Antropologi Budaya Nusantara', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (75, 19, 'Kajian Gender, Inklusi Sosial, dan Perlindungan Anak', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (76, 19, 'Manusia dan Peradaban Sespimma (Hanjar 05)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (77, 19, 'Etika Humaniora dalam Tindakan Kepolisian', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (78, 19, 'Pendekatan Sosiologis dalam Pemeliharaan Kamtibmas', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (79, 20, 'Peran Polri dalam Optimalisasi Sektor Pangan', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (80, 20, 'Strategi Pengawalan Ketahanan Pangan Nasional (Asta Cita)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (81, 20, 'Manajemen Satgas Pengawasan Distribusi Pangan', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (82, 20, 'Peran Polri dalam Optimalisasi Sektor Pangan (Hanjar 01)', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (83, 20, 'Manajemen Penegakan Hukum Tata Niaga Pangan', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (84, 20, 'Sinergi Antar Instansi Mendukung Swasembada Pangan', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (85, 21, 'Hukum Kepolisian & Tata Usaha Negara', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (86, 21, 'Akuntabilitas Penyidikan dan Kode Etik Penegakan Hukum', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (87, 21, 'Manajemen Pengawasan Penyidikan (Wasidik)', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (88, 21, 'Standar Akuntabilitas Penegakan Hukum Polri', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (89, 21, 'Hukum Disiplin & Kode Etik Profesi', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (90, 21, 'Teknik Pemeriksaan dan Penyusunan Berkas Perkara', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (91, 22, 'Praktik Peradilan Pidana & Simulasi Sidang Semu', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (92, 22, 'Bantuan Hukum dan Advokasi Kepolisian', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (93, 22, 'Penyusunan Peraturan Kepolisian (Perpol) & SOP', 'kepakaran');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (94, 22, 'Simulasi Sidang Semu dan Pembuktian Perkara', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (95, 22, 'Bantuan Hukum Bagi Anggota Polri', 'mata_ajar');
INSERT INTO `gadik_competencies` (`id`, `user_id`, `competency_name`, `competency_type`) VALUES (96, 22, 'Penyusunan SOP Taktis Lapangan', 'mata_ajar');

-- --------------------------------------------------------------
-- 5. TABEL PERIODE NOMINATIF GADIK
-- --------------------------------------------------------------
CREATE TABLE `gadik_nominatif_periods` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `period_name` VARCHAR(80) NOT NULL,
    `institution` VARCHAR(120) NOT NULL DEFAULT 'SESPIM LEMDIKLAT POLRI',
    `sub_institution` VARCHAR(120) NOT NULL DEFAULT 'SEKOLAH STAF DAN PIMPINAN PERTAMA (SESPIMMA)',
    `total_personel` INT UNSIGNED NOT NULL DEFAULT 16,
    `signed_location` VARCHAR(80) NOT NULL DEFAULT 'Lembang',
    `signed_date` VARCHAR(60) NOT NULL DEFAULT 'Oktober 2026',
    `pejabat_jabatan` VARCHAR(100) NOT NULL DEFAULT 'PS KASUBBAG RENMIN',
    `pejabat_nama` VARCHAR(150) NOT NULL DEFAULT 'SUNU PRIHANDOYO, S.T.',
    `pejabat_pangkat` VARCHAR(50) NOT NULL DEFAULT 'KOMPOL',
    `pejabat_nrp` VARCHAR(20) NOT NULL DEFAULT '82050054',
    `pdf_url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `gadik_nominatif_periods` (
    `id`, `period_name`, `institution`, `sub_institution`, `total_personel`,
    `signed_location`, `signed_date`, `pejabat_jabatan`, `pejabat_nama`,
    `pejabat_pangkat`, `pejabat_nrp`, `pdf_url`
) VALUES (
    1, 'Bulan Oktober 2026', 'SESPIM LEMDIKLAT POLRI', 'SEKOLAH STAF DAN PIMPINAN PERTAMA (SESPIMMA)', 16,
    'Lembang', 'Oktober 2026', 'PS KASUBBAG RENMIN', 'SUNU PRIHANDOYO, S.T.',
    'KOMPOL', '82050054', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf'
);

-- --------------------------------------------------------------
-- 6. TABEL KATEGORI & SUB KATEGORI MASTER
-- --------------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(80) NOT NULL UNIQUE,
    `slug` VARCHAR(80) NOT NULL UNIQUE,
    `description` VARCHAR(255) NOT NULL,
    `icon_name` VARCHAR(40) NOT NULL DEFAULT 'file-text',
    `display_order` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon_name`, `display_order`) VALUES
(1, 'Gadik & Kompetensi', 'gadik', 'Profil fungsional Polri & tenaga pendidik resmi Sespimma Lemdiklat Polri (Oktober 2026).', 'user-check', 1),
(2, 'Modul & Hanjar', 'modul', 'Bahan ajar pokok, modul pelatihan, presentasi ajar, dan lembar kerja peserta didik.', 'book-open', 2),
(3, 'E-Library/Perpustakaan', 'library', 'Koleksi buku fisik, e-book, karya tulis kepolisian (Taskap), dan jurnal ilmiah terbitan.', 'library', 3),
(4, 'Kurikulum & Standar Layanan', 'kurikulum', 'Silabus pendidikan, standar kompetensi lulusan, dan pedoman mutu layanan Sespimma.', 'award', 4),
(5, 'SOP', 'sop', 'Prosedur tetap penyelenggaraan pembelajaran, ujian, dan tata kelola sarana prasarana.', 'file-text', 5),
(6, 'Pedoman', 'pedoman', 'Pedoman akademik, petunjuk teknis pelaksanaan diklat, dan regulasi internal.', 'compass', 6),
(7, 'Manual Book', 'manual', 'Panduan operasional platform tata kelola sumber belajar digital untuk seluruh peran.', 'help-circle', 7),
(8, 'Pencarian Terpadu', 'search', 'Eksplorasi lintas kategori referensi, modul, tenaga pendidik, dan arsip dokumen.', 'search', 8);

CREATE TABLE `sub_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    CONSTRAINT `fk_subcat_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX `idx_subcat_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sub_categories` (`id`, `category_id`, `name`, `slug`) VALUES
(1, 2, 'Bahan Ajar Pokok (2025)', 'hanjar-pokok-2025'),
(2, 2, 'Bahan Ajar Utama', 'hanjar-utama'),
(3, 2, 'Modul Pelatihan', 'modul-pelatihan'),
(4, 4, 'Kurikulum & Silabus', 'kurikulum-silabus'),
(5, 5, 'SOP Pembelajaran', 'sop-pembelajaran'),
(6, 6, 'Pedoman Akademik', 'pedoman-akademik'),
(7, 7, 'Panduan Platform', 'panduan-platform');

-- --------------------------------------------------------------
-- 7. TABEL E-LIBRARY (KEPUSTAKAAN, BUKU, DAN FILE)
-- --------------------------------------------------------------
CREATE TABLE `library_categories` (
    `id` VARCHAR(30) PRIMARY KEY,
    `name` VARCHAR(80) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `icon_name` VARCHAR(40) NOT NULL DEFAULT 'book'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `library_categories` (`id`, `name`, `description`, `icon_name`) VALUES
('buku-fisik', 'Koleksi Buku Fisik', 'Buku teks cetak dan monograf referensi yang tersedia di rak Gedung Perpustakaan Sespimma.', 'book'),
('ebook', 'E-Book', 'Buku digital berformat PDF/EPUB dengan fitur pratinjau sampel bab awal dan akses penuh.', 'tablet'),
('taskap', 'Karya Tulis Kepolisian (Taskap)', 'Kertas Karya Perorangan (Taskap) peserta didik Sespimma dan pedoman riset terapan.', 'file-text'),
('jurnal', 'Jurnal Ilmiah Terbitan', 'Publikasi berkala ilmiah, riset empiris kepolisian, dan prosiding seminar Sespimma.', 'award');

CREATE TABLE `books` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL UNIQUE,
    `isbn` VARCHAR(30) NULL,
    `title` VARCHAR(255) NOT NULL,
    `author` VARCHAR(150) NOT NULL,
    `publisher` VARCHAR(120) NOT NULL DEFAULT 'Sespimma Lemdiklat Polri Press',
    `published_year` SMALLINT UNSIGNED NOT NULL,
    `synopsis` TEXT NOT NULL,
    `library_category_id` VARCHAR(30) NOT NULL,
    `sub_category` VARCHAR(100) NULL,
    `language` ENUM('Indonesia', 'Inggris') NOT NULL DEFAULT 'Indonesia',
    `call_number` VARCHAR(50) NOT NULL,
    `physical_location` VARCHAR(150) NOT NULL,
    `stock_total` INT UNSIGNED NOT NULL DEFAULT 1,
    `stock_available` INT UNSIGNED NOT NULL DEFAULT 1,
    `cover_image_url` VARCHAR(255) NULL,
    `cover_color` VARCHAR(30) NULL DEFAULT '#0d2549',
    `cover_gradient` VARCHAR(120) NULL,
    `lifecycle_status` ENUM('Draft', 'Diverifikasi', 'Dipublikasikan', 'Tidak Aktif', 'Arsip') NOT NULL DEFAULT 'Dipublikasikan',
    `access_classification` ENUM('Terbuka', 'Internal', 'Terbatas', 'Metadata Saja') NOT NULL DEFAULT 'Internal',
    `created_by` BIGINT UNSIGNED NOT NULL DEFAULT 3,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_books_lib_cat` FOREIGN KEY (`library_category_id`) REFERENCES `library_categories` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_books_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_books_category` (`library_category_id`, `stock_available`),
    FULLTEXT INDEX `ft_books_search` (`title`, `author`, `synopsis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `book_files` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `book_id` BIGINT UNSIGNED NOT NULL UNIQUE,
    `file_path` VARCHAR(255) NOT NULL,
    `preview_file_path` VARCHAR(255) NOT NULL,
    `file_format` ENUM('PDF', 'EPUB') NOT NULL DEFAULT 'PDF',
    `file_size_label` VARCHAR(20) NOT NULL,
    `total_pages` INT UNSIGNED NOT NULL DEFAULT 0,
    `preview_pages` INT UNSIGNED NOT NULL DEFAULT 20,
    `download_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bf_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    1, 'bk-book-fisik-01', '978-623-95841-0-2', 'Manajemen Logistik dan Pengadaan Polri Modern (Edisi Hardcover Cetak)', 'AKBP Dewi Susilo Pangestuti, S.Ak. & Tim Ahli Logistik',
    'Sespimma Lemdiklat Polri Press', 2025, 'Buku referensi cetak komprehensif mengenai tata kelola rantai pasok modern kepolisian, audit kepatuhan pengadaan barang/jasa pemerintah, integrasi Sistem Informasi Manajemen Logistik (SIMLOG), dan standardisasi akuntabilitas aset Barang Milik Negara (BMN) di lingkungan satuan kewilayahan Polri.', 'buku-fisik',
    'Logistik & Manajemen Aset', 'Indonesia', '658.7 DEW m 2025',
    'Lantai 2, Rak A-04 Perpustakaan Sespimma Lembang', 6, 4, NULL,
    '#1e3a8a', 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', 'Dipublikasikan', 'Internal', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      1, 1, '/10. HANJAR SESPIMMA 2025 MANAJEMEN LOGISTIK.pdf', '/10. HANJAR SESPIMMA 2025 MANAJEMEN LOGISTIK.pdf',
      'PDF', '1.99 MB', 348, 24
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    2, 'bk-book-fisik-02', '978-623-112-401-3', 'Sosiologi Kepolisian: Manusia, Peradaban, dan Harmoni Kamtibmas (Buku Cetak)', 'Kompol Heni Mardiyatmi, S.I.P., S.Sos., M.Sc.',
    'Balai Pustaka Lemdiklat Polri', 2025, 'Kajian mendalam hubungan dialektis antara institusi kepolisian dan dinamika masyarakat majemuk Indonesia. Membedah peran sosiologis perpolisian masyarakat, resolusi sengketa adat, serta pendekatan humaniora dalam menjaga stabilitas keamanan.', 'buku-fisik',
    'Sosiologi Hukum & Humaniora', 'Indonesia', '301.1 HEN s 2025',
    'Lantai 2, Rak S-02 Perpustakaan Sespimma Lembang', 5, 3, NULL,
    '#831843', 'linear-gradient(135deg, #500724 0%, #831843 100%)', 'Dipublikasikan', 'Internal', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      2, 2, '/5. HANJAR SESPIMMA 2025 MANUSIA DAN PERADABAN.pdf', '/5. HANJAR SESPIMMA 2025 MANUSIA DAN PERADABAN.pdf',
      'PDF', '2.31 MB', 320, 16
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    3, 'bk-book-fisik-03', '978-602-53218-9-3', 'Standar Manajemen Keberhasilan Fungsi Intelkam Polri (Buku Referensi Cetak)', 'Kombes Pol. Didit Eko Herawanto, S.I.K., S.H.',
    'Intelkam Press & Sespim Lemdiklat', 2025, 'Standardisasi penyelenggaraan produk intelijen kepolisian, penyusunan Perkiraan Intelijen Khusus (Kirpat), jejaring penyelidikan tertutup, serta sistem deteksi dini (Early Warning System) dalam pengamanan agenda strategis nasional.', 'buku-fisik',
    'Intelijen & Keamanan Khusus', 'Indonesia', '327.12 DID s 2025',
    'Lantai 2, Rak I-07 Perpustakaan Sespimma Lembang', 4, 2, NULL,
    '#334155', 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', 'Dipublikasikan', 'Internal', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      3, 3, '/12. HANJAR SESPIMMA 2025 MNJMN & STNDR KEBERHASILAN FUNGSI INTELKAM.pdf', '/12. HANJAR SESPIMMA 2025 MNJMN & STNDR KEBERHASILAN FUNGSI INTELKAM.pdf',
      'PDF', '2.09 MB', 340, 15
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    4, 'bk-book-fisik-04', '978-623-01-2894-3', 'Buku Referensi Hukum: Pembuktian Ilmiah Tindak Pidana Korupsi', 'Kombes Pol. Dhani Gumilar, S.H., S.I.K., M.H.',
    'Rajawali Pers & Sespimma', 2025, 'Buku pedoman cetak praktis pembuktian delik korupsi dengan metode forensik akuntansi, audit investigatif kerugian keuangan negara, teknik penelusuran aset (asset tracing), dan penanganan tindak pidana pencucian uang (TPPU).', 'buku-fisik',
    'Hukum Acara & Tipikor', 'Indonesia', '345.02 DHA p 2025',
    'Lantai 2, Rak H-14 Perpustakaan Sespimma Lembang', 5, 4, NULL,
    '#7f1d1d', 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', 'Dipublikasikan', 'Internal', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      4, 4, '/7. HANJAR SESPIMMA 2025 TP KORUPSI.pdf', '/7. HANJAR SESPIMMA 2025 TP KORUPSI.pdf',
      'PDF', '2.00 MB', 310, 18
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    5, 'bk-book-ebook-01', '978-602-53218-4-8', 'Kepemimpinan Transformasional dan Strategis Kepolisian Abad 21', 'Irjen Pol. Prof. Dr. Chryshnanda Dwilaksana, M.Si.',
    'Lemdiklat Polri Press (E-Book Edition)', 2024, 'E-Book resmi yang menelaah secara teoritis dan aplikatif urgensi kepemimpinan transformatif dalam memodernisasi kultur organisasi kepolisian, memperkuat integritas etika personel, serta memimpin reformasi birokrasi berorientasi kepuasan masyarakat.', 'ebook',
    'Kepemimpinan Strategis', 'Indonesia', '303.34 CHR k 2024 (E)',
    'Koleksi Digital SIPINTAR Cloud Server & Rak E-Book', 99, 99, NULL,
    '#b45309', 'linear-gradient(135deg, #1e293b 0%, #b45309 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      5, 5, '/1. HANJAR SESPIMMA 2025 PERAN POLRI DALAM OPTIMALISASI SEKTOR PANGAN.pdf', '/1. HANJAR SESPIMMA 2025 PERAN POLRI DALAM OPTIMALISASI SEKTOR PANGAN.pdf',
      'PDF', '2.39 MB', 412, 20
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    6, 'bk-book-ebook-02', '978-623-231-892-1', 'Penegakan Hukum Acara Pidana dan Hak Asasi Manusia (E-Book)', 'Prof. Dr. Bagus Wicaksono, S.H., LL.M. & Kombes Pol. Hidayat, S.H., S.I.K.',
    'Rajawali Pers & Sespim Lemdiklat Polri', 2025, 'E-Book kajian komparatif dan doktriner mengenai perlindungan hak asasi manusia dalam setiap tahapan penyidikan pidana, pembaharuan hukum pembuktian ilmiah (scientific crime investigation), standar perlakuan saksi-korban, dan keadilan restoratif.', 'ebook',
    'Hukum Pidana & HAM', 'Indonesia', '345.05 WIC p 2025 (E)',
    'Koleksi Digital SIPINTAR Cloud Server & Rak H-03', 99, 99, NULL,
    '#047857', 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      6, 6, '/11. HANJAR SESPIMMA 2025 PENEGAKAN HAM, HUKUM, DAN KEADILAN.pdf', '/11. HANJAR SESPIMMA 2025 PENEGAKAN HAM, HUKUM, DAN KEADILAN.pdf',
      'PDF', '2.14 MB', 386, 18
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    7, 'bk-book-ebook-03', '978-602-74892-7-5', 'Investigasi Kejahatan Siber & Pembongkaran Sindikat Judi Online (E-Book)', 'AKBP Dina Novitasari, S.H., S.I.K., M.H. & Tim Siber Bareskrim',
    'Pustaka Ilmu Kepolisian (Digital Edition)', 2025, 'E-Book materi ajar penyidikan siber mutakhir mengenai pemetaan server dan infrastruktur sindikat judi online ilegal lintas yurisdiksi, penelusuran transaksi kripto (cryptocurrency tracking), serta protokol legal penyitaan bukti digital elektronik.', 'ebook',
    'Siber & Forensik Digital', 'Indonesia', '364.168 DIN i 2025 (E)',
    'Koleksi Digital SIPINTAR Cloud Server & Rak S-05', 99, 99, NULL,
    '#0f766e', 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      7, 7, '/4. HANJAR SESPIMMA 2025 TP JUDOL.pdf', '/4. HANJAR SESPIMMA 2025 TP JUDOL.pdf',
      'PDF', '2.49 MB', 290, 22
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    8, 'bk-book-ebook-04', '978-623-88012-9-1', 'Inovasi dan Kreatifitas Kepolisian: Akselerasi Smart Policing (E-Book)', 'AKBP Rahmawaty Tumulo, S.I.K., M.M.',
    'Pustaka Smart Policing (Digital Edition)', 2025, 'Pedoman implementatif pengembangan pola pikir kreatif dan inovatif bagi perwira kepolisian tingkat menengah. Dilengkapi studi kasus integrasi pelayanan digital terpadu (Smart Policing), Command Center, dan desain inovasi birokrasi Polri.', 'ebook',
    'Smart Policing & Inovasi', 'Indonesia', '351.74 RAH i 2025 (E)',
    'Koleksi Digital SIPINTAR Cloud Server & Rak I-03', 99, 99, NULL,
    '#0284c7', 'linear-gradient(135deg, #075985 0%, #0284c7 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      8, 8, '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf', '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf',
      'PDF', '2.35 MB', 310, 20
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    9, 'bk-book-taskap-01', '978-623-95841-1-9', 'Metodologi Riset Kepolisian & Pedoman Penulisan Taskap Sespimma TA 2026', 'Pokja Pengembangan Akademik Bag Bangdik Sespimma',
    'Sespimma Press (Arsip Akademik)', 2026, 'Pedoman teknis baku perumusan judul, kerangka berpikir analitis, metodologi riset kepolisian terapan, teknik analisis data menggunakan SWOT dan Analytic Hierarchy Process (AHP), serta format sitasi ilmiah karya tulis perorangan Serdik.', 'taskap',
    'Pedoman Penulisan Ilmiah', 'Indonesia', '001.42 SES m 2026',
    'Lantai 1, Ruang Khusus Taskap Lemari C-02', 10, 8, NULL,
    '#4338ca', 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)', 'Dipublikasikan', 'Metadata Saja', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      9, 9, '/8. HANJAR SESPIMMA 2025 ANALISIS SWOT DAN AHP.pdf', '/8. HANJAR SESPIMMA 2025 ANALISIS SWOT DAN AHP.pdf',
      'PDF', '2.85 MB', 215, 15
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    10, 'bk-book-taskap-02', 'TASKAP-SESPIMMA-2026-084', 'Taskap: Optimalisasi Pelayanan Publik Terpadu Berbasis AI di Tingkat Polres', 'Kompol Arya Ramadhan, S.I.K. (Serdik Sespimma Angkatan 66)',
    'Subbag Renmin Bag Jarlat Sespimma', 2026, 'Kertas Karya Perorangan (Taskap) peserta didik Sespimma yang merumuskan arsitektur kecerdasan buatan untuk mengotomatisasi penerbitan SKCK, pemantauan pengaduan masyarakat Propam, dan penjadwalan patroli presisi berbasis heat map kriminalitas.', 'taskap',
    'Inovasi Pelayanan Kamtibmas', 'Indonesia', 'TSKP-2026 RAM o',
    'Lantai 1, Ruang Khusus Arsip Taskap Rak A-02', 2, 2, NULL,
    '#312e81', 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', 'Dipublikasikan', 'Metadata Saja', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      10, 10, '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf', '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf',
      'PDF', '2.35 MB', 145, 15
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    11, 'bk-book-taskap-03', 'TASKAP-SESPIMMA-2025-042', 'Taskap: Manajemen Konflik Sosial dan Resolusi Sengketa Agraria Komunal', 'Kompol Dian Wardhana, S.H., S.I.K. (Serdik Sespimma Angkatan 65)',
    'Perpustakaan Sespimma (Koleksi Taskap Terpilih)', 2025, 'Karya tulis perorangan predikat naskah terbaik Sespimma mengenai model mediasi kolaboratif antara aparat kepolisian, instansi pertanahan (BPN), dan perwakilan masyarakat adat guna memitigasi eskalasi konflik fisik pertanahan.', 'taskap',
    'Resolusi Konflik & Binmas', 'Indonesia', 'TSKP-2025 WAR m',
    'Lantai 1, Ruang Khusus Arsip Taskap Rak B-01', 2, 2, NULL,
    '#064e3b', 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', 'Dipublikasikan', 'Metadata Saja', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      11, 11, '/13. HANJAR SESPIMMA 2025 MANAJAMEN DAN STANDAR KEBERHASILAN FUNGSI BINMAS.pdf', '/13. HANJAR SESPIMMA 2025 MANAJAMEN DAN STANDAR KEBERHASILAN FUNGSI BINMAS.pdf',
      'PDF', '2.27 MB', 162, 16
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    12, 'bk-book-jurnal-01', 'ISSN 2548-9127 (Vol. 12 No. 2)', 'Jurnal Ilmu Kepolisian & Strategi Keamanan Sespimma (Edisi TA 2026)', 'Dewan Redaksi Jurnal Ilmiah Sespim Lemdiklat Polri',
    'Sespimma Lemdiklat Polri Press', 2026, 'Terbitan berkala ilmiah terakreditasi memuat artikel hasil riset empiris tenaga pendidik (Gadik) dan perwira Polri mengenai efektivitas community policing, transformasi digital manajemen penyidikan, dan evaluasi kurikulum kepemimpinan.', 'jurnal',
    'Jurnal Ilmu Kepolisian', 'Indonesia', 'JRNL-SESPIMMA-2026',
    'Lantai 2, Rak Terbitan Berkala & Jurnal J-01', 5, 5, NULL,
    '#1e1b4b', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      12, 12, '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf',
      'PDF', '139.7 KB', 184, 20
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    13, 'bk-book-jurnal-02', 'ISSN 2614-3852 (Vol. 8 No. 1)', 'Jurnal Transformasi Manajemen & Kepemimpinan Publik Polri (Edisi 2025)', 'Tim Redaksi Jurnal Manajemen Sespim Lemdiklat',
    'Lemdiklat Polri Press', 2025, 'Publikasi ilmiah berkala yang membedah kepemimpinan adaptif dalam pengelolaan SDM Polri berbasis meritokrasi, tata kelola pengadaan barang logistik, dan akuntabilitas keuangan negara di lingkungan kepolisian.', 'jurnal',
    'Jurnal Manajemen Publik', 'Indonesia', 'JRNL-MNJM-2025',
    'Lantai 2, Rak Terbitan Berkala & Jurnal J-02', 4, 4, NULL,
    '#14532d', 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      13, 13, '/14. HANJAR SESPIMMA 2025 MANAJEMEN SDM.pdf', '/14. HANJAR SESPIMMA 2025 MANAJEMEN SDM.pdf',
      'PDF', '2.41 MB', 196, 18
    );
INSERT INTO `books` (
    `id`, `uuid`, `isbn`, `title`, `author`, `publisher`, `published_year`,
    `synopsis`, `library_category_id`, `sub_category`, `language`, `call_number`,
    `physical_location`, `stock_total`, `stock_available`, `cover_image_url`,
    `cover_color`, `cover_gradient`, `lifecycle_status`, `access_classification`, `created_by`
  ) VALUES (
    14, 'bk-book-jurnal-03', 'ISSN 2722-1040 (Edisi Khusus)', 'Jurnal Komunikasi Publik & Mitigasi Krisis Kehumasan Polri (2025)', 'Pusat Studi Komunikasi Strategis Sespim Lemdiklat',
    'Divisi Humas & Sespim Lemdiklat', 2025, 'Kumpulan artikel ilmiah empiris mengenai manajemen isu kontroversial di media massa, penanganan hoaks kamtibmas, serta efektivitas komunikasi institusi Polri dalam membangun kepercayaan publik (public trust).', 'jurnal',
    'Jurnal Komunikasi & Kehumasan', 'Indonesia', 'JRNL-HUMAS-2025',
    'Lantai 2, Rak Terbitan Berkala & Jurnal J-03', 3, 3, NULL,
    '#7c2d12', 'linear-gradient(135deg, #451a03 0%, #7c2d12 100%)', 'Dipublikasikan', 'Terbuka', 3
  );
INSERT INTO `book_files` (
      `id`, `book_id`, `file_path`, `preview_file_path`, `file_format`, `file_size_label`, `total_pages`, `preview_pages`
    ) VALUES (
      14, 14, '/2. HANJAR SESPIMMA 2025 MANAJAMEN KEHUMASAN POLRI.pdf', '/2. HANJAR SESPIMMA 2025 MANAJAMEN KEHUMASAN POLRI.pdf',
      'PDF', '2.02 MB', 175, 15
    );

-- --------------------------------------------------------------
-- 8. TABEL SIRKULASI PEMINJAMAN BUKU
-- --------------------------------------------------------------
CREATE TABLE `book_borrowings` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `book_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `borrow_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `return_date` DATE NULL,
    `status` ENUM('Dipinjam', 'Kembali', 'Terlambat', 'Hilang') NOT NULL DEFAULT 'Dipinjam',
    `notes` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bb_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_bb_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_bb_status` (`status`, `due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `book_borrowings` (`id`, `book_id`, `user_id`, `borrow_date`, `due_date`, `status`, `notes`) VALUES
(1, 1, 5, '2026-10-10', '2026-10-24', 'Dipinjam', 'Peminjaman buku fisik untuk penyusunan referensi Taskap'),
(2, 2, 6, '2026-10-12', '2026-10-26', 'Dipinjam', 'Peminjaman buku fisik kajian hukum kepolisian');

-- --------------------------------------------------------------
-- 9. TABEL RESOURCES (MODUL, HANJAR, SOP, PEDOMAN, KURIKULUM, MANUAL)
-- --------------------------------------------------------------
CREATE TABLE `resources` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL UNIQUE,
    `title` VARCHAR(255) NOT NULL,
    `category_id` INT UNSIGNED NOT NULL,
    `sub_category_id` INT UNSIGNED NULL,
    `sub_category_text` VARCHAR(100) NULL,
    `description` TEXT NOT NULL,
    `author_or_instructor` VARCHAR(150) NOT NULL,
    `unit_or_source` VARCHAR(150) NOT NULL DEFAULT 'Sespimma Sespim Lemdiklat Polri',
    `lifecycle_status` ENUM('Draft', 'Diverifikasi', 'Dipublikasikan', 'Tidak Aktif', 'Arsip') NOT NULL DEFAULT 'Draft',
    `access_classification` ENUM('Terbuka', 'Internal', 'Terbatas', 'Metadata Saja') NOT NULL DEFAULT 'Internal',
    `has_digital_file` TINYINT(1) NOT NULL DEFAULT 0,
    `file_format` ENUM('PDF', 'DOCX', 'PPTX', 'MP4', 'EPUB') NULL,
    `file_size_bytes` BIGINT UNSIGNED NULL,
    `file_size_label` VARCHAR(20) NULL,
    `file_url` VARCHAR(255) NULL,
    `physical_location` VARCHAR(150) NULL,
    `created_by` BIGINT UNSIGNED NOT NULL DEFAULT 1,
    `verified_by` BIGINT UNSIGNED NULL,
    `published_at` DATETIME NULL,
    `archived_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_res_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_res_sub_category` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_res_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `fk_res_verifier` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX `idx_res_lifecycle_access` (`lifecycle_status`, `access_classification`),
    INDEX `idx_res_category_status` (`category_id`, `lifecycle_status`),
    FULLTEXT INDEX `ft_res_search` (`title`, `description`, `author_or_instructor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tag_name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resource_tags` (
    `resource_id` BIGINT UNSIGNED NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`resource_id`, `tag_id`),
    CONSTRAINT `fk_rt_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_rt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    1, 'res-hanjar-sespimma-01', 'Hanjar 01: Peran Polri dalam Optimalisasi Sektor Pangan', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025 mengenai strategi pengawalan, pengamanan terpadu, dan optimalisasi ketahanan pangan nasional.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.29 MB', '/1. HANJAR SESPIMMA 2025 PERAN POLRI DALAM OPTIMALISASI SEKTOR PANGAN.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    2, 'res-hanjar-sespimma-02', 'Hanjar 02: Manajemen Kehumasan Polri', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Strategi komunikasi publik, manajemen media sosial, mitigasi krisis reputasi, dan penguatan transparansi institusi.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '1.93 MB', '/2. HANJAR SESPIMMA 2025 MANAJAMEN KEHUMASAN POLRI.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    3, 'res-hanjar-sespimma-03', 'Hanjar 03: Penanganan Tindak Pidana Narkoba (TP Narkoba)', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Taktik penyelidikan peredaran gelap narkotika, clandestine lab, controlled delivery, dan pemutusan jaringan sindikat.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.19 MB', '/3. HANJAR SESPIMMA 2025 TP NARKOBA.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    4, 'res-hanjar-sespimma-04', 'Hanjar 04: Penanganan Tindak Pidana Perjudian Online (TP Judol)', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Penindakan sindikat judi online lintas-negara, profiling rekening penampung, pemblokiran situs, dan penegakan hukum siber.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.38 MB', '/4. HANJAR SESPIMMA 2025 TP JUDOL.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    5, 'res-hanjar-sespimma-05', 'Hanjar 05: Manusia dan Peradaban', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Landasan filosofis, sosiologis, dan kultural hubungan manusia, peradaban hukum, dan pemolisian yang humanis.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.20 MB', '/5. HANJAR SESPIMMA 2025 MANUSIA DAN PERADABAN.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    6, 'res-hanjar-sespimma-06', 'Hanjar 06: Inovasi dan Kreatifitas Kepolisian', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Metodologi pengembangan inovasi pelayanan publik, creative thinking perwira polri, dan proyek perubahan institusional.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.24 MB', '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    7, 'res-hanjar-sespimma-07', 'Hanjar 07: Penanganan Tindak Pidana Korupsi (TP Korupsi)', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Konstruksi hukum tipidkor, audit forensik kerugian keuangan negara, asset recovery, dan koordinasi KPK/Kejaksaan.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '1.91 MB', '/7. HANJAR SESPIMMA 2025 TP KORUPSI.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    8, 'res-hanjar-sespimma-08', 'Hanjar 08: Analisis SWOT dan Analytic Hierarchy Process (AHP)', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Metode analisis kuantitatif dan kualitatif SWOT-AHP dalam perumusan kebijakan strategis dan Taskap perorangan serdik.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.72 MB', '/8. HANJAR SESPIMMA 2025 ANALISIS SWOT DAN AHP.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    9, 'res-hanjar-sespimma-09', 'Hanjar 09: Manajemen Keuangan Satker Polri', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Tata kelola perbendaharaan DIPA, sistem akuntansi instansi, pertanggungjawaban keuangan dinas, dan kepatuhan anggaran.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '1.92 MB', '/9. HANJAR SESPIMMA 2025 MANAJEMEN KEUANGAN.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    10, 'res-hanjar-sespimma-10', 'Hanjar 10: Manajemen Logistik Polri', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Siklus logistik kepolisian, manajemen pergudangan senpi & amunisi, pemeliharaan randis, dan inventarisasi BMN.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '1.90 MB', '/10. HANJAR SESPIMMA 2025 MANAJEMEN LOGISTIK.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    11, 'res-hanjar-sespimma-11', 'Hanjar 11: Penegakan HAM, Hukum, dan Keadilan', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Penerapan prinsip hak asasi manusia dalam tindakan kepolisian, due process of law, dan etika penegakan keadilan.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.05 MB', '/11. HANJAR SESPIMMA 2025 PENEGAKAN HAM, HUKUM, DAN KEADILAN.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    12, 'res-hanjar-sespimma-12', 'Hanjar 12: Manajemen & Standar Keberhasilan Fungsi Intelkam', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Tolok ukur keberhasilan operasional intelijen keamanan, deteksi dini kamtibmas, dan penyusunan produk intelijen strategis.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbatas', 1,
    'PDF', '2.00 MB', '/12. HANJAR SESPIMMA 2025 MNJMN & STNDR KEBERHASILAN FUNGSI INTELKAM.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    13, 'res-hanjar-sespimma-13', 'Hanjar 13: Manajemen dan Standar Keberhasilan Fungsi Binmas', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Strategi pembinaan masyarakat, kemitraan Polmas, penguatan peran Bhabinkamtibmas, dan pemeliharaan harkamtibmas partisipatif.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.17 MB', '/13. HANJAR SESPIMMA 2025 MANAJAMEN DAN STANDAR KEBERHASILAN FUNGSI BINMAS.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    14, 'res-hanjar-sespimma-14', 'Hanjar 14: Manajemen Sumber Daya Manusia (SDM) Polri', 2, 'Bahan Ajar Pokok (2025)', 'Bahan ajar resmi Sespimma Lemdiklat Polri TA 2025: Siklus pembinaan personel polri, penilaian kinerja berbasis 13 komponen, asesmen kompetensi, dan penegakan meritokrasi.',
    'Tim Pokja Hanjar Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.30 MB', '/14. HANJAR SESPIMMA 2025 MANAJEMEN SDM.pdf', NULL,
    1, 2, '2025-02-15 08:00:00', '2025-02-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    15, 'res-001', 'Hanjar Kepemimpinan Strategis Polri Modern di Era Digital', 2, 'Bahan Ajar Pokok', 'Materi pedoman implementasi strategi pemolisian visioner berbasis data dan integritas organisasi.',
    'Kombes Pol. Dr. Hendra Pratama, S.I.K., M.Si.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.8 MB', NULL, NULL,
    1, 2, '2026-09-18 08:00:00', '2026-09-18 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    16, 'book-fisik-01', 'Manajemen Logistik dan Pengadaan Polri Modern (Edisi Hardcover Cetak)', 3, 'Koleksi Buku Fisik', 'Buku referensi cetak komprehensif mengenai tata kelola rantai pasok modern kepolisian, audit kepatuhan pengadaan barang/jasa pemerintah, integrasi Sistem Informasi Manajemen Logistik (SIMLOG), dan standardisasi akuntabilitas aset Barang Milik Negara (BMN) di lingkungan satuan kewilayahan Polri.',
    'AKBP Dewi Susilo Pangestuti, S.Ak. & Tim Ahli Logistik', 'Sespimma Lemdiklat Polri Press',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '1.99 MB', '/10. HANJAR SESPIMMA 2025 MANAJEMEN LOGISTIK.pdf', 'Lantai 2, Rak A-04 Perpustakaan Sespimma Lembang',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    17, 'book-fisik-02', 'Sosiologi Kepolisian: Manusia, Peradaban, dan Harmoni Kamtibmas (Buku Cetak)', 3, 'Koleksi Buku Fisik', 'Kajian mendalam hubungan dialektis antara institusi kepolisian dan dinamika masyarakat majemuk Indonesia. Membedah peran sosiologis perpolisian masyarakat, resolusi sengketa adat, serta pendekatan humaniora dalam menjaga stabilitas keamanan.',
    'Kompol Heni Mardiyatmi, S.I.P., S.Sos., M.Sc.', 'Balai Pustaka Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.31 MB', '/5. HANJAR SESPIMMA 2025 MANUSIA DAN PERADABAN.pdf', 'Lantai 2, Rak S-02 Perpustakaan Sespimma Lembang',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    18, 'book-fisik-03', 'Standar Manajemen Keberhasilan Fungsi Intelkam Polri (Buku Referensi Cetak)', 3, 'Koleksi Buku Fisik', 'Standardisasi penyelenggaraan produk intelijen kepolisian, penyusunan Perkiraan Intelijen Khusus (Kirpat), jejaring penyelidikan tertutup, serta sistem deteksi dini (Early Warning System) dalam pengamanan agenda strategis nasional.',
    'Kombes Pol. Didit Eko Herawanto, S.I.K., S.H.', 'Intelkam Press & Sespim Lemdiklat',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.09 MB', '/12. HANJAR SESPIMMA 2025 MNJMN & STNDR KEBERHASILAN FUNGSI INTELKAM.pdf', 'Lantai 2, Rak I-07 Perpustakaan Sespimma Lembang',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    19, 'book-fisik-04', 'Buku Referensi Hukum: Pembuktian Ilmiah Tindak Pidana Korupsi', 3, 'Koleksi Buku Fisik', 'Buku pedoman cetak praktis pembuktian delik korupsi dengan metode forensik akuntansi, audit investigatif kerugian keuangan negara, teknik penelusuran aset (asset tracing), dan penanganan tindak pidana pencucian uang (TPPU).',
    'Kombes Pol. Dhani Gumilar, S.H., S.I.K., M.H.', 'Rajawali Pers & Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.00 MB', '/7. HANJAR SESPIMMA 2025 TP KORUPSI.pdf', 'Lantai 2, Rak H-14 Perpustakaan Sespimma Lembang',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    20, 'book-ebook-01', 'Kepemimpinan Transformasional dan Strategis Kepolisian Abad 21', 3, 'E-Book', 'E-Book resmi yang menelaah secara teoritis dan aplikatif urgensi kepemimpinan transformatif dalam memodernisasi kultur organisasi kepolisian, memperkuat integritas etika personel, serta memimpin reformasi birokrasi berorientasi kepuasan masyarakat.',
    'Irjen Pol. Prof. Dr. Chryshnanda Dwilaksana, M.Si.', 'Lemdiklat Polri Press (E-Book Edition)',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.39 MB', '/1. HANJAR SESPIMMA 2025 PERAN POLRI DALAM OPTIMALISASI SEKTOR PANGAN.pdf', 'Koleksi Digital SIPINTAR Cloud Server & Rak E-Book',
    1, 2, '2024-10-01 08:00:00', '2024-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    21, 'book-ebook-02', 'Penegakan Hukum Acara Pidana dan Hak Asasi Manusia (E-Book)', 3, 'E-Book', 'E-Book kajian komparatif dan doktriner mengenai perlindungan hak asasi manusia dalam setiap tahapan penyidikan pidana, pembaharuan hukum pembuktian ilmiah (scientific crime investigation), standar perlakuan saksi-korban, dan keadilan restoratif.',
    'Prof. Dr. Bagus Wicaksono, S.H., LL.M. & Kombes Pol. Hidayat, S.H., S.I.K.', 'Rajawali Pers & Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.14 MB', '/11. HANJAR SESPIMMA 2025 PENEGAKAN HAM, HUKUM, DAN KEADILAN.pdf', 'Koleksi Digital SIPINTAR Cloud Server & Rak H-03',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    22, 'book-ebook-03', 'Investigasi Kejahatan Siber & Pembongkaran Sindikat Judi Online (E-Book)', 3, 'E-Book', 'E-Book materi ajar penyidikan siber mutakhir mengenai pemetaan server dan infrastruktur sindikat judi online ilegal lintas yurisdiksi, penelusuran transaksi kripto (cryptocurrency tracking), serta protokol legal penyitaan bukti digital elektronik.',
    'AKBP Dina Novitasari, S.H., S.I.K., M.H. & Tim Siber Bareskrim', 'Pustaka Ilmu Kepolisian (Digital Edition)',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.49 MB', '/4. HANJAR SESPIMMA 2025 TP JUDOL.pdf', 'Koleksi Digital SIPINTAR Cloud Server & Rak S-05',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    23, 'book-ebook-04', 'Inovasi dan Kreatifitas Kepolisian: Akselerasi Smart Policing (E-Book)', 3, 'E-Book', 'Pedoman implementatif pengembangan pola pikir kreatif dan inovatif bagi perwira kepolisian tingkat menengah. Dilengkapi studi kasus integrasi pelayanan digital terpadu (Smart Policing), Command Center, dan desain inovasi birokrasi Polri.',
    'AKBP Rahmawaty Tumulo, S.I.K., M.M.', 'Pustaka Smart Policing (Digital Edition)',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.35 MB', '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf', 'Koleksi Digital SIPINTAR Cloud Server & Rak I-03',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    24, 'book-taskap-01', 'Metodologi Riset Kepolisian & Pedoman Penulisan Taskap Sespimma TA 2026', 3, 'Karya Tulis Kepolisian (Taskap)', 'Pedoman teknis baku perumusan judul, kerangka berpikir analitis, metodologi riset kepolisian terapan, teknik analisis data menggunakan SWOT dan Analytic Hierarchy Process (AHP), serta format sitasi ilmiah karya tulis perorangan Serdik.',
    'Pokja Pengembangan Akademik Bag Bangdik Sespimma', 'Sespimma Press (Arsip Akademik)',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.85 MB', '/8. HANJAR SESPIMMA 2025 ANALISIS SWOT DAN AHP.pdf', 'Lantai 1, Ruang Khusus Taskap Lemari C-02',
    1, 2, '2026-10-01 08:00:00', '2026-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    25, 'book-taskap-02', 'Taskap: Optimalisasi Pelayanan Publik Terpadu Berbasis AI di Tingkat Polres', 3, 'Karya Tulis Kepolisian (Taskap)', 'Kertas Karya Perorangan (Taskap) peserta didik Sespimma yang merumuskan arsitektur kecerdasan buatan untuk mengotomatisasi penerbitan SKCK, pemantauan pengaduan masyarakat Propam, dan penjadwalan patroli presisi berbasis heat map kriminalitas.',
    'Kompol Arya Ramadhan, S.I.K. (Serdik Sespimma Angkatan 66)', 'Subbag Renmin Bag Jarlat Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.35 MB', '/6. HANJAR SESPIMMA 2025 INOVASI DAN KREATIFITAS.pdf', 'Lantai 1, Ruang Khusus Arsip Taskap Rak A-02',
    1, 2, '2026-10-01 08:00:00', '2026-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    26, 'book-taskap-03', 'Taskap: Manajemen Konflik Sosial dan Resolusi Sengketa Agraria Komunal', 3, 'Karya Tulis Kepolisian (Taskap)', 'Karya tulis perorangan predikat naskah terbaik Sespimma mengenai model mediasi kolaboratif antara aparat kepolisian, instansi pertanahan (BPN), dan perwakilan masyarakat adat guna memitigasi eskalasi konflik fisik pertanahan.',
    'Kompol Dian Wardhana, S.H., S.I.K. (Serdik Sespimma Angkatan 65)', 'Perpustakaan Sespimma (Koleksi Taskap Terpilih)',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.27 MB', '/13. HANJAR SESPIMMA 2025 MANAJAMEN DAN STANDAR KEBERHASILAN FUNGSI BINMAS.pdf', 'Lantai 1, Ruang Khusus Arsip Taskap Rak B-01',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    27, 'book-jurnal-01', 'Jurnal Ilmu Kepolisian & Strategi Keamanan Sespimma (Edisi TA 2026)', 3, 'Jurnal Ilmiah Terbitan', 'Terbitan berkala ilmiah terakreditasi memuat artikel hasil riset empiris tenaga pendidik (Gadik) dan perwira Polri mengenai efektivitas community policing, transformasi digital manajemen penyidikan, dan evaluasi kurikulum kepemimpinan.',
    'Dewan Redaksi Jurnal Ilmiah Sespim Lemdiklat Polri', 'Sespimma Lemdiklat Polri Press',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', 'Lantai 2, Rak Terbitan Berkala & Jurnal J-01',
    1, 2, '2026-10-01 08:00:00', '2026-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    28, 'book-jurnal-02', 'Jurnal Transformasi Manajemen & Kepemimpinan Publik Polri (Edisi 2025)', 3, 'Jurnal Ilmiah Terbitan', 'Publikasi ilmiah berkala yang membedah kepemimpinan adaptif dalam pengelolaan SDM Polri berbasis meritokrasi, tata kelola pengadaan barang logistik, dan akuntabilitas keuangan negara di lingkungan kepolisian.',
    'Tim Redaksi Jurnal Manajemen Sespim Lemdiklat', 'Lemdiklat Polri Press',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.41 MB', '/14. HANJAR SESPIMMA 2025 MANAJEMEN SDM.pdf', 'Lantai 2, Rak Terbitan Berkala & Jurnal J-02',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    29, 'book-jurnal-03', 'Jurnal Komunikasi Publik & Mitigasi Krisis Kehumasan Polri (2025)', 3, 'Jurnal Ilmiah Terbitan', 'Kumpulan artikel ilmiah empiris mengenai manajemen isu kontroversial di media massa, penanganan hoaks kamtibmas, serta efektivitas komunikasi institusi Polri dalam membangun kepercayaan publik (public trust).',
    'Pusat Studi Komunikasi Strategis Sespim Lemdiklat', 'Divisi Humas & Sespim Lemdiklat',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.02 MB', '/2. HANJAR SESPIMMA 2025 MANAJAMEN KEHUMASAN POLRI.pdf', 'Lantai 2, Rak Terbitan Berkala & Jurnal J-03',
    1, 2, '2025-10-01 08:00:00', '2025-10-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    30, 'res-004', 'SOP Penyelenggaraan Evaluasi Akademik dan Sidang Kertas Karya Perorangan', 5, 'Standar Operasional Prosedur', 'Ketentuan baku tata cara pelaksanaan ujian komprehensif dan sidang pleno kelulusan peserta didik.',
    'Tim Pokja Kurikulum & Evaluasi', 'Subbag Renlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '1.9 MB', NULL, NULL,
    1, 2, '2026-09-02 08:00:00', '2026-09-02 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    31, 'gadik-72010235', 'Profil Tenaga Pendidik: PURWANTO, S.I.K., M.Si.', 1, 'Anjak Madya', 'ANJAK MADYA SESPIMMA (NRP 72010235). Pakar bidang: Analisis Kebijakan Strategis Polri, Manajemen Strategik Organisasi Kepolisian.',
    'PURWANTO, S.I.K., M.Si.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    32, 'gadik-79040926', 'Profil Tenaga Pendidik: EFRIANZA, S.I.K.', 1, 'Widyaiswara Madya Tk. III', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI (NRP 79040926). Pakar bidang: Kepemimpinan Strategis POLRI, Manajemen Perubahan & Budaya Organisasi.',
    'EFRIANZA, S.I.K.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    33, 'gadik-76030911', 'Profil Tenaga Pendidik: HIDAYAT, S.H., S.I.K.', 1, 'Widyaiswara Madya Tk. III', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI (NRP 76030911). Pakar bidang: Penegakan HAM, Hukum dan Keadilan, Hukum Acara Pidana Khusus.',
    'HIDAYAT, S.H., S.I.K.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    34, 'gadik-76110038', 'Profil Tenaga Pendidik: GRACE KRISNA D. RAHAKBAU, S.I.K., M.Si.', 1, 'Widyaiswara Madya Tk. III', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI (NRP 76110038). Pakar bidang: Manajemen Kehumasan Polri, Komunikasi Publik & Manajemen Reputasi Media.',
    'GRACE KRISNA D. RAHAKBAU, S.I.K., M.Si.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    35, 'gadik-78081568', 'Profil Tenaga Pendidik: DHANI GUMILAR, S.H., S.I.K., M.H.', 1, 'Widyaiswara Madya Tk. III', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI (NRP 78081568). Pakar bidang: Tindak Pidana Korupsi (TP Korupsi), Tindak Pidana Narkotika (TP Narkoba).',
    'DHANI GUMILAR, S.H., S.I.K., M.H.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    36, 'gadik-74090553', 'Profil Tenaga Pendidik: DIDIT EKO HERAWANTO, S.I.K., S.H.', 1, 'Widyaiswara Madya Tk. III', 'WIDYA ISWARA KEPOLISIAN MADYA TK. III SESPIMMA SESPIM LEMDIKLAT POLRI (NRP 74090553). Pakar bidang: Manajemen & Standar Keberhasilan Fungsi Intelkam, Analisis Intelijen Strategis & Kontinjensi.',
    'DIDIT EKO HERAWANTO, S.I.K., S.H.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    37, 'gadik-70070807', 'Profil Tenaga Pendidik: ASEP KAMALUDIN, M.M.', 1, 'Gadik Madya', 'GADIK MADYA SESPIMMA (NRP 70070807). Pakar bidang: Manajemen Sumber Daya Manusia Polri (SDM), Pembinaan Karier Berbasis Meritokrasi.',
    'ASEP KAMALUDIN, M.M.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    38, 'gadik-73040574', 'Profil Tenaga Pendidik: DEWI SUSILO PANGESTUTI, S.Ak.', 1, 'Gadik Madya', 'GADIK MADYA SESPIMMA (NRP 73040574). Pakar bidang: Manajemen Logistik dan Pengadaan Polri, Manajemen Keuangan dan Akuntabilitas Anggaran.',
    'DEWI SUSILO PANGESTUTI, S.Ak.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    39, 'gadik-76071042', 'Profil Tenaga Pendidik: SANTHI RIANAWATI, S.H.', 1, 'Gadik Madya', 'GADIK MADYA SESPIMMA (NRP 76071042). Pakar bidang: Analisis SWOT dan Analytic Hierarchy Process (AHP), Problem Solving and Decision Making Strategis.',
    'SANTHI RIANAWATI, S.H.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    40, 'gadik-82071408', 'Profil Tenaga Pendidik: LUSY JULI INDRIANI, S.I.K.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 82071408). Pakar bidang: Manajemen & Standar Keberhasilan Fungsi Binmas, Pemolisian Komunitas (Community Policing / Polmas).',
    'LUSY JULI INDRIANI, S.I.K.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    41, 'gadik-87061679', 'Profil Tenaga Pendidik: RAHMAWATY TUMULO, S.I.K., M.M.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 87061679). Pakar bidang: Inovasi dan Kreatifitas Pelayanan Publik, Transformasi Digital dan Smart Policing.',
    'RAHMAWATY TUMULO, S.I.K., M.M.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    42, 'gadik-84111638', 'Profil Tenaga Pendidik: DINA NOVITASARI, S.H., S.I.K., M.H.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 84111638). Pakar bidang: Tindak Pidana Judi Online (TP Judol), Penyidikan Kejahatan Siber (Cybercrime).',
    'DINA NOVITASARI, S.H., S.I.K., M.H.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    43, 'gadik-74030201', 'Profil Tenaga Pendidik: HENI MARDIYATMI, S.I.P., S.Sos., M.Sc.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 74030201). Pakar bidang: Manusia dan Peradaban dalam Perspektif Kepolisian, Sosiologi Hukum & Antropologi Budaya Nusantara.',
    'HENI MARDIYATMI, S.I.P., S.Sos., M.Sc.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    44, 'gadik-88021042', 'Profil Tenaga Pendidik: M. ICHWAN NUGRAHA, S.I.K., M.Si.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 88021042). Pakar bidang: Peran Polri dalam Optimalisasi Sektor Pangan, Strategi Pengawalan Ketahanan Pangan Nasional (Asta Cita).',
    'M. ICHWAN NUGRAHA, S.I.K., M.Si.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    45, 'gadik-88110791', 'Profil Tenaga Pendidik: RENTHA ULI NOVITA PARDEDE, S.H., S.I.K.', 1, 'Widyaiswara Muda Tk. I', 'WIDYAISWARA KEPOLISIAN MUDA TK. I SESPIMMA (NRP 88110791). Pakar bidang: Hukum Kepolisian & Tata Usaha Negara, Akuntabilitas Penyidikan dan Kode Etik Penegakan Hukum.',
    'RENTHA ULI NOVITA PARDEDE, S.H., S.I.K.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    46, 'gadik-83091326', 'Profil Tenaga Pendidik: MUGIARTO, S.H., M.H.', 1, 'Widyaiswara Pratama Tk. I', 'WIDYAISWARA KEPOLISIAN PRATAMA TK. I SESPIMMA (NRP 83091326). Pakar bidang: Praktik Peradilan Pidana & Simulasi Sidang Semu, Bantuan Hukum dan Advokasi Kepolisian.',
    'MUGIARTO, S.H., M.H.', 'Sespimma Sespim Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '139.7 KB', '/NOMINATIF%20POLRI%20(FUNGSIONAL)%20BLN%20OKTOBER%202026%20.pdf', NULL,
    1, 2, '2026-10-15 08:00:00', '2026-10-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    47, 'res-006', 'Pedoman Penulisan dan Pembimbingan Kertas Karya Perorangan (Taskap) TA 2026', 6, 'Pedoman Akademik', 'Petunjuk teknis format penulisan, kaidah sitasi ilmiah, serta etika penelitian akademis.',
    'Bag Bangdik Sespimma Lemdiklat Polri', 'Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '3.2 MB', NULL, NULL,
    1, 2, '2026-06-15 08:00:00', '2026-06-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    48, 'res-007', 'Bahan Tayang Modul Manajemen Konflik Sosial Komprehensif', 2, 'Slide Presentasi', 'Paparan interaktif pemetaan potensi konflik komunal, teknik mediasi, dan negosiasi taktis kamtibmas.',
    'Kombes Pol. Drs. Ahmad Fauzi, M.Hum.', 'Bag Jarlat Sespimma',
    'Diverifikasi', 'Internal', 1,
    'PPTX', '18.4 MB', NULL, NULL,
    1, NULL, '2026-09-24 08:00:00', '2026-09-24 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    49, 'res-008', 'Rancangan Modul Intelijen Taktis dan Analisis Kerawanan Pemilu', 2, 'Draf Modul Baru', 'Konsep awal naskah bahan ajar pengamanan operasi dan pemetaan kerawanan wilayah kontijensi.',
    'Subdit Analisis Intelkam Sespimma', 'Bag Jarlat Sespimma',
    'Draft', 'Terbatas', 1,
    'DOCX', '840 KB', NULL, NULL,
    1, NULL, '2026-10-12 08:00:00', '2026-10-12 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    50, 'res-009', 'Kurikulum Pendidikan dan Pelatihan Kepemimpinan Tingkat Menengah TA 2026', 4, 'Kurikulum Pokok', 'Struktur kurikulum 720 jam pelajaran mencakup mata pelajaran inti kepolisian, manajemen, dan etika profesi.',
    'Pokja Pengembangan Kurikulum Lemdiklat', 'Bag Bangdik Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.6 MB', NULL, NULL,
    1, 2, '2026-05-10 08:00:00', '2026-05-10 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    51, 'res-010', 'Standar Pelayanan Minimal Pengajaran dan Fasilitas Belajar Sespimma', 4, 'Standar Layanan', 'Tolok ukur mutu sarana ruang kelas multimedia, rasio gadik terhadap serdik, dan ketersediaan bahan ajar.',
    'Tim Penjamin Mutu Pendidikan Sespimma', 'Subbag Renmin Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '2.1 MB', NULL, NULL,
    1, 2, '2026-06-20 08:00:00', '2026-06-20 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    52, 'res-011', 'SOP Peminjaman Koleksi Pustaka dan Tata Tertib Ruang Baca', 5, 'Prosedur Tetap', 'Ketentuan pemanfaatan perpustakaan, batas waktu peminjaman buku fisik, dan sanksi keterlambatan.',
    'Pengelola Unit Perpustakaan Sespimma', 'Perpustakaan Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '1.2 MB', NULL, NULL,
    1, 2, '2026-07-04 08:00:00', '2026-07-04 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    53, 'res-012', 'Manual Book SIPINTAR: Panduan Akses Sumber Belajar Bagi Peserta Didik (Serdik)', 7, 'Buku Panduan Pengguna', 'Panduan langkah demi langkah pencarian terpadu, membaca modul ajar, dan mengecek ketersediaan fisik buku perpustakaan.',
    'Tim Pokja Inovasi SIPINTAR', 'Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '4.1 MB', NULL, NULL,
    1, 2, '2026-10-05 08:00:00', '2026-10-05 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    54, 'res-013', 'Buku Panduan Tata Kelola Ekosistem Sumber Belajar SIPINTAR', 7, 'Tata Kelola Institusi', 'Ketentuan baku verifikasi naskah, klasifikasi akses terbuka-internal-terbatas, serta matriks tanggung jawab pengelola.',
    'Tim Perumus Tata Kelola SIPINTAR', 'Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.7 MB', NULL, NULL,
    1, 2, '2026-10-10 08:00:00', '2026-10-10 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    55, 'res-015', 'Hanjar Manajemen Operasional Kepolisian Terpadu (Edisi 2021 - Arsip)', 2, 'Bahan Ajar Terdahulu', 'Modul operasi kepolisian periode kurikulum terdahulu yang diarsipkan sebagai materi rujukan sejarah doktrin.',
    'Bag Jarlat Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma',
    'Arsip', 'Terbatas', 1,
    'PDF', '8.3 MB', NULL, NULL,
    1, NULL, '2021-12-01 08:00:00', '2021-12-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    56, 'res-016', 'Petunjuk Teknis Ujian Menembak Taktis dan Beladiri Polri (Revisi Tertunda)', 6, 'Petunjuk Teknis', 'Pedoman teknis penilaian keterampilan lapangan yang dinonaktifkan sementara menunggu instrumen evaluasi terintegrasi.',
    'Subbag Latsat Sespimma Lemdiklat Polri', 'Subbag Renmin Sespimma',
    'Tidak Aktif', 'Internal', 0,
    NULL, NULL, NULL, NULL,
    1, NULL, '2025-11-15 08:00:00', '2025-11-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    57, 'res-hanjar-002', 'Hanjar Kepemimpinan Visioner dan Pengambilan Keputusan Taktis', 2, 'Bahan Ajar Pokok', 'Pedoman pengembangan kepemimpinan prediktif dan metodologi pengambilan keputusan taktis berbasis data situasi kamtibmas.',
    'Brigjen Pol. (Purn) Drs. Bambang Soetrisno, S.H.', 'Korps Tenaga Pendidik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.2 MB', NULL, NULL,
    1, 2, '2026-09-15 08:00:00', '2026-09-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    58, 'res-hanjar-003', 'Hanjar Etika Profesi, Integritas, dan Moralitas Kepemimpinan Polri', 2, 'Bahan Ajar Pokok', 'Pemberdayaan integritas moral perwira pertama Polri, penegakan Kode Etik Profesi Polri, dan pencegahan maladministrasi.',
    'Kombes Pol. Wahyu Hidayat, S.I.K., M.H.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.6 MB', NULL, NULL,
    1, 2, '2026-09-10 08:00:00', '2026-09-10 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    59, 'res-hanjar-004', 'Hanjar Kepemimpinan Transformasional dan Manajemen Perubahan Satwil', 2, 'Bahan Ajar Pokok', 'Konsep dasar transformational leadership dalam mendorong akselerasi inovasi layanan publik dan reformasi birokrasi di polres/polsek.',
    'Kombes Pol. Dr. Irfan Susanto, S.H., S.I.K.', 'Korps Gadik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.1 MB', NULL, NULL,
    1, 2, '2026-09-12 08:00:00', '2026-09-12 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    60, 'res-hanjar-005', 'Hanjar Komunikasi Publik, Hubungan Media, dan Manajemen Reputasi Polri', 2, 'Bahan Ajar Pokok', 'Strategi framing informasi, mitigasi sentimen negatif media sosial, serta teknik konferensi pers dan counter-opini publik.',
    'AKBP Dewi Suryani, S.H., S.I.K., M.Kom.', 'Pokja Komunikasi & Teknologi Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.4 MB', NULL, NULL,
    1, 2, '2026-09-20 08:00:00', '2026-09-20 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    61, 'res-hanjar-006', 'Hanjar Budaya Organisasi, Pelayanan Prima, dan Revolusi Mental Kepolisian', 2, 'Bahan Ajar Pokok', 'Penguatan nilai-nilai Tribrata dan Catur Prasetya sebagai landasan pembentukan kultur kepolisian yang humanis dan melayani.',
    'Kombes Pol. Dra. Ratna Kusuma, M.Psi.', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.9 MB', NULL, NULL,
    1, 2, '2026-08-30 08:00:00', '2026-08-30 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    62, 'res-hanjar-007', 'Hanjar Manajemen Operasional Kepolisian (MOK) Terpadu Kewilayahan', 2, 'Bahan Ajar Pokok', 'Prinsip perencanaan, pengorganisasian, pelaksanaan, dan pengendalian operasi kepolisian rutin maupun operasi khusus kepolisian.',
    'Kombes Pol. Agus Suryanto, S.I.K., M.Si.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '7.2 MB', NULL, NULL,
    1, 2, '2026-09-08 08:00:00', '2026-09-08 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    63, 'res-hanjar-008', 'Hanjar Manajemen Kontinjensi dan Penanggulangan Bencana Terpadu', 2, 'Bahan Ajar Pokok', 'Tata kelola pengerahan kekuatan polri dalam menghadapi kontinjensi bencana alam, konflik horizontal, dan kedaruratan nasional.',
    'Kombes Pol. Drs. Joko Priyono, M.M.', 'Subbag Latsat Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.8 MB', NULL, NULL,
    1, 2, '2026-09-05 08:00:00', '2026-09-05 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    64, 'res-hanjar-009', 'Hanjar Perencanaan Strategis (Renstra) dan Rencana Kerja (Renja) Polres/Polsek', 2, 'Bahan Ajar Pokok', 'Pedoman penyusunan dokumen perencanaan jangka menengah (Renstra) dan tahunan (Renja) selaras dengan Renstra Polri.',
    'AKBP Budi Darmawan, S.E., M.M.', 'Biro Perencanaan Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.5 MB', NULL, NULL,
    1, 2, '2026-08-25 08:00:00', '2026-08-25 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    65, 'res-hanjar-010', 'Hanjar Manajemen Anggaran DIPA, Perbendaharaan, dan Akuntabilitas Keuangan Satker', 2, 'Bahan Ajar Pokok', 'Teknis penyerapan anggaran berbasis kinerja, pertanggungjawaban keuangan dinas (Perwabkeu), dan pencegahan fraud anggaran.',
    'AKBP Sri Wahyuni, S.E., Ak., C.A.', 'Subbag Renmin Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '3.7 MB', NULL, NULL,
    1, 2, '2026-09-14 08:00:00', '2026-09-14 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    66, 'res-hanjar-011', 'Hanjar Manajemen Logistik, Perlengkapan, dan Pengadaan Barang/Jasa Pemerintah Polri', 2, 'Bahan Ajar Pokok', 'Prosedur pengelolaan rantai pasok material logistik, alsus, senpi dan amunisi dinas, serta e-katalog pengadaan barang/jasa.',
    'Kombes Pol. Tri Haryono, S.T., M.M.', 'Slog Polri / Korps Gadik Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.9 MB', NULL, NULL,
    1, 2, '2026-08-20 08:00:00', '2026-08-20 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    67, 'res-hanjar-012', 'Hanjar Manajemen Sumber Daya Manusia (SDM) Berbasis Sistem Merit dan Pembinaan Karir', 2, 'Bahan Ajar Pokok', 'Pola pembinaan karier anggota Polri berbasis 13 komponen penilaian, sistem merit, konseling psikologis, dan reward-punishment.',
    'Kombes Pol. Dedi Supriyadi, S.I.K., M.H.', 'SSDM Polri / Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.1 MB', NULL, NULL,
    1, 2, '2026-09-02 08:00:00', '2026-09-02 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    68, 'res-hanjar-013', 'Hanjar Sistem Manajemen Pengawasan, Wasrik, dan Akuntabilitas Kinerja Instansi Pemerintah (AKIP)', 2, 'Bahan Ajar Pokok', 'Mekanisme pengawasan internal, audit kinerja oleh Inspektorat, pengukuran SAKIP, dan mitigasi temuan audit BPK.',
    'Kombes Pol. R. Haryadi, S.I.K., CFrA.', 'Itwasum Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.2 MB', NULL, NULL,
    1, 2, '2026-08-18 08:00:00', '2026-08-18 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    69, 'res-hanjar-014', 'Hanjar Penyelidikan dan Penyidikan Kejahatan Siber (Cyber Crime) & Digital Forensics', 2, 'Bahan Ajar Pokok', 'Prosedur penyitaan barang bukti elektronik, analisis forensik disk & mobile device, serta pelacakan jejak digital pelaku siber.',
    'AKBP Dewi Suryani, S.H., S.I.K., M.Kom.', 'Korps Gadik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '8.1 MB', NULL, NULL,
    1, 2, '2026-09-22 08:00:00', '2026-09-22 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    70, 'res-hanjar-015', 'Hanjar Manajemen Pengawasan Penyidikan (Wassidik) dan Gelar Perkara Khusus', 2, 'Bahan Ajar Pokok', 'Standard operating procedure gelar perkara awal, pertengahan, dan khusus guna menjamin akuntabilitas penyidikan bebas komplain.',
    'Kombes Pol. Dr. Antonius Sinaga, S.H., M.Hum.', 'Bareskrim Polri / Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.6 MB', NULL, NULL,
    1, 2, '2026-09-04 08:00:00', '2026-09-04 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    71, 'res-hanjar-016', 'Hanjar Keadilan Restoratif (Restorative Justice) dalam Penegakan Hukum Pidana Berkeadilan', 2, 'Bahan Ajar Pokok', 'Petunjuk teknis penerapan Perpol No. 8 Tahun 2021 tentang penyelesaian tindak pidana melalui pendekatan keadilan restoratif.',
    'Prof. Dr. Bagus Wicaksono, S.H., LL.M.', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.8 MB', NULL, NULL,
    1, 2, '2026-09-01 08:00:00', '2026-09-01 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    72, 'res-hanjar-017', 'Hanjar Penyidikan Tindak Pidana Korupsi (Tipidkor) dan Tindak Pidana Pencucian Uang (TPPU)', 2, 'Bahan Ajar Pokok', 'Teknik penelusuran aset (asset tracing), audit investigatif kerugian keuangan negara, dan penerapan pembuktian terbalik TPPU.',
    'Kombes Pol. Firman Setyabudi, S.I.K., M.Si.', 'Korps Gadik Reskrim Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.3 MB', NULL, NULL,
    1, 2, '2026-08-28 08:00:00', '2026-08-28 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    73, 'res-hanjar-018', 'Hanjar Penyidikan Tindak Pidana Narkotika, Psikotropika, dan Prekursor Farmasi Ilegal', 2, 'Bahan Ajar Pokok', 'Strategi penyelidikan clandestine lab, controlled delivery, under cover buy, dan pemutusan jaringan sindikat narkotika internasional.',
    'AKBP Rudi Hartono, S.I.K.', 'Direktorat Narkoba / Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.5 MB', NULL, NULL,
    1, 2, '2026-08-22 08:00:00', '2026-08-22 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    74, 'res-hanjar-019', 'Hanjar Penanganan Tindak Pidana Perdagangan Orang (TPPO) dan Penyelundupan Manusia', 2, 'Bahan Ajar Pokok', 'Deteksi modus operandi penempatan PMI non-prosedural, perlindungan saksi/korban, dan penegakan UU TPPO terintegrasi.',
    'AKBP Nurhasanah, S.H., M.H.', 'Subdit TPPO Bareskrim / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.3 MB', NULL, NULL,
    1, 2, '2026-08-15 08:00:00', '2026-08-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    75, 'res-hanjar-020', 'Hanjar Penanganan Tindak Pidana terhadap Perempuan dan Anak (PPA) Berperspektif Korban', 2, 'Bahan Ajar Pokok', 'Standar operasional ruang pelayanan khusus (RPK), diversi bagi anak berhadapan dengan hukum (ABH), dan trauma healing.',
    'AKBP Maria Agustina, S.Psi., M.Si.', 'Pokja PPA Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.9 MB', NULL, NULL,
    1, 2, '2026-08-10 08:00:00', '2026-08-10 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    76, 'res-hanjar-021', 'Hanjar Forensik Kepolisian Modern (DVI, Balistik, Odontologi, dan DNA Forensik)', 2, 'Bahan Ajar Pokok', 'Pemanfaatan sains forensik dalam pembuktian ilmiah perkara pidana (Scientific Crime Investigation) dan penanganan bencana massal.',
    'Kombes Pol. dr. H. Prabowo, Sp.F., DFM.', 'Puslabfor / Pusdokkes Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '9.4 MB', NULL, NULL,
    1, 2, '2026-08-05 08:00:00', '2026-08-05 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    77, 'res-hanjar-022', 'Hanjar Penyidikan Kejahatan Lingkungan Hidup, Kehutanan, dan Pertambangan Ilegal (Tipidter)', 2, 'Bahan Ajar Pokok', 'Tata cara pembuktian pencemaran lingkungan, illegal logging, illegal mining (PETI), serta pelibatan saksi ahli lintas kementerian.',
    'AKBP Denny Pratama, S.I.K., M.H.', 'Dit Tipidter Bareskrim / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.7 MB', NULL, NULL,
    1, 2, '2026-07-30 08:00:00', '2026-07-30 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    78, 'res-hanjar-023', 'Hanjar Sistem Pengamanan Kota (Sispamkota) dan Manajemen Kontinjensi Kamtibmas', 2, 'Bahan Ajar Pokok', 'Simulasi pengerahan pleton lintas fungsi, tahapan status kontinjensi (hijau, kuning, merah), dan komando kendali pengamanan kota.',
    'Kombes Pol. Fajar Nugroho, S.I.K., M.Si.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '7.6 MB', NULL, NULL,
    1, 2, '2026-09-18 08:00:00', '2026-09-18 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    79, 'res-hanjar-024', 'Hanjar Taktik dan Teknik Pengendalian Massa (Dalmas & PHH) Sesuai Perkap HAM', 2, 'Bahan Ajar Pokok', 'Formasi dalmas awal, dalmas lanjut, dan lintas ganti PHH Brimob berpedoman pada asas proporsionalitas dan nesesitas Perkap No. 1/2009.',
    'AKBP Yudi Kristanto, S.I.K.', 'Korps Sabhara Baharkam / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.2 MB', NULL, NULL,
    1, 2, '2026-08-27 08:00:00', '2026-08-27 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    80, 'res-hanjar-025', 'Hanjar Intelijen Keamanan Taktis: Lidik, Pam, Gal, dan Produk Intelijen Satwil', 2, 'Bahan Ajar Pokok', 'Metodologi penyusunan perkiraan intelijen (Kirka), laporan informasi khusus, operasi penggalangan, dan pengamanan tertutup.',
    'Kombes Pol. Drs. Syarifudin, M.Si.', 'Baintelkam Polri / Sespimma',
    'Dipublikasikan', 'Terbatas', 1,
    'PDF', '5.4 MB', NULL, NULL,
    1, 2, '2026-09-09 08:00:00', '2026-09-09 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    81, 'res-hanjar-026', 'Hanjar Analisis Kerawanan Kamtibmas dan Sistem Deteksi Dini (Early Warning System)', 2, 'Bahan Ajar Pokok', 'Pemetaan potensi ambang gangguan (AG), potensi gangguan (PG), dan gangguan nyata (GN) menggunakan instrumen statistik kewilayahan.',
    'AKBP Gunawan Wibisono, S.I.K.', 'Subdit Analisis Intelkam Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.7 MB', NULL, NULL,
    1, 2, '2026-09-03 08:00:00', '2026-09-03 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    82, 'res-hanjar-027', 'Hanjar Pemolisian Masyarakat (Polmas) dan Problem-Oriented Policing (POP)', 2, 'Bahan Ajar Pokok', 'Implementasi kemitraan setara polisi dan warga, model pemecahan masalah SARA (Scanning, Analysis, Response, Assessment).',
    'Kombes Pol. Anang Sutrisno, S.I.K., M.Hum.', 'Korbinmas Baharkam Polri / Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '4.1 MB', NULL, NULL,
    1, 2, '2026-08-16 08:00:00', '2026-08-16 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    83, 'res-hanjar-028', 'Hanjar Manajemen Lalu Lintas Terpadu, Penegakan Hukum ETLE, dan Smart Mobility', 2, 'Bahan Ajar Pokok', 'Pengelolaan Kamseltibcarlantas modern melalui Electronic Traffic Law Enforcement (ETLE) statis & mobile serta olah TKP TAA.',
    'Kombes Pol. Ir. Danang Setiawan, M.T.', 'Korlantas Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.8 MB', NULL, NULL,
    1, 2, '2026-08-19 08:00:00', '2026-08-19 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    84, 'res-hanjar-029', 'Hanjar Manajemen Pengamanan Objek Vital Nasional (Obvitnas) dan Pengamanan VIP/VVIP', 2, 'Bahan Ajar Pokok', 'Standar pengamanan instalasi industri strategis, bandara/pelabuhan, lembaga negara, serta protokoler pengawalan tamu penting negara.',
    'AKBP Teguh Prasetyo, S.I.K.', 'Ditpamobvit Baharkam / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.3 MB', NULL, NULL,
    1, 2, '2026-08-12 08:00:00', '2026-08-12 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    85, 'res-hanjar-030', 'Hanjar Penanganan Terorisme, Radikalisme, dan Intoleransi Berbasis Preventive Strike', 2, 'Bahan Ajar Pokok', 'Langkah mitigasi sel tidur terorisme, monitoring pendanaan terorisme (CFT), serta program kontra-radikalisasi di wilayah rentan.',
    'Kombes Pol. Dr. A. Harun, S.I.K., M.A.', 'Densus 88 AT / Korps Gadik Sespimma',
    'Dipublikasikan', 'Terbatas', 1,
    'PDF', '6.5 MB', NULL, NULL,
    1, 2, '2026-08-08 08:00:00', '2026-08-08 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    86, 'res-hanjar-031', 'Hanjar Taktik Negosiasi Krisis, Penyanderaan, dan Mediasi Konflik Massa', 2, 'Bahan Ajar Pokok', 'Komunikasi taktis peredaan ketegangan, profiling psikologis penyandera, teknik tawar-menawar waktu, dan koordinasi dengan tim serbu.',
    'AKBP Siti Rahmawati, S.Psi., M.Psi.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.4 MB', NULL, NULL,
    1, 2, '2026-08-02 08:00:00', '2026-08-02 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    87, 'res-hanjar-032', 'Hanjar Penerapan Standar Hak Asasi Manusia (HAM) dalam Pelaksanaan Tugas Polri', 2, 'Bahan Ajar Pokok', 'Implementasi Perkap No. 8 Tahun 2009 tentang implementasi prinsip dan standar HAM dalam penyelenggaraan tugas kepolisian.',
    'Prof. Dr. H. Soeprapto, S.H., M.Hum.', 'Divkum Polri / Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '4.8 MB', NULL, NULL,
    1, 2, '2026-09-11 08:00:00', '2026-09-11 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    88, 'res-hanjar-033', 'Hanjar Hukum Acara Pidana Lanjutan dan Praktik Pembelaan Praperadilan Satker', 2, 'Bahan Ajar Pokok', 'Tata cara penyusunan tanggapan, pembuktian keabsahan penangkapan, penahanan, penggeledahan, dan penetapan tersangka di praperadilan.',
    'Kombes Pol. Sulistyo Raharjo, S.H., M.H.', 'Bidkum Polda / Korps Gadik Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.0 MB', NULL, NULL,
    1, 2, '2026-09-07 08:00:00', '2026-09-07 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    89, 'res-hanjar-034', 'Hanjar Diskresi Kepolisian, Akuntabilitas Hukum, dan Perlindungan Anggota Polri', 2, 'Bahan Ajar Pokok', 'Batasan yuridis penggunaan diskresi kepolisian berdasarkan Pasal 18 UU No. 2 Tahun 2002 dan pertanggungjawaban profesi.',
    'AKBP Dr. Hendro Utomo, S.H., M.Kn.', 'Divkum Polri / Bag Bangdik Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.5 MB', NULL, NULL,
    1, 2, '2026-08-29 08:00:00', '2026-08-29 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    90, 'res-hanjar-035', 'Hanjar Tindak Pidana Pemilu, Pilkada Serentak, dan Sentra Penegakan Hukum Terpadu (Gakkumdu)', 2, 'Bahan Ajar Pokok', 'Kordinasi tripartit Polri, Bawaslu, dan Kejaksaan dalam penanganan politik uang, manipulasi suara, dan sengketa pidana pemilu.',
    'Kombes Pol. Eko Suwarno, S.I.K., M.H.', 'Dittipidum Bareskrim / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.9 MB', NULL, NULL,
    1, 2, '2026-08-24 08:00:00', '2026-08-24 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    91, 'res-hanjar-036', 'Hanjar Analisis Perkembangan Lingkungan Strategis (Banglingstra) Nasional, Regional, dan Global', 2, 'Bahan Ajar Pokok', 'Pengaruh dinamika geopolitik Laut Cina Selatan, konflik kawasan, perang siber, dan stabilitas makroekonomi terhadap kamtibmas.',
    'Brigjen Pol. Prof. Dr. Irawan Setiadi, S.H., M.H.', 'Lemhannas RI / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.1 MB', NULL, NULL,
    1, 2, '2026-08-14 08:00:00', '2026-08-14 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    92, 'res-hanjar-037', 'Hanjar Wawasan Kebangsaan, Ketahanan Nasional, dan Deradikalisasi Pemikiran', 2, 'Bahan Ajar Pokok', 'Pengamalan Empat Konsensus Dasar Bangsa (Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika) dalam pembinaan masyarakat majemuk.',
    'Kolonel Inf. (Purn) Dr. R. Subekti / Tim Pokja Bangdik', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '4.0 MB', NULL, NULL,
    1, 2, '2026-08-09 08:00:00', '2026-08-09 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    93, 'res-hanjar-038', 'Hanjar Smart Policing: Transformasi Digital Menuju Pelayanan Polri Presisi', 2, 'Bahan Ajar Pokok', 'Konsep integrasi teknologi sensor IoT, CCTV analitik cerdas, Command Center, dan aplikasi pelayanan kepolisian online.',
    'Kombes Pol. Dr. Riza Pahlevi, S.T., M.Kom.', 'Div TIK Polri / Pokja Inovasi Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '7.4 MB', NULL, NULL,
    1, 2, '2026-09-17 08:00:00', '2026-09-17 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    94, 'res-hanjar-039', 'Hanjar Artificial Intelligence dan Big Data Analytics untuk Pemolisian Prediktif', 2, 'Bahan Ajar Pokok', 'Pemanfaatan machine learning dan geospatial predictive mapping dalam mendeteksi klaster kejahatan serta optimalisasi rute patroli.',
    'AKBP Dewi Suryani, S.H., S.I.K., M.Kom.', 'Pokja SIPINTAR Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '6.9 MB', NULL, NULL,
    1, 2, '2026-09-25 08:00:00', '2026-09-25 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    95, 'res-hanjar-040', 'Hanjar Perlindungan Data Pribadi (UU PDP) dan Tata Kelola Keamanan Siber Satker', 2, 'Bahan Ajar Pokok', 'Kewajiban kepatuhan pengendali data publik kepolisian sesuai UU No. 27 Tahun 2022 serta audit celah keamanan jaringan satker.',
    'AKBP Indra Gunawan, S.Kom., M.T.', 'Div TIK Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.5 MB', NULL, NULL,
    1, 2, '2026-08-21 08:00:00', '2026-08-21 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    96, 'res-hanjar-041', 'Hanjar Tata Kelola Sumber Belajar Digital Terpadu SIPINTAR Sespimma', 2, 'Bahan Ajar Pokok', 'Pedoman pemanfaatan platform repositori digital, klasifikasi hak cipta, alur kurasi naskah ajar, dan standarisasi metadata berkas.',
    'Tim Perumus SIPINTAR Nawasena XXIX', 'Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '5.3 MB', NULL, NULL,
    1, 2, '2026-10-02 08:00:00', '2026-10-02 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    97, 'res-hanjar-042', 'Hanjar Manajemen Krisis Terorisme dan Komando Tanggap Darurat Taktis', 2, 'Bahan Ajar Pokok', 'Integrasi Incident Command System (ICS), koordinasi satuan elit penindak, isolasi perimeter TKP, dan penanganan korban krisis.',
    'Kombes Pol. M. Ridwan, S.I.K., M.Si.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Terbatas', 1,
    'PDF', '6.1 MB', NULL, NULL,
    1, 2, '2026-07-25 08:00:00', '2026-07-25 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    98, 'res-hanjar-043', 'Hanjar Penanganan Kejahatan Lintas Negara (Transnational Crime) & Interpol Red Notice', 2, 'Bahan Ajar Pokok', 'Mekanisme kerja sama NCB Interpol Indonesia, perjanjian ekstradisi, Mutual Legal Assistance (MLA), dan perburuan buronan antarnegara.',
    'Kombes Pol. Ahmad Zarkasih, S.H., LL.M.', 'Divhubinter Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '5.6 MB', NULL, NULL,
    1, 2, '2026-08-04 08:00:00', '2026-08-04 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    99, 'res-hanjar-044', 'Hanjar Manajemen Kemitraan Tiga Pilar Kamtibmas (Kades, Babinsa, Bhabinkamtibmas)', 2, 'Bahan Ajar Pokok', 'Sinergi pencegahan kejahatan tingkat desa/kelurahan, penyelesaian sengketa agraria warga, dan ketahanan sosial masyarakat.',
    'AKBP Bambang Sukoco, S.Sos., M.AP.', 'Korbinmas Baharkam / Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PDF', '3.8 MB', NULL, NULL,
    1, 2, '2026-08-11 08:00:00', '2026-08-11 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    100, 'res-hanjar-045', 'Hanjar Scientific Crime Investigation (SCI) pada Penanganan Tempat Kejadian Perkara (TKP)', 2, 'Bahan Ajar Pokok', 'Prinsip pengamanan status quo TKP, pengambilan sampel mikro, chain of custody barang bukti, dan rekonstruksi berbasis bukti ilmiah.',
    'Kombes Pol. Dr. Hendra Pratama, S.I.K., M.Si.', 'Pusinafis Bareskrim / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '7.8 MB', NULL, NULL,
    1, 2, '2026-08-17 08:00:00', '2026-08-17 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    101, 'res-hanjar-046', 'Hanjar Penegakan Kode Etik Profesi Polri (KKEP), Komisi Disiplin, dan Rehabilitasi Personel', 2, 'Bahan Ajar Pokok', 'Tata laksana sidang Komisi Kode Etik Polri (KKEP), mekanisme banding etik, sanksi PTDH, serta pembinaan pemulihan profesi.',
    'Kombes Pol. H. Marzuki, S.H., S.I.K.', 'Divpropam Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '4.7 MB', NULL, NULL,
    1, 2, '2026-08-26 08:00:00', '2026-08-26 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    102, 'res-hanjar-047', 'Bahan Tayang Kepemimpinan Strategis Polri Modern di Era Society 5.0', 2, 'Slide Presentasi', 'Paparan infografis dan matriks kompetensi kepemimpinan adaptif perwira polri menghadapi disrupsi teknologi kemasyarakatan.',
    'Kombes Pol. Dr. Hendra Pratama, S.I.K., M.Si.', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PPTX', '22.1 MB', NULL, NULL,
    1, 2, '2026-09-19 08:00:00', '2026-09-19 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    103, 'res-hanjar-048', 'Bahan Tayang Cyber Threat Intelligence, Malware Analysis, and Incident Response', 2, 'Slide Presentasi', 'Materi visual taktik penanganan insiden kebocoran data, diagram analisis malware, dan alur triage respons darurat siber.',
    'AKBP Dewi Suryani, S.H., S.I.K., M.Kom.', 'Korps Gadik Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PPTX', '26.8 MB', NULL, NULL,
    1, 2, '2026-09-23 08:00:00', '2026-09-23 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    104, 'res-hanjar-049', 'Bahan Tayang Restorative Justice: Implementasi Perpol No. 8 Tahun 2021', 2, 'Slide Presentasi', 'Rangkuman alur skematis proses mediasi keadilan restoratif, syarat materiil dan formil penghentian penyidikan (SP3 RJ).',
    'Prof. Dr. Bagus Wicaksono, S.H., LL.M.', 'Bag Bangdik Sespimma',
    'Dipublikasikan', 'Terbuka', 1,
    'PPTX', '14.2 MB', NULL, NULL,
    1, 2, '2026-09-02 08:00:00', '2026-09-02 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    105, 'res-hanjar-050', 'Bahan Tayang Taktik Komando Pengendalian Lapangan (Kodal) Sispamkota', 2, 'Slide Presentasi', 'Peta visual simulasi penempatan sekat zona penyekatan, rute escape VVIP, dan pola komunikasi radio taktis Kodal.',
    'Kombes Pol. Agus Suryanto, S.I.K., M.Si.', 'Subbag Latsat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PPTX', '19.5 MB', NULL, NULL,
    1, 2, '2026-09-12 08:00:00', '2026-09-12 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    106, 'res-hanjar-051', 'Bahan Tayang Big Data Analytics dan Pemetaan Heatmap Kejahatan Kewilayahan', 2, 'Slide Presentasi', 'Studi kasus integrasi data kriminalitas DORS dan visualisasi spasial hotspot rawan street crime di polres perkotaan.',
    'Kombes Pol. Dr. Riza Pahlevi, S.T., M.Kom.', 'Div TIK Polri / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PPTX', '24.6 MB', NULL, NULL,
    1, 2, '2026-09-16 08:00:00', '2026-09-16 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    107, 'res-hanjar-052', 'Bahan Tayang Protokol Pengamanan Sidang Pleno Pemilu dan Objek Vital Penyelenggara', 2, 'Slide Presentasi', 'Paparan pembagian Ring 1, 2, 3 pengamanan gedung KPU/Bawaslu, sterilisasi Jibom, dan SOP pemeriksaan badan tamu.',
    'AKBP Teguh Prasetyo, S.I.K.', 'Ditpamobvit / Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PPTX', '16.7 MB', NULL, NULL,
    1, 2, '2026-08-23 08:00:00', '2026-08-23 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    108, 'res-hanjar-053', 'Lembar Kerja Gladi Posko Taktis: Penanganan Eskalasi Konflik Komunal Kewilayahan', 2, 'Lembar Kerja Peserta Didik', 'Skenario latihan simulasi pengambilan keputusan kapolres saat menghadapi kerusuhan massa antarkelompok warga di wilayah rawan.',
    'Tim Pokja Gladi Posko Sespimma', 'Bag Jarlat Sespimma Lemdiklat Polri',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.8 MB', NULL, NULL,
    1, 2, '2026-09-21 08:00:00', '2026-09-21 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    109, 'res-hanjar-054', 'Panduan Penugasan Praktik Lapangan (KKL) Manajemen Operasional Satwil Polres', 2, 'Lembar Kerja Peserta Didik', 'Petunjuk teknis pengumpulan data lapangan, wawancara kapolres/para kabag, serta instrumen analisis SWOT satker tujuan KKL.',
    'Subbag Renlat Bag Jarlat Sespimma', 'Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '3.1 MB', NULL, NULL,
    1, 2, '2026-09-13 08:00:00', '2026-09-13 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    110, 'res-hanjar-055', 'Lembar Kerja Studi Kasus (Case Study): Pengawasan Penyidikan Perkara Menonjol', 2, 'Lembar Kerja Peserta Didik', 'Bahan telaah berkas perkara fiktif untuk melatih ketajaman serdik dalam mendeteksi kelemahan alat bukti dan potensi gugatan.',
    'Tim Gadik Reskrim Sespimma', 'Korps Gadik Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'PDF', '2.4 MB', NULL, NULL,
    1, 2, '2026-08-31 08:00:00', '2026-08-31 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    111, 'res-hanjar-056', 'Lembar Kerja Simulasi Rencana Pengamanan Pemilukada Serentak (Renpam)', 2, 'Lembar Kerja Peserta Didik', 'Template penyusunan tabulasi pengerahan personel per-TPS, plotting rute distribusi logistik kotak suara, dan kontinjensi.',
    'Bag Jarlat Sespimma Lemdiklat Polri', 'Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'DOCX', '1.5 MB', NULL, NULL,
    1, 2, '2026-08-20 08:00:00', '2026-08-20 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    112, 'res-hanjar-057', 'Lembar Kerja Penyusunan Rencana Operasi Khusus Kewilayahan Tingkat Polres', 2, 'Lembar Kerja Peserta Didik', 'Formulir latihan komprehensif penyusunan Rencana Operasi (Renops) Pekat, Patuh, Zebra, dan Lilin di tingkat polres.',
    'Subbag Latsat Sespimma', 'Bag Jarlat Sespimma',
    'Dipublikasikan', 'Internal', 1,
    'DOCX', '1.8 MB', NULL, NULL,
    1, 2, '2026-08-15 08:00:00', '2026-08-15 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    113, 'res-hanjar-058', 'Rancangan Modul Mitigasi Bencana Megathrust dan Tsunami di Wilayah Pesisir', 2, 'Draf Modul Baru', 'Naskah draf kurikulum taktik evakuasi massal kepolisian, jalur penyelamatan darurat, dan koordinasi SAR terpadu BNPB/TNI.',
    'Tim Ahli Manajemen Krisis Lemdiklat', 'Bag Bangdik Sespimma Lemdiklat Polri',
    'Draft', 'Internal', 1,
    'DOCX', '1.1 MB', NULL, NULL,
    1, NULL, '2026-10-11 08:00:00', '2026-10-11 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    114, 'res-hanjar-059', 'Rancangan Modul Penanggulangan Serangan Ransomware pada Infrastruktur Pelayanan Publik Polri', 2, 'Draf Modul Baru', 'Draf panduan tanggap darurat dekripsi sistem, pemulihan cold backup server, dan investigasi forensik digital serangan ransomware.',
    'Pokja Keamanan Sistem Sespimma', 'Div TIK Polri / Sespimma',
    'Draft', 'Terbatas', 1,
    'DOCX', '950 KB', NULL, NULL,
    1, NULL, '2026-10-09 08:00:00', '2026-10-09 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    115, 'res-hanjar-060', 'Hanjar Taktik Penindakan Huru-Hara Format Lama (Edisi 2019 - Arsip Doktrin)', 2, 'Bahan Ajar Terdahulu', 'Bahan ajar doktrin penanganan huru-hara terdahulu yang diarsipkan sebagai materi pembanding evaluasi doktrin pemolisian humanis.',
    'Subbag Latsat Bag Jarlat Sespimma', 'Bag Jarlat Sespimma',
    'Arsip', 'Terbatas', 1,
    'PDF', '7.1 MB', NULL, NULL,
    1, NULL, '2019-11-20 08:00:00', '2019-11-20 08:00:00'
  );
INSERT INTO `resources` (
    `id`, `uuid`, `title`, `category_id`, `sub_category_text`, `description`,
    `author_or_instructor`, `unit_or_source`, `lifecycle_status`, `access_classification`,
    `has_digital_file`, `file_format`, `file_size_label`, `file_url`, `physical_location`,
    `created_by`, `verified_by`, `published_at`, `created_at`
  ) VALUES (
    116, 'res-hanjar-061', 'Hanjar Sistem Pembinaan Karier Perwira Polri Pola Lama (Edisi 2018 - Rujukan Doktrin)', 2, 'Bahan Ajar Terdahulu', 'Naskah ajar pembinaan personel periode regulasi sebelum penerapan sistem merit 13 komponen terintegrasi, disimpan untuk arsip.',
    'Bag Bangdik Sespimma Lemdiklat Polri', 'Bag Bangdik Sespimma',
    'Arsip', 'Terbatas', 1,
    'PDF', '5.9 MB', NULL, NULL,
    1, NULL, '2018-09-10 08:00:00', '2018-09-10 08:00:00'
  );

-- Insert Unique Tags
INSERT INTO `tags` (`id`, `tag_name`) VALUES (1, 'Hanjar 2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (2, 'Sektor Pangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (3, 'Ketahanan Pangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (4, 'Swasembada');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (5, 'Bahan Ajar Pokok');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (6, 'Kehumasan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (7, 'Media Management');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (8, 'Komunikasi Publik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (9, 'Citra Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (10, 'TP Narkoba');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (11, 'Penyidikan Narkoba');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (12, 'Bareskrim');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (13, 'Narkotika');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (14, 'Judi Online');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (15, 'TP Judol');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (16, 'Cyber Crime');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (17, 'TPPU');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (18, 'Manusia & Peradaban');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (19, 'Filsafat Hukum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (20, 'Etika');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (21, 'Kemanusiaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (22, 'Inovasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (23, 'Kreatifitas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (24, 'Proper');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (25, 'Akselerasi Layanan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (26, 'TP Korupsi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (27, 'Tipidkor');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (28, 'Asset Recovery');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (29, 'Audit Forensik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (30, 'Analisis SWOT');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (31, 'AHP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (32, 'Metodologi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (33, 'Pengambilan Keputusan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (34, 'Manajemen Keuangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (35, 'DIPA Satker');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (36, 'Perwabkeu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (37, 'Akuntabilitas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (38, 'Manajemen Logistik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (39, 'Sarpras');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (40, 'Alsus');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (41, 'BMN Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (42, 'Penegakan HAM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (43, 'Hukum & Keadilan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (44, 'Perkap HAM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (45, 'Due Process of Law');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (46, 'Fungsi Intelkam');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (47, 'Standar Keberhasilan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (48, 'Deteksi Dini');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (49, 'Intelijen');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (50, 'Fungsi Binmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (51, 'Bhabinkamtibmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (52, 'Polmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (53, 'Harkamtibmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (54, 'Manajemen SDM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (55, 'Sistem Merit');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (56, '13 Komponen');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (57, 'Pembinaan Personel');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (58, 'Kepemimpinan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (59, 'Strategis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (60, 'Manajemen Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (61, '978-623-95841-0-2');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (62, '658.7 DEW m 2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (63, 'Koleksi Buku Fisik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (64, 'Logistik & Manajemen Aset');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (65, 'Koleksi Fisik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (66, 'Logistik Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (67, 'Manajemen Aset');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (68, 'Pengadaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (69, 'BMN');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (70, '978-623-112-401-3');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (71, '301.1 HEN s 2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (72, 'Sosiologi Hukum & Humaniora');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (73, 'Sosiologi Hukum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (74, 'Peradaban');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (75, 'Kamtibmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (76, 'Humaniora');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (77, '978-602-53218-9-3');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (78, '327.12 DID s 2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (79, 'Intelijen & Keamanan Khusus');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (80, 'Intelkam');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (81, 'Kirpat');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (82, 'Intelijen Taktis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (83, '978-623-01-2894-3');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (84, '345.02 DHA p 2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (85, 'Hukum Acara & Tipikor');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (86, 'Tipikor');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (87, 'Asset Tracing');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (88, 'Audit Investigasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (89, '978-602-53218-4-8');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (90, '303.34 CHR k 2024 (E)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (91, 'E-Book');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (92, 'Kepemimpinan Strategis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (93, 'Transformasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (94, 'Kultur Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (95, 'Etika Profesi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (96, '978-623-231-892-1');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (97, '345.05 WIC p 2025 (E)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (98, 'Hukum Pidana & HAM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (99, 'Hukum Pidana');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (100, 'HAM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (101, 'Restorative Justice');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (102, 'Penyidikan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (103, '978-602-74892-7-5');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (104, '364.168 DIN i 2025 (E)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (105, 'Siber & Forensik Digital');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (106, 'Cybercrime');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (107, 'Forensik Digital');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (108, 'Bukti Elektronik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (109, '978-623-88012-9-1');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (110, '351.74 RAH i 2025 (E)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (111, 'Smart Policing & Inovasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (112, 'Smart Policing');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (113, 'Digitalisasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (114, '978-623-95841-1-9');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (115, '001.42 SES m 2026');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (116, 'Karya Tulis Kepolisian (Taskap)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (117, 'Pedoman Penulisan Ilmiah');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (118, 'Taskap');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (119, 'Karya Tulis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (120, 'SWOT');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (121, 'TASKAP-SESPIMMA-2026-084');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (122, 'TSKP-2026 RAM o');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (123, 'Inovasi Pelayanan Kamtibmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (124, 'AI Pelayanan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (125, 'Polres Presisi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (126, 'Serdik Sespimma');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (127, 'TASKAP-SESPIMMA-2025-042');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (128, 'TSKP-2025 WAR m');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (129, 'Resolusi Konflik & Binmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (130, 'Konflik Sosial');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (131, 'Mediasi Agraria');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (132, 'Binmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (133, 'ISSN 2548-9127 (Vol. 12 No. 2)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (134, 'JRNL-SESPIMMA-2026');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (135, 'Jurnal Ilmiah Terbitan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (136, 'Jurnal Ilmu Kepolisian');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (137, 'Jurnal Ilmiah');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (138, 'Terbitan Berkala');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (139, 'Riset Kepolisian');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (140, 'ISSN');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (141, 'ISSN 2614-3852 (Vol. 8 No. 1)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (142, 'JRNL-MNJM-2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (143, 'Jurnal Manajemen Publik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (144, 'Meritokrasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (145, 'ISSN 2722-1040 (Edisi Khusus)');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (146, 'JRNL-HUMAS-2025');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (147, 'Jurnal Komunikasi & Kehumasan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (148, 'Mitigasi Krisis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (149, 'SOP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (150, 'Evaluasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (151, 'Sidang Akademik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (152, 'KOMBES POL');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (153, 'Anjak Madya');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (154, 'Eselon II B3');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (155, 'Golongan IV-C');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (156, 'NRP 72010235');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (157, 'Widyaiswara Madya Tk. III');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (158, 'NRP 79040926');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (159, 'NRP 76030911');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (160, 'NRP 76110038');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (161, 'NRP 78081568');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (162, 'NRP 74090553');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (163, 'AKBP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (164, 'Gadik Madya');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (165, 'Eselon III A2');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (166, 'Golongan IV-B');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (167, 'NRP 70070807');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (168, 'NRP 73040574');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (169, 'NRP 76071042');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (170, 'Widyaiswara Muda Tk. I');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (171, 'Golongan IV-A');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (172, 'NRP 82071408');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (173, 'NRP 87061679');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (174, 'NRP 84111638');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (175, 'KOMPOL');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (176, 'NRP 74030201');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (177, 'NRP 88021042');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (178, 'Eselon III B');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (179, 'Golongan III-C');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (180, 'NRP 88110791');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (181, 'IPTU');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (182, 'Widyaiswara Pratama Tk. I');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (183, 'Eselon IV B');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (184, 'Golongan III-B');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (185, 'NRP 83091326');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (186, 'Pedoman');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (187, 'Mediasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (188, 'Hanjar');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (189, 'Draf');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (190, 'Pemilu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (191, 'Kurikulum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (192, 'Standar Kompetensi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (193, 'Silabus');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (194, 'SPM');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (195, 'Mutu Pendidikan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (196, 'Standar');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (197, 'Perpustakaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (198, 'Peminjaman');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (199, 'Manual Book');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (200, 'Panduan Serdik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (201, 'SIPINTAR');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (202, 'Tata Kelola');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (203, 'SOP Admin');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (204, 'Klasifikasi Akses');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (205, 'Arsip');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (206, 'Doktrin Terdahulu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (207, 'Hanjar Lama');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (208, 'Juknis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (209, 'Tidak Aktif');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (210, 'Keterampilan Lapangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (211, 'Kepemimpinan Visioner');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (212, 'Taktis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (213, 'Manajemen');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (214, 'Integritas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (215, 'Moralitas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (216, 'Kode Etik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (217, 'Kepemimpinan Transformasional');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (218, 'Manajemen Perubahan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (219, 'Satwil');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (220, 'Humas Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (221, 'Reputasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (222, 'Budaya Organisasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (223, 'Pelayanan Prima');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (224, 'Revolusi Mental');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (225, 'MOK');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (226, 'Operasi Kepolisian');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (227, 'Manajemen Operasional');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (228, 'Kontinjensi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (229, 'Bencana Alam');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (230, 'Tanggap Darurat');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (231, 'Renstra');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (232, 'Renja');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (233, 'Perencanaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (234, 'Polres');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (235, 'Polsek');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (236, 'DIPA');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (237, 'Keuangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (238, 'Logistik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (239, 'Pengadaan Barang Jasa');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (240, 'SDM Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (241, 'Pembinaan Karir');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (242, 'Wasrik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (243, 'SAKIP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (244, 'Pengawasan Internal');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (245, 'Audit');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (246, 'Wassidik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (247, 'Gelar Perkara');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (248, 'Reskrim');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (249, 'Akuntabilitas Penyidikan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (250, 'Perpol 8 2021');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (251, 'Mediasi Penal');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (252, 'Korupsi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (253, 'Narkoba');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (254, 'Controlled Delivery');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (255, 'Psikotropika');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (256, 'TPPO');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (257, 'Perdagangan Orang');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (258, 'Perlindungan Korban');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (259, 'PPA');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (260, 'Perlindungan Anak');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (261, 'Diversi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (262, 'Hak Perempuan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (263, 'Forensik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (264, 'DVI');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (265, 'DNA Forensik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (266, 'Balistik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (267, 'Puslabfor');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (268, 'Tipidter');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (269, 'Lingkungan Hidup');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (270, 'Tambang Ilegal');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (271, 'Illegal Logging');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (272, 'Sispamkota');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (273, 'Pengamanan Kota');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (274, 'Taktis Lapangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (275, 'Dalmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (276, 'PHH');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (277, 'Unjuk Rasa');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (278, 'Pengendalian Massa');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (279, 'Kirka');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (280, 'Lidik Pam Gal');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (281, 'Kerawanan Kamtibmas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (282, 'Early Warning');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (283, 'Community Policing');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (284, 'POP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (285, 'Lalu Lintas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (286, 'ETLE');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (287, 'Kamseltibcarlantas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (288, 'Smart Mobility');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (289, 'Obvitnas');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (290, 'Pengamanan VIP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (291, 'Pamobvit');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (292, 'Instalasi Strategis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (293, 'Terorisme');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (294, 'Radikalisme');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (295, 'Preventive Strike');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (296, 'Densus 88');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (297, 'Negosiasi Krisis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (298, 'Penyanderaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (299, 'Psikologi Taktis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (300, 'Perkap 8 2009');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (301, 'Standar Internasional');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (302, 'Etika Penegakan Hukum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (303, 'Hukum Acara Pidana');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (304, 'KUHAP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (305, 'Praperadilan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (306, 'Advokasi Hukum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (307, 'Diskresi Kepolisian');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (308, 'UU No 2 2002');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (309, 'Perlindungan Hukum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (310, 'Gakkumdu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (311, 'Pilkada');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (312, 'Bawaslu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (313, 'Tipidum');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (314, 'Banglingstra');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (315, 'Geopolitik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (316, 'Ketahanan Nasional');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (317, 'Keamanan Global');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (318, 'Wawasan Kebangsaan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (319, 'Bhinneka Tunggal Ika');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (320, 'Pancasila');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (321, 'Transformasi Digital');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (322, 'Polri Presisi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (323, 'Command Center');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (324, 'Artificial Intelligence');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (325, 'Big Data');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (326, 'Predictive Policing');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (327, 'Geospatial');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (328, 'UU PDP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (329, 'Data Pribadi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (330, 'Keamanan Siber');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (331, 'Kepatuhan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (332, 'Tata Kelola Digital');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (333, 'Nawasena XXIX');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (334, 'Repositori');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (335, 'Manajemen Krisis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (336, 'Komando Tanggap Darurat');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (337, 'ICS');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (338, 'Transnational Crime');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (339, 'Interpol');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (340, 'Red Notice');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (341, 'Ekstradisi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (342, 'MLA');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (343, 'Tiga Pilar');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (344, 'Babinsa');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (345, 'Kemitraan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (346, 'SCI');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (347, 'Olah TKP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (348, 'Pusinafis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (349, 'Chain of Custody');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (350, 'Inafis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (351, 'KKEP');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (352, 'Propam');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (353, 'Disiplin Polri');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (354, 'PTDH');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (355, 'Slide Hanjar');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (356, 'Society 5.0');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (357, 'Presentasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (358, 'Slide Presentasi');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (359, 'Malware');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (360, 'Incident Response');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (361, 'Kodal');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (362, 'Heatmap');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (363, 'DORS');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (364, 'Analisis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (365, 'Pengamanan Pemilu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (366, 'KPU');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (367, 'Lembar Kerja');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (368, 'LKPD');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (369, 'Gladi Posko');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (370, 'Simulasi Taktis');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (371, 'Serdik');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (372, 'KKL');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (373, 'Praktik Lapangan');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (374, 'Manajemen Polres');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (375, 'Studi Kasus');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (376, 'Case Study');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (377, 'Renpam');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (378, 'Simulasi Pemilu');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (379, 'Operasi Mantap');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (380, 'Renops');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (381, 'Operasi Khusus');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (382, 'Kabag Ops');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (383, 'Draf Modul');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (384, 'Megathrust');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (385, 'SAR');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (386, 'Polair');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (387, 'Ransomware');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (388, 'Cyber Security');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (389, 'Backup');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (390, 'Huru Hara');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (391, 'Pembinaan Karier');
INSERT INTO `tags` (`id`, `tag_name`) VALUES (392, 'Rujukan');

-- Insert Resource-Tag Junctions
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (1, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (1, 2);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (1, 3);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (1, 4);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (1, 5);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (2, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (2, 6);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (2, 7);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (2, 8);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (2, 9);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (3, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (3, 10);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (3, 11);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (3, 12);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (3, 13);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (4, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (4, 14);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (4, 15);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (4, 16);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (4, 17);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (5, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (5, 18);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (5, 19);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (5, 20);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (5, 21);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (6, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (6, 22);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (6, 23);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (6, 24);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (6, 25);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (7, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (7, 26);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (7, 27);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (7, 28);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (7, 29);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (8, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (8, 30);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (8, 31);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (8, 32);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (8, 33);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (9, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (9, 34);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (9, 35);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (9, 36);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (9, 37);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (10, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (10, 38);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (10, 39);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (10, 40);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (10, 41);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (11, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (11, 42);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (11, 43);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (11, 44);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (11, 45);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (12, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (12, 46);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (12, 47);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (12, 48);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (12, 49);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (13, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (13, 50);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (13, 51);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (13, 52);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (13, 53);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (14, 1);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (14, 54);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (14, 55);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (14, 56);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (14, 57);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (15, 58);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (15, 59);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (15, 60);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 61);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 62);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 63);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 64);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 65);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 66);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 67);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 68);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (16, 69);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 70);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 71);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 63);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 72);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 65);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 73);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 74);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 75);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (17, 76);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 77);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 78);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 63);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 79);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 65);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 80);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 48);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 81);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (18, 82);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 83);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 84);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 63);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 85);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 65);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 86);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 87);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (19, 88);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 89);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 90);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 92);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 58);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 93);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 94);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (20, 95);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 96);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 97);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 98);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 99);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 100);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 101);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (21, 102);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 103);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 104);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 105);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 106);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 14);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 107);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (22, 108);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 109);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 110);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 111);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 91);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 22);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 112);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 23);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (23, 113);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 114);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 115);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 116);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 117);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 118);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 119);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 32);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 120);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (24, 31);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 121);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 122);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 116);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 123);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 118);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 119);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 124);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 125);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (25, 126);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 127);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 128);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 116);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 129);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 118);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 119);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 130);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 131);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (26, 132);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 133);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 134);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 135);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 136);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 137);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 138);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 139);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (27, 140);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 141);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 142);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 135);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 143);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 137);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 54);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 58);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (28, 144);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 145);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 146);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 135);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 147);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 137);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 6);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 8);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (29, 148);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (30, 149);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (30, 150);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (30, 151);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (31, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (31, 153);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (31, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (31, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (31, 156);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (32, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (32, 157);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (32, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (32, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (32, 158);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (33, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (33, 157);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (33, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (33, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (33, 159);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (34, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (34, 157);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (34, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (34, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (34, 160);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (35, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (35, 157);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (35, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (35, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (35, 161);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (36, 152);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (36, 157);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (36, 154);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (36, 155);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (36, 162);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (37, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (37, 164);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (37, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (37, 166);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (37, 167);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (38, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (38, 164);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (38, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (38, 166);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (38, 168);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (39, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (39, 164);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (39, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (39, 166);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (39, 169);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (40, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (40, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (40, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (40, 171);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (40, 172);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (41, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (41, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (41, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (41, 171);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (41, 173);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (42, 163);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (42, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (42, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (42, 171);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (42, 174);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (43, 175);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (43, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (43, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (43, 171);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (43, 176);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (44, 175);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (44, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (44, 165);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (44, 171);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (44, 177);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (45, 175);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (45, 170);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (45, 178);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (45, 179);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (45, 180);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (46, 181);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (46, 182);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (46, 183);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (46, 184);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (46, 185);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (47, 186);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (47, 118);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (47, 32);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (48, 130);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (48, 187);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (48, 188);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (49, 49);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (49, 189);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (49, 190);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (50, 191);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (50, 192);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (50, 193);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (51, 194);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (51, 195);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (51, 196);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (52, 149);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (52, 197);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (52, 198);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (53, 199);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (53, 200);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (53, 201);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (54, 202);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (54, 203);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (54, 204);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (55, 205);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (55, 206);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (55, 207);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (56, 208);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (56, 209);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (56, 210);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (57, 211);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (57, 33);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (57, 212);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (57, 213);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (58, 95);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (58, 214);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (58, 215);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (58, 216);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (59, 217);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (59, 218);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (59, 219);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (60, 8);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (60, 7);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (60, 220);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (60, 221);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (61, 222);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (61, 223);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (61, 224);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (62, 225);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (62, 226);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (62, 227);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (62, 219);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (63, 228);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (63, 229);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (63, 230);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (63, 75);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (64, 231);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (64, 232);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (64, 233);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (64, 234);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (64, 235);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (65, 236);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (65, 237);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (65, 36);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (65, 37);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (66, 238);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (66, 39);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (66, 239);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (66, 40);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (67, 240);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (67, 55);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (67, 241);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (67, 56);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (68, 242);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (68, 243);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (68, 244);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (68, 245);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (69, 16);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (69, 107);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (69, 102);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (69, 108);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (70, 246);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (70, 247);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (70, 248);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (70, 249);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (71, 101);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (71, 250);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (71, 99);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (71, 251);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (72, 27);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (72, 17);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (72, 87);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (72, 252);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (73, 253);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (73, 102);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (73, 254);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (73, 255);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (74, 256);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (74, 257);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (74, 258);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (74, 12);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (75, 259);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (75, 260);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (75, 261);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (75, 262);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (76, 263);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (76, 264);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (76, 265);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (76, 266);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (76, 267);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (77, 268);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (77, 269);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (77, 270);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (77, 271);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (78, 272);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (78, 273);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (78, 228);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (78, 274);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (79, 275);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (79, 276);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (79, 277);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (79, 278);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (79, 100);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (80, 49);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (80, 80);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (80, 279);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (80, 280);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (81, 281);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (81, 282);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (81, 48);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (81, 49);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (82, 52);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (82, 283);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (82, 284);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (82, 51);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (83, 285);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (83, 286);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (83, 287);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (83, 288);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (84, 289);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (84, 290);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (84, 291);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (84, 292);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (85, 293);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (85, 294);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (85, 295);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (85, 296);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (86, 297);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (86, 298);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (86, 187);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (86, 299);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (87, 100);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (87, 300);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (87, 301);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (87, 302);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (88, 303);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (88, 304);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (88, 305);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (88, 306);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (89, 307);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (89, 308);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (89, 37);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (89, 309);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (90, 190);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (90, 310);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (90, 311);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (90, 312);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (90, 313);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (91, 314);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (91, 315);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (91, 316);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (91, 317);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (92, 318);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (92, 316);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (92, 319);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (92, 320);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (93, 112);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (93, 321);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (93, 322);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (93, 323);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (94, 324);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (94, 325);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (94, 326);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (94, 327);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (95, 328);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (95, 329);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (95, 330);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (95, 331);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (96, 201);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (96, 332);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (96, 333);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (96, 334);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (97, 335);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (97, 336);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (97, 293);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (97, 337);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (98, 338);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (98, 339);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (98, 340);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (98, 341);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (98, 342);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (99, 343);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (99, 51);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (99, 344);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (99, 345);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (99, 75);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (100, 346);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (100, 347);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (100, 348);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (100, 349);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (100, 350);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (101, 216);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (101, 351);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (101, 352);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (101, 353);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (101, 354);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (102, 355);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (102, 92);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (102, 356);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (102, 357);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (103, 358);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (103, 16);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (103, 359);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (103, 360);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (104, 358);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (104, 101);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (104, 250);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (105, 358);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (105, 361);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (105, 272);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (105, 212);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (106, 358);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (106, 325);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (106, 362);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (106, 363);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (106, 364);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (107, 358);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (107, 365);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (107, 366);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (107, 291);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (108, 367);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (108, 368);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (108, 369);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (108, 370);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (108, 371);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (109, 372);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (109, 373);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (109, 368);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (109, 374);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (110, 375);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (110, 376);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (110, 248);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (110, 368);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (110, 246);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (111, 377);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (111, 378);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (111, 368);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (111, 379);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (112, 380);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (112, 381);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (112, 368);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (112, 382);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (113, 383);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (113, 384);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (113, 229);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (113, 385);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (113, 386);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (114, 383);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (114, 387);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (114, 388);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (114, 389);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (115, 205);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (115, 206);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (115, 390);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (115, 207);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (116, 205);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (116, 206);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (116, 391);
INSERT IGNORE INTO `resource_tags` (`resource_id`, `tag_id`) VALUES (116, 392);

-- --------------------------------------------------------------
-- 10. TABEL LOG VERIFIKASI NASKAH
-- --------------------------------------------------------------
CREATE TABLE `verification_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `resource_id` BIGINT UNSIGNED NOT NULL,
    `verifier_id` BIGINT UNSIGNED NOT NULL,
    `status_before` VARCHAR(30) NOT NULL,
    `status_after` VARCHAR(30) NOT NULL,
    `action_result` ENUM('Disetujui', 'Revisi', 'Ditolak') NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_vl_resource` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `fk_vl_verifier` FOREIGN KEY (`verifier_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX `idx_vl_resource` (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `verification_logs` (`id`, `resource_id`, `verifier_id`, `status_before`, `status_after`, `action_result`, `notes`) VALUES
(1, 1, 2, 'Diverifikasi', 'Dipublikasikan', 'Disetujui', 'Materi Hanjar Sektor Pangan TA 2025 telah diteliti dan sesuai kurikulum resmi Sespimma.'),
(2, 2, 2, 'Diverifikasi', 'Dipublikasikan', 'Disetujui', 'Naskah Manajemen Kehumasan Polri disahkan oleh Pokja.');

-- --------------------------------------------------------------
-- 11. TABEL AUDIT TRAIL & LOG AKTIVITAS (MONITORING)
-- --------------------------------------------------------------
CREATE TABLE `activity_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL,
    `user_name_snapshot` VARCHAR(150) NULL,
    `role_snapshot` VARCHAR(50) NULL,
    `action_type` VARCHAR(50) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` VARCHAR(64) NULL,
    `satker_sindikat` VARCHAR(100) NULL,
    `description` VARCHAR(255) NOT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX `idx_logs_time` (`created_at`),
    INDEX `idx_logs_user_action` (`user_id`, `action_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_logs` (`id`, `user_id`, `user_name_snapshot`, `role_snapshot`, `action_type`, `entity_type`, `entity_id`, `satker_sindikat`, `description`, `ip_address`) VALUES
(1, 5, 'KOMPOL Arya Ramadhan, S.I.K.', 'Serdik', 'READ_HANJAR', 'resource', 'res-hanjar-sespimma-01', 'Sindikat 3', 'Membaca Hanjar Peran Polri dalam Sektor Pangan', '192.168.100.45'),
(2, 7, 'PURWANTO, S.I.K., M.Si.', 'Gadik', 'UPDATE_PROFILE', 'user', 'usr-gadik-72010235', 'Bag Jarlat', 'Memperbarui Silabus Bahan Ajar Manajemen Perubahan', '192.168.100.12'),
(3, 3, 'Pustakawan Sespimma', 'Pengelola', 'UPDATE_BOOK_LOCATION', 'book', 'bk-book-fisik-01', 'Perpustakaan', 'Pembaruan Lokasi Rak Buku Manajemen Logistik', '192.168.100.20'),
(4, 2, 'Kasubbag Jarlat Sespimma', 'Verifikator', 'VERIFY_APPROVE', 'resource', 'res-hanjar-sespimma-08', 'Subbag Renlat', 'Persetujuan Verifikasi Modul Intelijen Taktis', '192.168.100.15'),
(5, 6, 'KOMPOL Budi Santoso, S.H.', 'Serdik', 'SEARCH_TASKAP', 'search', 'taskap-hukum', 'Sindikat 1', 'Penelusuran Kertas Karya Taskap Pelayanan Publik Presisi', '192.168.100.52');

CREATE TABLE `search_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL,
    `query_text` VARCHAR(255) NOT NULL,
    `category_filter` VARCHAR(80) NULL DEFAULT 'Semua',
    `results_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX `idx_sl_query` (`query_text`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `search_logs` (`id`, `user_id`, `query_text`, `category_filter`, `results_count`) VALUES
(1, 5, 'Hanjar Ketahanan Pangan', 'Modul & Hanjar', 4),
(2, 6, 'Manajemen Logistik Polri', 'E-Library/Perpustakaan', 3),
(3, 5, 'Purwanto Kebijakan Strategis', 'Gadik & Kompetensi', 1),
(4, 1, 'Standar Layanan Mutu', 'Kurikulum & Standar Layanan', 2);

-- --------------------------------------------------------------
-- SELESAI & COMMIT TRANSAKSI
-- --------------------------------------------------------------
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
