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
