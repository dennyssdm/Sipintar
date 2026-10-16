/**
 * SIPINTAR — Core Types Definition
 * Aligned with Buku Panduan Tata Kelola & Manual Book SIPINTAR (2026)
 */

export type LifecycleStatus =
  | 'Draft'
  | 'Diverifikasi'
  | 'Dipublikasikan'
  | 'Tidak Aktif'
  | 'Arsip';

export type AccessClassification =
  | 'Terbuka'
  | 'Internal'
  | 'Terbatas'
  | 'Metadata Saja';

export type ResourceCategory =
  | 'Gadik & Kompetensi'
  | 'Modul & Hanjar'
  | 'E-Library/Perpustakaan'
  | 'Kurikulum & Standar Layanan'
  | 'SOP'
  | 'Pedoman'
  | 'Manual Book'
  | 'Pencarian Terpadu';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  subCategory?: string;
  description: string;
  authorOrInstructor: string;
  unitOrSource: string;
  updatedAt: string;
  lifecycle: LifecycleStatus;
  access: AccessClassification;
  hasDigitalFile: boolean;
  fileFormat?: 'PDF' | 'DOCX' | 'PPTX' | 'MP4' | 'EPUB';
  fileSize?: string;
  fileUrl?: string;
  physicalLocation?: string; // e.g. "Lantai 2, Rak B-03 Sespimma"
  competencies?: string[]; // for Gadik
  tags?: string[];
  // Fungsional Polri & Gadik specific metadata
  nrp?: string;
  jabatan?: string;
  eselon?: string;
  golongan?: string;
  pangkat?: string;
  agama?: string;
  noUrutNominatif?: number;
}

export interface GadikMember {
  id: string;
  noUrut: number;
  nama: string;
  pangkat: 'KOMBES POL' | 'AKBP' | 'KOMPOL' | 'IPTU';
  nrp: string;
  jabatan: string;
  kategoriJabatan:
    | 'Anjak Madya'
    | 'Widyaiswara Madya Tk. III'
    | 'Gadik Madya'
    | 'Widyaiswara Muda Tk. I'
    | 'Widyaiswara Pratama Tk. I';
  agama: 'ISLAM' | 'KRISTEN';
  eselon: 'II B3' | 'III A2' | 'III B' | 'IV B';
  golongan: 'IV-C' | 'IV-B' | 'IV-A' | 'III-C' | 'III-B';
  bidangKepakaran: string[];
  mataAjarHanjar: string[];
  status: 'Aktif Fungsional';
  bio: string;
}

export type UserRole =
  | 'Serdik'
  | 'Gadik'
  | 'Pengelola Perpustakaan'
  | 'Administrator';

export interface AdminShortcut {
  id: string;
  title: 'Manajemen Data' | 'Verifikasi' | 'Hak Akses' | 'Monitoring';
  description: string;
  icon: string;
  badgeCount?: number;
}

export interface CategorySummary {
  category: ResourceCategory;
  title: string;
  description: string;
  count: number;
  icon: string;
  href: string;
}

/**
 * E-Library / Perpustakaan Data Schema
 * Aligned with struktur buku.docx:
 * - Table 1: books (Metadata Deskriptif with synopsis)
 * - Table 2: book_files (Metadata Teknis with preview_file_path & full file_path)
 */
export interface BookFileMetadata {
  id: string;
  bookId: string;
  filePath: string; // File utuh (akses peminjaman/hak khusus)
  previewFilePath: string; // File pratinjau sampel (akses publik 10-20 halaman pertama)
  fileFormat: 'PDF' | 'EPUB';
  fileSize: string;
  totalPages: number;
  previewPages: number;
}

export interface BookItem {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  synopsis: string; // Ringkasan komprehensif atau abstrak buku
  categoryId: string;
  categoryName: string;
  language: 'Indonesia' | 'Inggris';
  digitalFile: BookFileMetadata;
  callNumber: string;
  physicalLocation: string;
  stockAvailable: number;
  stockTotal: number;
  coverImage?: string;
  coverColor?: string;
  coverGradient?: string;
  tags: string[];
}


