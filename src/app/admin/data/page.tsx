'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { ResourceItem, LifecycleStatus, AccessClassification, ResourceCategory } from '@/types';
import { sipintarApi, mapResourceToItem, resolveInfographicUrl } from '@/lib/apiClient';

const CATEGORY_MAP: Record<string, number> = {
  'Gadik & Kompetensi': 1,
  'Modul & Hanjar': 2,
  'E-Library/Perpustakaan': 3,
  'Kurikulum & Standar Layanan': 4,
  'SOP': 5,
  'Pedoman': 6,
  'Manual Book': 7,
  'Pencarian Terpadu': 8,
};

const CATEGORIES: ResourceCategory[] = [
  'Modul & Hanjar',
  'Gadik & Kompetensi',
  'E-Library/Perpustakaan',
  'Kurikulum & Standar Layanan',
  'SOP',
  'Pedoman',
  'Manual Book',
];

/**
 * ------------------------------------------------------------------
 * EXPORT / IMPORT HELPERS (CSV / EXCEL & JSON)
 * ------------------------------------------------------------------
 */

function triggerDownload(filename: string, content: string, mimeType = 'text/csv;charset=utf-8;', withBom = true) {
  const blob = withBom
    ? new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: mimeType })
    : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertToCsv(data: Record<string, any>[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows: string[] = [];

  // Header row
  rows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
      return `"${val.replace(/"/g, '""')}"`;
    });
    rows.push(values.join(','));
  }

  return rows.join('\r\n');
}

function parseCsv(text: string): Record<string, string>[] {
  const clean = text.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  const firstLine = clean.split('\n')[0];
  let delimiter = ',';
  if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) {
    delimiter = ';';
  } else if (firstLine.includes('\t')) {
    delimiter = '\t';
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\r') {
        // ignore CR
      } else if (char === '\n') {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
  const result: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 1 && !row[0]) continue;
    const obj: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] !== undefined ? row[c] : '';
    }
    result.push(obj);
  }

  return result;
}

const TEMPLATES: Record<'resources' | 'books' | 'users', { filename: string; headers: string[]; samples: string[][] }> = {
  resources: {
    filename: 'Template_Import_Dokumen_SIPINTAR.csv',
    headers: [
      'Judul Dokumen',
      'Kategori',
      'Subkategori',
      'Deskripsi',
      'Penulis / Penyusun',
      'Satuan / Sumber',
      'Klasifikasi Akses',
      'Status',
      'Format Berkas',
      'Lokasi Fisik'
    ],
    samples: [
      [
        'MODUL CORE 1 SESPIMMA ANALISIS DAN PEMECAHAN MASALAH OPERASIONAL',
        'Modul & Hanjar',
        'Modul Core Sespimma',
        'Bahan ajar pokok analisis masalah operasional tingkat staf dan pimpinan.',
        'Tim Pokja Jarlat Sespimma Lemdiklat Polri',
        'Bag Jarlat Sespimma Lemdiklat Polri',
        'Internal',
        'Dipublikasikan',
        'PDF',
        'Ruang Jarlat Rak A1'
      ],
      [
        'STANDAR OPERASIONAL PROSEDUR PENYELENGGARAAN EVALUASI AKADEMIK',
        'SOP',
        'Standar Layanan & SOP',
        'Prosedur operasional baku pelaksanaan evaluasi pembelajaran serdik.',
        'Bagian Pengajaran dan Latihan',
        'Sespimma Lemdiklat Polri',
        'Internal',
        'Dipublikasikan',
        'PDF',
        'Ruang Pengajaran'
      ]
    ]
  },
  books: {
    filename: 'Template_Import_Perpustakaan_SIPINTAR.csv',
    headers: [
      'Judul Buku',
      'Penulis',
      'Penerbit',
      'Tahun Terbit',
      'ISBN',
      'Kategori',
      'Subkategori',
      'Nomor Panggil',
      'Lokasi Rak',
      'Stok Total',
      'Stok Tersedia',
      'Klasifikasi Akses',
      'Status',
      'Sinopsis'
    ],
    samples: [
      [
        'MANAJEMEN KEPEMIMPINAN STRATEGIS POLRI ERA DIGITAL',
        'Kombes Pol Dr. Budi Santoso, M.Si.',
        'Sespimma Lemdiklat Polri Press',
        '2026',
        '978-623-00-1234-5',
        'buku-fisik',
        'Kepemimpinan',
        '350.1 BUD m',
        'Lantai 2 - Rak B3',
        '5',
        '5',
        'Internal',
        'Dipublikasikan',
        'Buku pegangan wajib kepemimpinan transformasional perwira menengah Polri.'
      ],
      [
        'OPTIMALISASI DETEKSI DINI DAN PREVENSI KONFLIK SOSIAL',
        'AKBP H. Prasetyo, S.I.K.',
        'Sespimma Lemdiklat Polri',
        '2025',
        '',
        'taskap',
        'Intelijen Keamanan',
        'TASKAP-2025-042',
        'Lantai 1 - Lemari Tesis',
        '1',
        '0',
        'Internal',
        'Dipublikasikan',
        'Kertas Karya Perorangan (Taskap) serdik Sespimma angkatan ke-72.'
      ]
    ]
  },
  users: {
    filename: 'Template_Import_Pengguna_SIPINTAR.csv',
    headers: [
      'NRP / NIP',
      'Nama Lengkap',
      'Email',
      'Nomor Telepon',
      'Peran',
      'Status Akun',
      'Kata Sandi Awal'
    ],
    samples: [
      [
        '85071234',
        'KOMPOL Arya Ramadhan, S.I.K.',
        'arya.ramadhan@polri.go.id',
        '081298765432',
        'serdik',
        'Aktif',
        'Sespimma@2026!'
      ],
      [
        '78030987',
        'AKBP Bambang Wijaya, S.H., M.H.',
        'bambang.wijaya@polri.go.id',
        '081312345678',
        'gadik',
        'Aktif',
        'Sespimma@2026!'
      ]
    ]
  }
};

function mapCsvRowToPayload(row: Record<string, string>, entity: 'resources' | 'books' | 'users'): any {
  const getVal = (...keys: string[]) => {
    for (const k of keys) {
      const lower = k.toLowerCase().trim();
      if (row[lower] !== undefined && row[lower] !== '') return row[lower];
      for (const objKey of Object.keys(row)) {
        if (objKey.toLowerCase().trim() === lower && row[objKey]) return row[objKey];
      }
    }
    return '';
  };

  if (entity === 'resources') {
    return {
      judul: getVal('judul dokumen', 'judul', 'title', 'nama'),
      kategori: getVal('kategori', 'category') || 'Modul & Hanjar',
      sub_kategori: getVal('subkategori', 'sub_kategori', 'sub kategori'),
      deskripsi: getVal('deskripsi', 'description', 'keterangan'),
      penulis_penyusun: getVal('penulis / penyusun', 'penulis', 'penyusun', 'author') || 'Tim Pokja Sespimma Lemdiklat Polri',
      unit_sumber: getVal('satuan / sumber', 'unit', 'sumber') || 'Bag Jarlat Sespimma Lemdiklat Polri',
      klasifikasi_akses: getVal('klasifikasi akses', 'klasifikasi', 'akses') || 'Internal',
      status: getVal('status', 'lifecycle_status') || 'Dipublikasikan',
      format_berkas: getVal('format berkas', 'format', 'tipe') || 'PDF',
      lokasi_fisik: getVal('lokasi fisik', 'lokasi')
    };
  }

  if (entity === 'books') {
    return {
      judul: getVal('judul buku', 'judul', 'title'),
      penulis: getVal('penulis', 'author', 'pengarang') || 'Tim Penulis Sespimma',
      penerbit: getVal('penerbit', 'publisher') || 'Sespimma Lemdiklat Polri',
      tahun_terbit: parseInt(getVal('tahun terbit', 'tahun', 'year') || '2026', 10) || 2026,
      isbn: getVal('isbn'),
      kategori: getVal('kategori', 'library_category_id') || 'buku-fisik',
      sub_kategori: getVal('subkategori', 'sub_kategori', 'sub kategori'),
      nomor_panggil: getVal('nomor panggil', 'call_number'),
      lokasi_rak: getVal('lokasi rak', 'lokasi'),
      stok_total: parseInt(getVal('stok total', 'stok_total', 'total stok') || '1', 10) || 1,
      stok_tersedia: parseInt(getVal('stok tersedia', 'stok_tersedia') || '1', 10) || 1,
      klasifikasi_akses: getVal('klasifikasi akses', 'klasifikasi') || 'Internal',
      status: getVal('status') || 'Dipublikasikan',
      sinopsis: getVal('sinopsis', 'abstrak', 'synopsis')
    };
  }

  if (entity === 'users') {
    return {
      nrp_nip: getVal('nrp / nip', 'nrp', 'nip', 'identifier'),
      nama_lengkap: getVal('nama lengkap', 'nama', 'name'),
      email: getVal('email'),
      no_telepon: getVal('nomor telepon', 'no telepon', 'no hp', 'phone'),
      peran: getVal('peran', 'role') || 'serdik',
      status_akun: getVal('status akun', 'status') || 'Aktif',
      kata_sandi: getVal('kata sandi awal', 'kata sandi', 'password') || 'Sespimma@2026!'
    };
  }
}

export default function AdminDataPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'books' | 'users' | 'infographic'>('resources');

  // --- 1. RESOURCES STATE ---
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [filterLifecycle, setFilterLifecycle] = useState<string>('Semua');
  const [filterAccess, setFilterAccess] = useState<string>('Semua');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  // Add Resource Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('Modul & Hanjar');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUnit, setNewUnit] = useState('Bag Jarlat Sespimma Lemdiklat Polri');
  const [newAccess, setNewAccess] = useState<AccessClassification>('Internal');
  const [newLifecycle, setNewLifecycle] = useState<LifecycleStatus>('Dipublikasikan');
  const [newDescription, setNewDescription] = useState('');
  const [newPhysicalLocation, setNewPhysicalLocation] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Resource Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<ResourceItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<ResourceCategory>('Modul & Hanjar');
  const [editSubCategory, setEditSubCategory] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editAccess, setEditAccess] = useState<AccessClassification>('Internal');
  const [editLifecycle, setEditLifecycle] = useState<LifecycleStatus>('Dipublikasikan');
  const [editDescription, setEditDescription] = useState('');
  const [editPhysicalLocation, setEditPhysicalLocation] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Resource Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ResourceItem | null>(null);
  const [isHardDelete, setIsHardDelete] = useState(false);

  // --- 2. BOOKS (E-LIBRARY) STATE ---
  const [books, setBooks] = useState<any[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const [bookFilterCat, setBookFilterCat] = useState<string>('Semua');

  // Add Book Modal
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookPublisher, setNewBookPublisher] = useState('Sespimma Lemdiklat Polri');
  const [newBookYear, setNewBookYear] = useState(2026);
  const [newBookCatId, setNewBookCatId] = useState(1);
  const [newBookAccess, setNewBookAccess] = useState<AccessClassification>('Terbuka');
  const [newBookSynopsis, setNewBookSynopsis] = useState('');
  const [newBookFile, setNewBookFile] = useState<File | null>(null);

  // Edit Book Modal
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [editBookTitle, setEditBookTitle] = useState('');
  const [editBookAuthor, setEditBookAuthor] = useState('');
  const [editBookPublisher, setEditBookPublisher] = useState('');
  const [editBookYear, setEditBookYear] = useState(2026);
  const [editBookCatId, setEditBookCatId] = useState(1);
  const [editBookAccess, setEditBookAccess] = useState<AccessClassification>('Terbuka');
  const [editBookSynopsis, setEditBookSynopsis] = useState('');
  const [editBookFile, setEditBookFile] = useState<File | null>(null);

  // Delete Book Modal
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [deletingBook, setDeletingBook] = useState<any | null>(null);

  // --- 3. USERS STATE ---
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('Semua');

  // Add User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserNrp, setNewUserNrp] = useState('');
  const [newUserNama, setNewUserNama] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Sespimma@2026!');
  const [newUserRoleId, setNewUserRoleId] = useState(1);
  const [newUserPhone, setNewUserPhone] = useState('');

  // Global Notification Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 6000);
  };

  // --- USER AUTH & ACCESS CONTROL ---
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sipintar_auth_user');
        if (saved) {
          try {
            const user = JSON.parse(saved);
            setCurrentUser(user);
            setIsAuthChecking(false);
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }
      setCurrentUser(null);
      setIsAuthChecking(false);
    };

    checkAuth();
    window.addEventListener('sipintar-auth-changed', checkAuth);
    return () => {
      window.removeEventListener('sipintar-auth-changed', checkAuth);
    };
  }, []);

  const userRole = (currentUser?.role || currentUser?.role_code || '').toLowerCase();
  const isSuperAdmin = Boolean(currentUser && userRole === 'admin');
  const isCruOnly = Boolean(
    currentUser && (
      currentUser.permission_scope === 'CRU' ||
      currentUser.can_delete === false ||
      currentUser.nrp_nip === 'livi'
    )
  );
  const canDelete = isSuperAdmin && !isCruOnly;

  // --- 4. INFOGRAPHIC STATE & HANDLERS ---
  const [infographicData, setInfographicData] = useState<{
    image_url: string;
    image_full_url?: string;
    title?: string;
    caption?: string;
    updated_at?: string;
    updated_by_name?: string;
  }>({
    image_url: '/infografis-sipintar.jpg',
    image_full_url: '/infografis-sipintar.png',
    title: 'INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU',
    caption: 'Visualisasi komprehensif arsitektur ekosistem sumber belajar terpadu Sespimma Lemdiklat Polri: Gadik & Kompetensi, Modul & Hanjar 720 JP, Perpustakaan, Kurikulum, dan SOP Layanan Presisi.',
  });
  const [isLoadingInfographic, setIsLoadingInfographic] = useState(false);
  const [isSavingInfographic, setIsSavingInfographic] = useState(false);
  const [newInfographicFile, setNewInfographicFile] = useState<File | null>(null);
  const [newInfographicPreview, setNewInfographicPreview] = useState<string | null>(null);
  const [editInfographicTitle, setEditInfographicTitle] = useState('INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU');
  const [editInfographicCaption, setEditInfographicCaption] = useState('Visualisasi komprehensif arsitektur ekosistem sumber belajar terpadu Sespimma Lemdiklat Polri: Gadik & Kompetensi, Modul & Hanjar 720 JP, Perpustakaan, Kurikulum, dan SOP Layanan Presisi.');
  const [showInfographicLightbox, setShowInfographicLightbox] = useState(false);
  const infographicFileInputRef = useRef<HTMLInputElement>(null);

  const fetchInfographic = async () => {
    setIsLoadingInfographic(true);
    try {
      const data = await sipintarApi.getInfographic();
      if (data) {
        setInfographicData(data);
        if (data.title) setEditInfographicTitle(data.title);
        if (data.caption) setEditInfographicCaption(data.caption);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInfographic(false);
    }
  };

  const handleInfographicFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCruOnly) {
      showNotification('Akses ditolak: Akun Anda memiliki izin Admin CRU. Penggantian berkas infografis arsitektur hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).', 'error');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Berkas harus berupa gambar (JPG, PNG, WEBP, atau SVG)', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showNotification('Ukuran berkas gambar maksimal 20 MB', 'error');
      return;
    }

    setNewInfographicFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewInfographicPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInfographic = async () => {
    if (isCruOnly) {
      showNotification('Akses ditolak: Akun Anda memiliki izin Admin CRU. Penggantian gambar hanya diizinkan untuk Superadmin CRUD (dennyboy).', 'error');
      return;
    }

    setIsSavingInfographic(true);
    try {
      if (newInfographicFile) {
        const formData = new FormData();
        formData.append('image', newInfographicFile);
        formData.append('title', editInfographicTitle.trim() || 'INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU');
        formData.append('caption', editInfographicCaption.trim());
        await sipintarApi.admin.updateInfographic(formData);
      } else {
        await sipintarApi.admin.updateInfographic({
          title: editInfographicTitle.trim() || 'INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU',
          caption: editInfographicCaption.trim()
        });
      }

      showNotification('Gambar dan konfigurasi Infografis Arsitektur berhasil diperbarui!', 'success');
      setNewInfographicFile(null);
      setNewInfographicPreview(null);
      await fetchInfographic();
    } catch (err: any) {
      showNotification(err.message || 'Gagal menyimpan perubahan infografis', 'error');
    } finally {
      setIsSavingInfographic(false);
    }
  };

  const handleResetInfographic = async () => {
    if (isCruOnly) {
      showNotification('Akses ditolak: Hanya Superadmin CRUD yang dapat mereset infografis sistem.', 'error');
      return;
    }
    if (!window.confirm('Kembalikan gambar infografis arsitektur ke berkas bawaan resmi Sespimma (/infografis-sipintar.jpg)?')) {
      return;
    }

    setIsSavingInfographic(true);
    try {
      await sipintarApi.admin.updateInfographic({ action: 'reset' });
      showNotification('Infografis berhasil dikembalikan ke gambar bawaan resmi Sespimma', 'success');
      setNewInfographicFile(null);
      setNewInfographicPreview(null);
      await fetchInfographic();
    } catch (err: any) {
      showNotification(err.message || 'Gagal mereset infografis', 'error');
    } finally {
      setIsSavingInfographic(false);
    }
  };

  // --- EXPORT & IMPORT STATE ---

  const [isExporting, setIsExporting] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importParsedRows, setImportParsedRows] = useState<any[]>([]);
  const [importErrorDetails, setImportErrorDetails] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    if (activeTab === 'infographic') return;
    const tpl = TEMPLATES[activeTab];
    const headerLine = tpl.headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
    const sampleLines = tpl.samples.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const csvContent = `${headerLine}\r\n${sampleLines}`;
    triggerDownload(tpl.filename, csvContent, 'text/csv;charset=utf-8;', true);
    showNotification(`Template import ${activeTab.toUpperCase()} berhasil diunduh. Silakan isi berkas sesuai kolom.`);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (activeTab === 'infographic') return;
    setIsExporting(true);
    try {
      const res = await sipintarApi.admin.exportData(activeTab);
      const items = res.items || [];
      if (items.length === 0) {
        showNotification(`Tidak ada data ${activeTab} untuk diekspor`, 'error');
        return;
      }

      const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
      const filename = `SIPINTAR_${activeTab.toUpperCase()}_EXPORT_${timestamp}`;

      if (format === 'csv') {
        let exportDataRows = items;
        if (activeTab === 'users') {
          exportDataRows = items.map((u: any, i: number) => ({
            'No': i + 1,
            'NRP / NIP': u.nrp_nip || '',
            'Nama Lengkap': u.nama_lengkap || '',
            'Email': u.email || '',
            'Nomor Telepon': u.no_telepon || '',
            'Kode Peran': u.kode_peran || '',
            'Nama Peran': u.nama_peran || '',
            'Status Akun': u.status_akun || '',
            'Login Terakhir': u.login_terakhir || '-',
            'Tanggal Registrasi': u.dibuat_pada || '-'
          }));
        } else if (activeTab === 'books') {
          exportDataRows = items.map((b: any, i: number) => ({
            'No': i + 1,
            'Judul Buku': b.judul || '',
            'Penulis': b.penulis || '',
            'Penerbit': b.penerbit || '',
            'Tahun Terbit': b.tahun_terbit || '',
            'ISBN': b.isbn || '',
            'Kategori': b.kategori || '',
            'Subkategori': b.sub_kategori || '',
            'Nomor Panggil': b.nomor_panggil || '',
            'Lokasi Rak': b.lokasi_rak || '',
            'Stok Total': b.stok_total || 1,
            'Stok Tersedia': b.stok_tersedia || 1,
            'Klasifikasi Akses': b.klasifikasi_akses || '',
            'Status': b.status || '',
            'Sinopsis': b.sinopsis || ''
          }));
        } else if (activeTab === 'resources') {
          exportDataRows = items.map((r: any, i: number) => ({
            'No': i + 1,
            'Judul Dokumen': r.judul || '',
            'Kategori': r.kategori || '',
            'Subkategori': r.sub_kategori || '',
            'Deskripsi': r.deskripsi || '',
            'Penulis / Penyusun': r.penulis_penyusun || '',
            'Satuan / Sumber': r.unit_sumber || '',
            'Klasifikasi Akses': r.klasifikasi_akses || '',
            'Status': r.status || '',
            'Format Berkas': r.format_berkas || '',
            'Lokasi Fisik': r.lokasi_fisik || ''
          }));
        }

        const csvContent = convertToCsv(exportDataRows);
        triggerDownload(`${filename}.csv`, csvContent, 'text/csv;charset=utf-8;', true);
        showNotification(`Berhasil mengekspor ${items.length} baris data ${activeTab.toUpperCase()} ke Excel/CSV!`);
      } else {
        const jsonContent = JSON.stringify(items, null, 2);
        triggerDownload(`${filename}.json`, jsonContent, 'application/json;charset=utf-8;', false);
        showNotification(`Berhasil mengekspor ${items.length} data ${activeTab.toUpperCase()} ke JSON!`);
      }
    } catch (err: any) {
      showNotification(`Gagal mengekspor data: ${err.message || 'Kesalahan server'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeTab === 'infographic') return;

    setImportFile(file);
    setImportErrorDetails([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsed: any[] = [];

        if (file.name.endsWith('.json')) {
          const raw = JSON.parse(content);
          parsed = Array.isArray(raw) ? raw : [raw];
        } else {
          const rawRows = parseCsv(content);
          parsed = rawRows.map(r => mapCsvRowToPayload(r, activeTab as 'resources' | 'books' | 'users'));
        }

        const errors: string[] = [];
        parsed.forEach((item, idx) => {
          if (activeTab === 'resources' && !item.judul) {
            errors.push(`Baris ${idx + 1}: Judul dokumen wajib diisi`);
          } else if (activeTab === 'books' && !item.judul) {
            errors.push(`Baris ${idx + 1}: Judul buku wajib diisi`);
          } else if (activeTab === 'users' && (!item.nrp_nip || !item.nama_lengkap || !item.email)) {
            errors.push(`Baris ${idx + 1}: NRP/NIP, Nama Lengkap, atau Email wajib diisi`);
          }
        });

        setImportParsedRows(parsed);
        setImportErrorDetails(errors);
      } catch (err: any) {
        setImportErrorDetails([`Gagal membaca berkas: ${err.message || 'Format tidak valid'}`]);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (activeTab === 'infographic' || importParsedRows.length === 0) {
      showNotification('Tidak ada baris data valid yang siap diimpor', 'error');
      return;
    }

    setIsImporting(true);
    try {
      const res = await sipintarApi.admin.importData(activeTab as 'resources' | 'books' | 'users', importParsedRows);
      const count = res.imported_count || 0;
      const skipped = res.skipped_count || 0;

      showNotification(
        `Import selesai! ${count} data berhasil dimasukkan${skipped > 0 ? `, ${skipped} dilewati (sudah terdaftar)` : ''}.`
      );

      if (activeTab === 'resources') fetchResources();
      else if (activeTab === 'books') fetchBooks();
      else if (activeTab === 'users') fetchUsers();

      setShowImportModal(false);
      setImportFile(null);
      setImportParsedRows([]);
      setImportErrorDetails([]);
    } catch (err: any) {
      showNotification(`Gagal melakukan import: ${err.message || 'Terjadi kesalahan server'}`, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // --- FETCH DATA HOOKS ---
  const fetchResources = async () => {
    setIsLoadingResources(true);
    try {
      const res = await sipintarApi.resources.list({ limit: 150 });
      if (res.items && res.items.length > 0) {
        setResources(res.items.map(mapResourceToItem));
      }
    } catch (err: any) {
      console.warn('Gagal memuat resources:', err);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const fetchBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const res = await sipintarApi.library.getBooks({ limit: 150 });
      if (res.items) {
        setBooks(res.items);
      }
    } catch (err: any) {
      console.warn('Gagal memuat buku library:', err);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await sipintarApi.admin.listUsers({ limit: 100 });
      if (res.items) {
        setUsers(res.items);
      }
    } catch (err: any) {
      console.warn('Gagal memuat pengguna:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchResources();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin && activeTab === 'books' && books.length === 0) {
      fetchBooks();
    }
    if (isSuperAdmin && activeTab === 'users' && users.length === 0) {
      fetchUsers();
    }
    if (isSuperAdmin && activeTab === 'infographic') {
      fetchInfographic();
    }
  }, [isSuperAdmin, activeTab, books.length, users.length]);

  // --- RESOURCE CRUD HANDLERS ---
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const categoryId = CATEGORY_MAP[newCategory] || 2;
      const formData = new FormData();
      formData.append('title', newTitle.trim());
      formData.append('category_id', String(categoryId));
      formData.append('sub_category_text', newSubCategory.trim() || 'Umum');
      formData.append('author_or_instructor', newAuthor.trim() || 'Pokja Jarlat Sespimma');
      formData.append('unit_or_source', newUnit.trim());
      formData.append('access_classification', newAccess);
      formData.append('lifecycle_status', newLifecycle);
      formData.append('description', newDescription.trim() || 'Naskah pembelajaran resmi Sespimma.');
      if (newPhysicalLocation.trim()) {
        formData.append('physical_location', newPhysicalLocation.trim());
      }
      if (newFile) {
        formData.append('file', newFile);
      }

      const result = await sipintarApi.admin.createResource(formData);
      if (result) {
        showNotification(`Dokumen "${newTitle}" berhasil dibuat dan disimpan ke database!`);
        setShowAddModal(false);
        setNewTitle('');
        setNewSubCategory('');
        setNewAuthor('');
        setNewDescription('');
        setNewFile(null);
        if (addFileInputRef.current) addFileInputRef.current.value = '';
        await fetchResources();
      }
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menambahkan dokumen baru.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (item: ResourceItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditSubCategory(item.subCategory || '');
    setEditAuthor(item.authorOrInstructor);
    setEditUnit(item.unitOrSource);
    setEditAccess(item.access);
    setEditLifecycle(item.lifecycle);
    setEditDescription(item.description || '');
    setEditPhysicalLocation(item.physicalLocation || '');
    setEditFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setShowEditModal(true);
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const cleanId = String(editItem.id).replace(/^res-0*/, '') || editItem.id;
      const categoryId = CATEGORY_MAP[editCategory] || 2;
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      formData.append('category_id', String(categoryId));
      formData.append('sub_category_text', editSubCategory.trim() || 'Umum');
      formData.append('author_or_instructor', editAuthor.trim());
      formData.append('unit_or_source', editUnit.trim());
      formData.append('access_classification', editAccess);
      formData.append('lifecycle_status', editLifecycle);
      formData.append('description', editDescription.trim());
      if (editPhysicalLocation.trim()) {
        formData.append('physical_location', editPhysicalLocation.trim());
      }
      if (editFile) {
        formData.append('file', editFile);
      }

      await sipintarApi.admin.updateResource(cleanId, formData);
      if (editLifecycle !== editItem.lifecycle) {
        await sipintarApi.admin.updateResourceStatus(cleanId, editLifecycle);
      }

      showNotification(`Dokumen "${editTitle}" berhasil diperbarui!`);
      setShowEditModal(false);
      setEditItem(null);
      await fetchResources();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal memperbarui dokumen.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (item: ResourceItem, targetStatus: LifecycleStatus) => {
    try {
      const cleanId = String(item.id).replace(/^res-0*/, '') || item.id;
      await sipintarApi.admin.updateResourceStatus(cleanId, targetStatus);
      showNotification(`Status "${item.title}" berhasil diubah menjadi ${targetStatus}.`);
      setResources((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, lifecycle: targetStatus } : r))
      );
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mengubah status naskah.', 'error');
    }
  };

  const handleOpenDeleteModal = (item: ResourceItem) => {
    if (isCruOnly) {
      showNotification(
        'Akses Ditolak: Akun Anda memiliki izin Admin CRU (Create, Read, Update). Tindakan Delete hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).',
        'error'
      );
      return;
    }
    setDeleteItem(item);
    setIsHardDelete(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    if (isCruOnly) {
      showNotification(
        'Akses Ditolak: Akun Anda memiliki izin Admin CRU (Create, Read, Update). Tindakan Delete hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).',
        'error'
      );
      setShowDeleteModal(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const cleanId = String(deleteItem.id).replace(/^res-0*/, '') || deleteItem.id;
      await sipintarApi.admin.deleteResource(cleanId, isHardDelete);
      showNotification(
        isHardDelete
          ? `Dokumen "${deleteItem.title}" berhasil dihapus secara permanen.`
          : `Dokumen "${deleteItem.title}" berhasil dialihkan ke siklus Arsip.`
      );
      setShowDeleteModal(false);
      setDeleteItem(null);
      await fetchResources();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menghapus dokumen.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- BOOK CRUD HANDLERS ---
  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newBookTitle.trim());
      formData.append('author', newBookAuthor.trim() || 'Tim Sespimma Lemdiklat Polri');
      formData.append('publisher', newBookPublisher.trim());
      formData.append('published_year', String(newBookYear));
      formData.append('library_category_id', String(newBookCatId));
      formData.append('access_classification', newBookAccess);
      formData.append('synopsis', newBookSynopsis.trim());
      if (newBookFile) {
        formData.append('file', newBookFile);
      }

      await sipintarApi.admin.createBook(formData);
      showNotification(`Buku "${newBookTitle}" berhasil ditambahkan ke E-Library!`);
      setShowAddBookModal(false);
      setNewBookTitle('');
      setNewBookAuthor('');
      setNewBookSynopsis('');
      setNewBookFile(null);
      await fetchBooks();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menambahkan buku.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditBook = (book: any) => {
    setEditingBook(book);
    setEditBookTitle(book.title || '');
    setEditBookAuthor(book.author || '');
    setEditBookPublisher(book.publisher || '');
    setEditBookYear(book.published_year || 2026);
    setEditBookCatId(book.library_category_id || 1);
    setEditBookAccess(book.access_classification || 'Terbuka');
    setEditBookSynopsis(book.synopsis || '');
    setEditBookFile(null);
    setShowEditBookModal(true);
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editBookTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', editBookTitle.trim());
      formData.append('author', editBookAuthor.trim());
      formData.append('publisher', editBookPublisher.trim());
      formData.append('published_year', String(editBookYear));
      formData.append('library_category_id', String(editBookCatId));
      formData.append('access_classification', editBookAccess);
      formData.append('synopsis', editBookSynopsis.trim());
      if (editBookFile) {
        formData.append('file', editBookFile);
      }

      await sipintarApi.admin.updateBook(editingBook.id, formData);
      showNotification(`Buku "${editBookTitle}" berhasil diperbarui!`);
      setShowEditBookModal(false);
      setEditingBook(null);
      await fetchBooks();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal memperbarui buku.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    if (isCruOnly) {
      showNotification(
        'Akses Ditolak: Akun Anda memiliki izin Admin CRU (Create, Read, Update). Tindakan Delete hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).',
        'error'
      );
      setShowDeleteBookModal(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await sipintarApi.admin.deleteBook(deletingBook.id);
      showNotification(`Buku "${deletingBook.title}" berhasil dihapus.`);
      setShowDeleteBookModal(false);
      setDeletingBook(null);
      await fetchBooks();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal menghapus buku.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- USER MANAGEMENT HANDLERS ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserNrp.trim() || !newUserNama.trim() || !newUserEmail.trim() || !newUserPassword) return;

    setIsSubmitting(true);
    try {
      await sipintarApi.admin.createUser({
        nrp_nip: newUserNrp.trim(),
        nama_lengkap: newUserNama.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        role_id: newUserRoleId,
        phone_number: newUserPhone.trim() || null,
      });

      showNotification(`Pengguna ${newUserNama} (${newUserNrp}) berhasil didaftarkan!`);
      setShowAddUserModal(false);
      setNewUserNrp('');
      setNewUserNama('');
      setNewUserEmail('');
      setNewUserPhone('');
      await fetchUsers();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mendaftarkan pengguna baru.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (user: any) => {
    if (isCruOnly) {
      showNotification(
        'Akses Ditolak: Penonaktifan akun pengguna memerlukan wewenang Superadmin CRUD (dennyboy).',
        'error'
      );
      return;
    }
    try {
      const nextStatus = user.is_active ? 0 : 1;
      await sipintarApi.admin.updateUserStatus(user.id, nextStatus);
      showNotification(`Akun ${user.nama_lengkap} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: nextStatus } : u))
      );
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mengubah status akun pengguna.', 'error');
    }
  };

  const handleChangeUserRole = async (user: any, newRoleId: number) => {
    if (isCruOnly) {
      showNotification(
        'Akses Ditolak: Perubahan peran pengguna memerlukan wewenang Superadmin CRUD (dennyboy).',
        'error'
      );
      return;
    }
    try {
      await sipintarApi.admin.updateUserRole(user.id, newRoleId);
      showNotification(`Peran untuk ${user.nama_lengkap} berhasil diperbarui.`);
      await fetchUsers();
    } catch (err: any) {
      showNotification(err?.message || 'Gagal mengubah peran pengguna.', 'error');
    }
  };

  // --- FILTERED DATA ---
  const filteredResources = resources.filter((res) => {
    const matchCat = filterCategory === 'Semua' || res.category === filterCategory;
    const matchLifecycle = filterLifecycle === 'Semua' || res.lifecycle === filterLifecycle;
    const matchAccess = filterAccess === 'Semua' || res.access === filterAccess;
    const matchSearch =
      !search ||
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.authorOrInstructor.toLowerCase().includes(search.toLowerCase()) ||
      res.unitOrSource.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLifecycle && matchAccess && matchSearch;
  });

  // --- PAGINATION STATE ---
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredBooks = books.filter((b) => {
    let matchCat = bookFilterCat === 'Semua';
    if (!matchCat) {
      const catSlug = (b.category_slug || '').toLowerCase();
      const catName = (b.category_name || '').toLowerCase();
      const filter = bookFilterCat.toLowerCase();
      matchCat =
        catSlug === filter ||
        catName.includes(filter) ||
        (filter === 'buku-fisik' && (catName.includes('fisik') || b.library_category_id === 1)) ||
        (filter === 'ebook' && (catName.includes('ebook') || catName.includes('e-book') || b.library_category_id === 2)) ||
        (filter === 'taskap' && (catName.includes('taskap') || b.library_category_id === 3)) ||
        (filter === 'jurnal' && (catName.includes('jurnal') || b.library_category_id === 4));
    }
    const matchSearch =
      !bookSearch ||
      String(b.title || '').toLowerCase().includes(bookSearch.toLowerCase()) ||
      String(b.author || '').toLowerCase().includes(bookSearch.toLowerCase()) ||
      String(b.publisher || '').toLowerCase().includes(bookSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredUsers = users.filter((u) => {
    const matchRole =
      userFilterRole === 'Semua' ||
      String(u.role_code || u.role || '').toLowerCase() === userFilterRole.toLowerCase();
    const matchSearch =
      !userSearch ||
      String(u.nama_lengkap || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      String(u.nrp_nip || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      String(u.email || '').toLowerCase().includes(userSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  // Reset pagination on filter or tab change
  const [filterKey, setFilterKey] = useState(
    () => `${activeTab}_${search}_${filterCategory}_${filterLifecycle}_${filterAccess}_${bookSearch}_${bookFilterCat}_${userSearch}_${userFilterRole}`
  );
  const currentFilterKey = `${activeTab}_${search}_${filterCategory}_${filterLifecycle}_${filterAccess}_${bookSearch}_${bookFilterCat}_${userSearch}_${userFilterRole}`;
  if (filterKey !== currentFilterKey) {
    setFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  // Paginated Slices
  const totalResourcePages = Math.ceil(filteredResources.length / pageSize) || 1;
  const paginatedResources = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalBookPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalUserPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderPagination = (totalItems: number, totalPages: number) => {
    if (totalItems === 0) return null;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12.5px',
        }}
      >
        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>
            Menampilkan <strong>{startItem}</strong>–<strong>{endItem}</strong> dari <strong>{totalItems}</strong> data
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>Per halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '5px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-hover)',
                color: 'var(--color-text-main)',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            title="Halaman Pertama"
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === 1 ? 'transparent' : 'var(--color-surface-hover)',
              color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text-main)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            «
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            title="Halaman Sebelumnya"
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === 1 ? 'transparent' : 'var(--color-surface-hover)',
              color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text-main)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            ‹ Sebelumnya
          </button>

          <span
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            title="Halaman Selanjutnya"
            style={{
              padding: '5px 12px',
              borderRadius: '5px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--color-surface-hover)',
              color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-main)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            Selanjutnya ›
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Halaman Terakhir"
            style={{
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid var(--color-border)',
              backgroundColor: currentPage === totalPages ? 'transparent' : 'var(--color-surface-hover)',
              color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-main)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              opacity: currentPage === totalPages ? 0.4 : 1,
            }}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  // Metrics
  const totalCount = resources.length;
  const publishedCount = resources.filter((r) => r.lifecycle === 'Dipublikasikan').length;
  const draftCount = resources.filter((r) => r.lifecycle === 'Draft' || r.lifecycle === 'Diverifikasi').length;
  const archivedCount = resources.filter((r) => r.lifecycle === 'Arsip').length;

  if (isAuthChecking) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Memverifikasi hak akses Administrator Sistem...</div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div style={{ paddingBottom: '40px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Beranda
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Superadmin CMS & Data Control</span>
        </nav>

        <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 12px' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface, #111d33)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle top alert glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-70px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '280px',
                height: '160px',
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0) 70%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#ef4444',
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '3px 10px',
                borderRadius: '4px',
                letterSpacing: '0.8px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              OTORISASI KETAT • KHUSUS SUPERADMIN
            </span>

            <h1 style={{ fontSize: '23px', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px', letterSpacing: '-0.3px' }}>
              Pusat Pengendali Master Data & CMS
            </h1>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              Fitur <strong>CRUD Master Data, Ekspor/Impor Naskah, dan Manajemen Akun</strong> hanya dapat diakses oleh akun <strong>Administrator Sistem (Superadmin)</strong> Sespimma Lemdiklat Polri.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--color-border, #1e293b)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: '#cbd5e1',
                marginBottom: '28px',
              }}
            >
              <span>Status Login:</span>
              <strong style={{ color: currentUser ? '#fbbf24' : '#ef4444' }}>
                {currentUser ? `${currentUser.nama_lengkap} (${currentUser.role_name || currentUser.role})` : 'Pengguna Tamu (Belum Masuk)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-sipintar-login'))}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '11px 22px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Masuk sebagai Superadmin</span>
              </button>

              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 20px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Superadmin CMS & Data Control</span>
      </nav>

      {/* Hero Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #07162d 0%, #0d2549 50%, #16407c 100%)',
          color: '#ffffff',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(7, 22, 45, 0.25)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: isCruOnly ? '#38bdf8' : '#fbbf24',
                backgroundColor: isCruOnly ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                border: isCruOnly ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(251, 191, 36, 0.35)',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.6px',
              }}
            >
              {isCruOnly ? 'CMS ADMIN CRU (LIVI)' : 'CMS SUPERADMIN PUSAT (DENNYBOY)'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isCruOnly ? '#38bdf8' : '#34d399',
                backgroundColor: isCruOnly ? 'rgba(56, 189, 248, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                border: isCruOnly ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(52, 211, 153, 0.35)',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {isCruOnly ? 'CRU AKTIF (CREATE, READ, UPDATE)' : 'CRUD AKTIF (FULL ACCESS)'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '2px 0 6px',
              letterSpacing: '-0.3px',
            }}
          >
            Pusat Pengendali Konten & Master Data (CMS)
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '720px', lineHeight: 1.5, margin: 0 }}>
            {isCruOnly
              ? 'Panel kendali Administrator CRU Sespimma Lemdiklat Polri: Anda memiliki wewenang Create, Read, dan Update untuk seluruh naskah ajar dan buku perpustakaan. Hak Delete (Hapus) dikunci khusus untuk Superadmin CRUD (dennyboy).'
              : 'Panel kendali penuh Super Administrator Sespimma Lemdiklat Polri: Kelola seluruh naskah ajar, buku perpustakaan, siklus penerbitan, dan hak akses pengguna secara real-time.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '12px', color: '#cbd5e1', backgroundColor: 'rgba(255,255,255,0.06)', padding: '8px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)' }}>
            {isCruOnly
              ? '🔒 Mode CRU Aktif: Buat & Ubah diizinkan, Hapus dikunci untuk Superadmin'
              : '⚙️ Panel Aksi CRUD, Ekspor & Impor aktif pada masing-masing modul di bawah'}
          </div>
        </div>
      </header>

      {/* Global Toast Feedback */}
      {feedback && (
        <div
          style={{
            backgroundColor: feedback.type === 'success' ? 'var(--color-success-bg, #064e3b)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? 'var(--color-success, #34d399)' : '#ef4444'}`,
            color: feedback.type === 'success' ? 'var(--color-success, #34d399)' : '#fca5a5',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '15px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Module Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        {activeTab === 'resources' && (
          <>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Dokumen Terdaftar</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>{totalCount}</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dipublikasikan (Aktif)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>{publishedCount}</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dalam Draf / Verifikasi</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{draftCount}</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Arsip Dokumen</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-muted)', marginTop: '4px' }}>{archivedCount}</div>
            </div>
          </>
        )}

        {activeTab === 'books' && (
          <>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Koleksi Pustaka</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>{books.length}</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-Book Digital</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>
                {books.filter((b) => b.library_category_id === 2 || String(b.category_name || b.category_slug || '').toLowerCase().includes('ebook')).length}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buku Fisik Koleksi</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {books.filter((b) => b.library_category_id === 1 || String(b.category_name || b.category_slug || '').toLowerCase().includes('fisik')).length}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Taskap & Jurnal</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
                {books.filter((b) => [3, 4].includes(b.library_category_id) || String(b.category_name || b.category_slug || '').toLowerCase().includes('taskap') || String(b.category_name || b.category_slug || '').toLowerCase().includes('jurnal')).length}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Pengguna Terdaftar</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>{users.length}</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peserta Didik (Serdik)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {users.filter((u) => String(u.role_code || u.role || '').toLowerCase() === 'serdik').length}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tenaga Pendidik (Gadik)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                {users.filter((u) => String(u.role_code || u.role || '').toLowerCase() === 'gadik').length}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin, Verifikator & Pustaka</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ec4899', marginTop: '4px' }}>
                {users.filter((u) => ['admin', 'verifikator', 'pengelola', 'pimpinan'].includes(String(u.role_code || u.role || '').toLowerCase())).length}
              </div>
            </div>
          </>
        )}

        {activeTab === 'infographic' && (
          <>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lokasi Penayangan</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                Halaman Utama (/)
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Infografis</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                Aktif & Tayang Live
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: canDelete ? '#3b82f6' : '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wewenang Pengelolaan</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: canDelete ? '#3b82f6' : '#ef4444', marginTop: '4px' }}>
                {canDelete ? 'Superadmin CRUD' : 'CRU (Read-Only)'}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Format Rekomendasi</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', marginTop: '4px' }}>
                16:9 Landscape (Maks 20MB)
              </div>
            </div>
          </>
        )}
      </div>

      {/* CMS Module Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: activeTab === 'resources' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'resources' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            marginBottom: '-2px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📂 Dokumen & Bahan Ajar</span>
          <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '10px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
            {resources.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('books')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: activeTab === 'books' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'books' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            marginBottom: '-2px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📚 Perpustakaan & Taskap</span>
          <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '10px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
            {books.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'users' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            marginBottom: '-2px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>👥 Manajemen Pengguna</span>
          <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '10px', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('infographic')}
          style={{
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: activeTab === 'infographic' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'infographic' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            marginBottom: '-2px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🖼️ Infografis Ekosistem</span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '10px',
              backgroundColor: canDelete ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: canDelete ? '#10b981' : '#ef4444',
              fontWeight: 700,
            }}
          >
            {canDelete ? 'CRUD' : 'CRU LOCK'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESOURCES (DOKUMEN & BAHAN AJAR) */}
      {/* ========================================================================= */}
      {activeTab === 'resources' && (
        <div>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Cari judul naskah, penyusun, atau unit kerja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Semua">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterLifecycle}
                onChange={(e) => setFilterLifecycle(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Dipublikasikan">Dipublikasikan</option>
                <option value="Draft">Draft</option>
                <option value="Diverifikasi">Diverifikasi</option>
                <option value="Arsip">Arsip</option>
              </select>

              <select
                value={filterAccess}
                onChange={(e) => setFilterAccess(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Semua">Semua Klasifikasi</option>
                <option value="Terbuka">Terbuka</option>
                <option value="Internal">Internal</option>
                <option value="Terbatas">Terbatas</option>
                <option value="Metadata Saja">Metadata Saja</option>
              </select>

              {(search || filterCategory !== 'Semua' || filterLifecycle !== 'Semua' || filterAccess !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setFilterCategory('Semua');
                    setFilterLifecycle('Semua');
                    setFilterAccess('Semua');
                  }}
                  title="Bersihkan Filter Pencarian"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  ✕ Reset Filter
                </button>
              )}
            </div>

            {/* ACTION BUTTONS FOR RESOURCES TAB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
                style={{
                  height: '38px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                  cursor: 'pointer',
                  border: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tambah Naskah Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportFile(null);
                  setImportParsedRows([]);
                  setImportErrorDetails([]);
                  setShowImportModal(true);
                }}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>📤 Import Dokumen</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleExport('csv')}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{isExporting ? 'Mengekspor...' : '📥 Export Dokumen (Excel)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                title="Unduh format template CSV dokumen bahan ajar"
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                <span>Format Template</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Menampilkan <strong>{filteredResources.length}</strong> dari {resources.length} naskah
          </div>

          {/* Table Container */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isLoadingResources ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Memuat data naskah dari server MySQL...
              </div>
            ) : filteredResources.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Tidak ada naskah yang cocok dengan kriteria pencarian.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Judul & Kategori</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Penyusun / Unit</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status Siklus</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Klasifikasi</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Aksi CRUD Superadmin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResources.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid var(--color-border-subtle)',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '14px 16px', maxWidth: '380px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '3px', lineHeight: 1.4 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.category}</span>
                            <span>•</span>
                            <span>{item.subCategory || 'Bahan Pokok'}</span>
                            {item.hasDigitalFile && (
                              <span style={{ fontSize: '10px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#3b82f6', padding: '1px 5px', borderRadius: '4px' }}>
                                PDF Ready
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{item.authorOrInstructor}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.unitOrSource}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge type="lifecycle" value={item.lifecycle} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge type="access" value={item.access} />
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {/* Preview */}
                            <button
                              type="button"
                              onClick={() => setPreviewItem(item)}
                              title="Buka Pratinjau Naskah"
                              style={{
                                padding: '5px 8px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                              }}
                            >
                              👁️ Pratinjau
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              title="Ubah Naskah"
                              style={{
                                padding: '5px 8px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)',
                                color: '#d97706',
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit
                            </button>

                            {/* Quick Publish if draft/diverifikasi */}
                            {item.lifecycle !== 'Dipublikasikan' && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(item, 'Dipublikasikan')}
                                title="Terbitkan Sekarang"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  borderRadius: '4px',
                                  border: 'none',
                                  backgroundColor: '#16a34a',
                                  color: '#ffffff',
                                  cursor: 'pointer',
                                }}
                              >
                                🚀 Terbitkan
                              </button>
                            )}

                            {/* Delete / Archive */}
                            {isCruOnly ? (
                              <button
                                type="button"
                                onClick={() =>
                                  showNotification(
                                    'Akses Ditolak: Akun Anda memiliki izin Admin CRU (Create, Read, Update). Tindakan Delete hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).',
                                    'error'
                                  )
                                }
                                title="Izin Hapus Terkunci (Akun Admin CRU - Hubungi Superadmin dennyboy)"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  borderRadius: '4px',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                  color: '#94a3b8',
                                  cursor: 'not-allowed',
                                  opacity: 0.7,
                                }}
                              >
                                🔒 Hapus (CRU)
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(item)}
                                title="Hapus atau Arsipkan Naskah"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  borderRadius: '4px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                }}
                              >
                                🗑️ Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {renderPagination(filteredResources.length, totalResourcePages)}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BOOKS & TASKAP (PERPUSTAKAAN) */}
      {/* ========================================================================= */}
      {activeTab === 'books' && (
        <div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Cari judul buku, penulis, atau kata kunci..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <select
                value={bookFilterCat}
                onChange={(e) => setBookFilterCat(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Semua">Semua Kategori Library</option>
                <option value="buku-fisik">Buku Fisik</option>
                <option value="ebook">E-Book Digital</option>
                <option value="taskap">Karya Tulis Akhir (Taskap)</option>
                <option value="jurnal">Jurnal Kepolisian</option>
              </select>

              {(bookSearch || bookFilterCat !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setBookSearch('');
                    setBookFilterCat('Semua');
                  }}
                  title="Bersihkan Filter Perpustakaan"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  ✕ Reset Filter
                </button>
              )}
            </div>

            {/* ACTION BUTTONS FOR BOOKS TAB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddBookModal(true)}
                className="btn-primary"
                style={{
                  height: '38px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
                  cursor: 'pointer',
                  border: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Tambah Buku / Taskap</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportFile(null);
                  setImportParsedRows([]);
                  setImportErrorDetails([]);
                  setShowImportModal(true);
                }}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>📤 Import Koleksi</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleExport('csv')}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{isExporting ? 'Mengekspor...' : '📥 Export Buku (Excel)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                title="Unduh format template CSV koleksi perpustakaan"
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                <span>Format Template</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Menampilkan <strong>{filteredBooks.length}</strong> buku terdaftar
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isLoadingBooks ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Memuat katalog buku perpustakaan...
              </div>
            ) : filteredBooks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Tidak ada koleksi buku ditemukan.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Judul & Penulis</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Kategori Perpustakaan</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Penerbit / Tahun</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Klasifikasi</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Aksi CRUD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBooks.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '14px 16px', maxWidth: '360px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '2px' }}>{b.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{b.author || 'Tim Penulis'}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#3b82f6' }}>
                            {b.category_name || b.library_category_id || 'Buku'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div>{b.publisher || 'Sespimma'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tahun {b.published_year || 2026}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusBadge type="access" value={b.access_classification || 'Terbuka'} />
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditBook(b)}
                              style={{
                                padding: '5px 8px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-surface)',
                                color: '#d97706',
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit
                            </button>
                            {isCruOnly ? (
                              <button
                                type="button"
                                onClick={() =>
                                  showNotification(
                                    'Akses Ditolak: Akun Anda memiliki izin Admin CRU (Create, Read, Update). Tindakan Delete hanya dapat dilakukan oleh Superadmin CRUD (dennyboy).',
                                    'error'
                                  )
                                }
                                title="Izin Hapus Terkunci (Akun Admin CRU - Hubungi Superadmin dennyboy)"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  borderRadius: '4px',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                                  color: '#94a3b8',
                                  cursor: 'not-allowed',
                                  opacity: 0.7,
                                }}
                              >
                                🔒 Hapus (CRU)
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeletingBook(b);
                                  setShowDeleteBookModal(true);
                                }}
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  borderRadius: '4px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                }}
                              >
                                🗑️ Hapus
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {renderPagination(filteredBooks.length, totalBookPages)}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Cari nama pengguna, NRP/NIP, atau email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{
                  minWidth: '220px',
                  flex: 1,
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <select
                value={userFilterRole}
                onChange={(e) => setUserFilterRole(e.target.value)}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Semua">Semua Peran (Role)</option>
                <option value="admin">Administrator Sistem</option>
                <option value="verifikator">Tim Verifikator</option>
                <option value="gadik">Tenaga Pendidik (Gadik)</option>
                <option value="serdik">Peserta Didik (Serdik)</option>
                <option value="pengelola">Pengelola Data & Pustaka</option>
                <option value="pimpinan">Pimpinan Sespimma</option>
              </select>

              {(userSearch || userFilterRole !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setUserSearch('');
                    setUserFilterRole('Semua');
                  }}
                  title="Bersihkan Filter Pengguna"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-sm, 6px)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxSizing: 'border-box',
                  }}
                >
                  ✕ Reset Filter
                </button>
              )}
            </div>

            {/* ACTION BUTTONS FOR USERS TAB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="btn-primary"
                style={{
                  height: '38px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
                  cursor: 'pointer',
                  border: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Tambah Pengguna Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportFile(null);
                  setImportParsedRows([]);
                  setImportErrorDetails([]);
                  setShowImportModal(true);
                }}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>📤 Import Pengguna</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleExport('csv')}
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{isExporting ? 'Mengekspor...' : '📥 Export Pengguna (Excel)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                title="Unduh format template CSV akun pengguna"
                style={{
                  height: '38px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
                <span>Format Template</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Menampilkan <strong>{filteredUsers.length}</strong> pengguna terdaftar
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {isLoadingUsers ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Memuat daftar pengguna...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Tidak ada pengguna yang cocok dengan kriteria.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Nama & NRP</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Email</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Peran (Role)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status Akun</th>
                      <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{u.nama_lengkap}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>NRP: {u.nrp_nip}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--color-text-main)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={u.role_id || (u.role_code === 'admin' ? 5 : u.role_code === 'gadik' ? 2 : 1)}
                            onChange={(e) => handleChangeUserRole(u, Number(e.target.value))}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--color-border)',
                              backgroundColor: 'var(--color-surface-hover)',
                              color: 'var(--color-text-main)',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            <option value={1}>Peserta Didik (Serdik)</option>
                            <option value={2}>Tenaga Pendidik (Gadik)</option>
                            <option value={3}>Pengelola Data & Pustaka</option>
                            <option value={4}>Tim Verifikator</option>
                            <option value={5}>Administrator Sistem</option>
                            <option value={6}>Pimpinan Sespimma</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: u.is_active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: u.is_active ? '#22c55e' : '#ef4444',
                            }}
                          >
                            {u.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              borderRadius: '4px',
                              border: '1px solid var(--color-border)',
                              backgroundColor: u.is_active ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                              color: u.is_active ? '#dc2626' : '#16a34a',
                              cursor: 'pointer',
                            }}
                          >
                            {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {renderPagination(filteredUsers.length, totalUserPages)}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INFOGRAPHIC MANAGEMENT (INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU) */}
      {/* ========================================================================= */}
      {activeTab === 'infographic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Authority Banner */}
          {canDelete ? (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md, 8px)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>👑</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#10b981' }}>
                  Wewenang Superadmin CRUD ({currentUser?.nama_lengkap || 'dennyboy'}) Aktif
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #94a3b8)', marginTop: '2px' }}>
                  Anda memiliki wewenang penuh untuk mengganti secara manual berkas gambar Infografis Arsitektur Sumber Belajar Terpadu, mengubah judul & deskripsi, serta mereset ke gambar bawaan resmi Sespimma. Perubahan yang Anda simpan langsung tayang secara live pada halaman muka sistem.
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md, 8px)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>🔒</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#ef4444' }}>
                  Akses Terbatas: Mode Pratinjau Admin CRU ({currentUser?.nama_lengkap || 'livi'})
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #94a3b8)', marginTop: '2px' }}>
                  Berdasarkan tata kelola RBAC SIPINTAR (Decision D-64), berkas gambar infografis arsitektur sistem hanya dapat diperbarui atau diganti oleh Superadmin CRUD. Akun Anda saat ini hanya memiliki izin peninjauan (Read-Only).
                </div>
              </div>
            </div>
          )}

          {/* 2-Column Grid: Preview on Left, Upload Form on Right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Column 1: Live Display Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface, #0f172a)',
                border: '1px solid var(--color-border, #1e293b)',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-md, 0 4px 14px rgba(0,0,0,0.2))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📊</span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-navy, #f8fafc)' }}>
                    Pratinjau Infografis Tayang Live
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  Aktif di Halaman Depan
                </span>
              </div>

              {/* Image Frame */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#071731',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  cursor: 'zoom-in',
                }}
                onClick={() => setShowInfographicLightbox(true)}
                title="Klik untuk memperbesar infografis"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveInfographicUrl(infographicData.image_url)}
                  alt={infographicData.title || 'Infografis Arsitektur'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfographicLightbox(true);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(7, 23, 49, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#93c5fd',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Perbesar</span>
                </button>
              </div>

              {/* Metadata Panel */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: 'var(--color-surface-hover, rgba(255, 255, 255, 0.03))',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: '1px solid var(--color-border, #1e293b)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted, #94a3b8)', fontWeight: 700 }}>
                    Judul Header Infografis:
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--color-text-main, #f8fafc)', marginTop: '2px' }}>
                    {infographicData.title || 'INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted, #94a3b8)', fontWeight: 700 }}>
                    Deskripsi / Caption Teks:
                  </div>
                  <div style={{ color: 'var(--color-text-muted, #cbd5e1)', marginTop: '2px', lineHeight: 1.45 }}>
                    {infographicData.caption || '-'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted, #94a3b8)' }}>Terakhir Diperbarui:</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main, #e2e8f0)', fontSize: '11.5px' }}>
                      {infographicData.updated_at ? new Date(infographicData.updated_at).toLocaleString('id-ID') : 'Berkas Asli Sespimma'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted, #94a3b8)' }}>Diperbarui Oleh:</div>
                    <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '11.5px' }}>
                      {infographicData.updated_by_name || 'Superadmin Pusat'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Upload & Edit Form */}
            <div
              style={{
                backgroundColor: 'var(--color-surface, #0f172a)',
                border: '1px solid var(--color-border, #1e293b)',
                borderRadius: 'var(--radius-lg, 12px)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-md, 0 4px 14px rgba(0,0,0,0.2))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>🖼️</span>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-navy, #f8fafc)' }}>
                  Form Penggantian Gambar Infografis Manual
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #94a3b8)', margin: 0 }}>
                Pilih berkas gambar baru dari komputer untuk mengganti infografis arsitektur. Disarankan rasio 16:9 atau min. lebar 1200 piksel agar tampak tajam di semua resolusi layar.
              </p>

              {/* Hidden file input */}
              <input
                ref={infographicFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                onChange={handleInfographicFileSelect}
                style={{ display: 'none' }}
                disabled={isCruOnly || isSavingInfographic}
              />

              {/* File Upload Drop Zone */}
              <div
                onClick={() => {
                  if (!isCruOnly && !isSavingInfographic) {
                    infographicFileInputRef.current?.click();
                  }
                }}
                style={{
                  border: newInfographicPreview ? '2px solid #10b981' : '2px dashed var(--color-border, #334155)',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: newInfographicPreview ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-surface-hover, rgba(255, 255, 255, 0.02))',
                  cursor: isCruOnly ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {newInfographicPreview ? (
                  <div>
                    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', marginBottom: '12px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newInfographicPreview}
                        alt="Pratinjau Gambar Baru"
                        style={{
                          maxHeight: '160px',
                          maxWidth: '100%',
                          borderRadius: '6px',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#10b981' }}>
                      ✓ Berkas Gambar Baru Siap Diunggah
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted, #94a3b8)', marginTop: '2px' }}>
                      {newInfographicFile?.name} ({(newInfographicFile?.size! / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewInfographicFile(null);
                        setNewInfographicPreview(null);
                        if (infographicFileInputRef.current) infographicFileInputRef.current.value = '';
                      }}
                      style={{
                        marginTop: '8px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ✕ Batalkan Pilihan Berkas
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main, #f8fafc)' }}>
                      {isCruOnly ? 'Pengunggahan Berkas Terkunci (Hanya CRUD)' : 'Klik untuk Memilih Berkas Gambar Baru'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted, #94a3b8)', marginTop: '4px' }}>
                      Format yang didukung: JPG, PNG, WEBP, SVG (Maksimal 20 MB)
                    </div>
                  </div>
                )}
              </div>

              {/* Title input */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main, #f8fafc)' }}>
                  Judul Header Infografis:
                </label>
                <input
                  type="text"
                  value={editInfographicTitle}
                  onChange={(e) => setEditInfographicTitle(e.target.value)}
                  disabled={isCruOnly || isSavingInfographic}
                  placeholder="Contoh: INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #334155)',
                    backgroundColor: 'var(--color-surface-hover, #1e293b)',
                    color: 'var(--color-text-main, #f8fafc)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Caption input */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main, #f8fafc)' }}>
                  Deskripsi / Caption Infografis:
                </label>
                <textarea
                  rows={3}
                  value={editInfographicCaption}
                  onChange={(e) => setEditInfographicCaption(e.target.value)}
                  disabled={isCruOnly || isSavingInfographic}
                  placeholder="Masukkan ringkasan atau keterangan infografis..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #334155)',
                    backgroundColor: 'var(--color-surface-hover, #1e293b)',
                    color: 'var(--color-text-main, #f8fafc)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginTop: '6px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--color-border, #1e293b)',
                }}
              >
                <button
                  type="button"
                  onClick={handleResetInfographic}
                  disabled={isCruOnly || isSavingInfographic}
                  style={{
                    padding: '9px 16px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #334155)',
                    backgroundColor: 'transparent',
                    color: isCruOnly ? 'var(--color-text-muted, #64748b)' : '#f59e0b',
                    cursor: isCruOnly || isSavingInfographic ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  title="Kembalikan gambar ke berkas bawaan resmi institusi"
                >
                  <span>🔄</span>
                  <span>Reset Bawaan Sistem</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveInfographic}
                  disabled={isCruOnly || isSavingInfographic}
                  style={{
                    padding: '9px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isCruOnly ? '#475569' : '#2563eb',
                    color: '#ffffff',
                    cursor: isCruOnly || isSavingInfographic ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: isCruOnly ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.35)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>💾</span>
                  <span>{isSavingInfographic ? 'Menyimpan...' : 'Simpan & Terapkan Gambar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. MODAL TAMBAH RESOURCE */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
              Tambah Naskah / Sumber Belajar Baru
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              Masukkan data naskah materi dan unggah berkas fisik digital (.pdf, .docx, .pptx).
            </p>

            <form onSubmit={handleCreateResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Judul Materi / Naskah: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Core 8 Manajemen Taktis Krisis Kamtibmas..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Kategori: *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Subkategori:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hanjar Utama / Modul Core"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Penyusun / Gadik:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pokja Jarlat & Gadik Pengampu"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Unit Kerja Sumber:
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Klasifikasi Akses:
                  </label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as AccessClassification)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value="Terbuka">Terbuka (Publik Sespimma)</option>
                    <option value="Internal">Internal (Wajib Login Serdik/Gadik)</option>
                    <option value="Terbatas">Terbatas (Khusus Pamen & Gadik)</option>
                    <option value="Metadata Saja">Metadata Saja (Tanpa Berkas Digital)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Status Siklus Penerbitan:
                  </label>
                  <select
                    value={newLifecycle}
                    onChange={(e) => setNewLifecycle(e.target.value as LifecycleStatus)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value="Dipublikasikan">Dipublikasikan (Langsung Tayang)</option>
                    <option value="Draft">Draft (Konsep Awal)</option>
                    <option value="Diverifikasi">Diverifikasi (Menunggu Validasi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Unggah Berkas Naskah (.pdf, .docx, .pptx):
                </label>
                <input
                  type="file"
                  ref={addFileInputRef}
                  accept=".pdf,.docx,.pptx,.epub,.mp4"
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px dashed var(--color-border)',
                    backgroundColor: 'var(--color-surface-hover)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Ringkasan / Silabus Pembelajaran:
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan intisari materi atau deskripsi kompetensi..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="btn-secondary"
                  style={{ padding: '9px 16px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Naskah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT RESOURCE */}
      {showEditModal && editItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
              Ubah Data Naskah / Bahan Ajar
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              Memperbarui ID: {editItem.id} • {editItem.title}
            </p>

            <form onSubmit={handleUpdateResource} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Judul Materi: *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Kategori: *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ResourceCategory)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Subkategori:
                  </label>
                  <input
                    type="text"
                    value={editSubCategory}
                    onChange={(e) => setEditSubCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Penyusun / Gadik:
                  </label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Unit Sumber:
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Klasifikasi Akses:
                  </label>
                  <select
                    value={editAccess}
                    onChange={(e) => setEditAccess(e.target.value as AccessClassification)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value="Terbuka">Terbuka</option>
                    <option value="Internal">Internal</option>
                    <option value="Terbatas">Terbatas</option>
                    <option value="Metadata Saja">Metadata Saja</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Status Siklus:
                  </label>
                  <select
                    value={editLifecycle}
                    onChange={(e) => setEditLifecycle(e.target.value as LifecycleStatus)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value="Dipublikasikan">Dipublikasikan</option>
                    <option value="Draft">Draft</option>
                    <option value="Diverifikasi">Diverifikasi</option>
                    <option value="Arsip">Arsip</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Ganti Berkas Fisik (Opsional):
                </label>
                <input
                  type="file"
                  ref={editFileInputRef}
                  accept=".pdf,.docx,.pptx,.epub,.mp4"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px dashed var(--color-border)',
                    backgroundColor: 'var(--color-surface-hover)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Deskripsi / Silabus:
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="btn-secondary"
                  style={{ padding: '9px 16px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editTitle.trim()}
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontWeight: 700 }}
                >
                  {isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL HAPUS RESOURCE */}
      {showDeleteModal && deleteItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', textAlign: 'center', margin: '0 0 8px' }}>
              Konfirmasi Penghapusan Naskah
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', margin: '0 0 16px', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin memproses dokumen: <br />
              <strong style={{ color: 'var(--color-text-main)' }}>{deleteItem.title}</strong>?
            </p>

            <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px', fontSize: '12.5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-main)' }}>
                <input
                  type="checkbox"
                  checked={isHardDelete}
                  onChange={(e) => setIsHardDelete(e.target.checked)}
                />
                <span>Hapus permanen (Hard Delete dari basis data)</span>
              </label>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', paddingLeft: '24px' }}>
                {isHardDelete
                  ? 'Perhatian: Rekam naskah dan relasi tag akan dihapus sepenuhnya.'
                  : 'Rekomendasi (Soft Delete): Naskah akan dialihkan ke status "Arsip" untuk preservasi jejak akademik.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="btn-secondary"
                style={{ padding: '9px 18px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                style={{
                  padding: '9px 20px',
                  borderRadius: '6px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Memproses...' : isHardDelete ? 'Hapus Permanen' : 'Arsipkan Dokumen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL TAMBAH BUKU */}
      {showAddBookModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddBookModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
              Tambah Buku / Koleksi E-Library
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              Katalog perpustakaan, e-book, naskah Taskap, dan jurnal kedinasan.
            </p>

            <form onSubmit={handleCreateBook} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Judul Koleksi: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Analisis Kriminologi Kontemporer & Kejahatan Siber"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Penulis / Penyusun:</label>
                  <input
                    type="text"
                    placeholder="Nama penulis"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Kategori Perpustakaan:</label>
                  <select
                    value={newBookCatId}
                    onChange={(e) => setNewBookCatId(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value={1}>Buku Fisik</option>
                    <option value={2}>E-Book Digital</option>
                    <option value={3}>Karya Tulis Akhir (Taskap)</option>
                    <option value={4}>Jurnal Kepolisian</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Penerbit:</label>
                  <input
                    type="text"
                    value={newBookPublisher}
                    onChange={(e) => setNewBookPublisher(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Tahun Terbit:</label>
                  <input
                    type="number"
                    value={newBookYear}
                    onChange={(e) => setNewBookYear(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Unggah Sampel Digital (.pdf):</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewBookFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed var(--color-border)', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddBookModal(false)} className="btn-secondary" style={{ padding: '9px 16px' }}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '9px 20px', fontWeight: 700 }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4.1 MODAL EDIT BUKU */}
      {showEditBookModal && editingBook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowEditBookModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
              Ubah Data Buku / Koleksi E-Library
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              ID Koleksi: #{editingBook.id} — Perbarui metadata naskah atau berkas digital.
            </p>

            <form onSubmit={handleUpdateBook} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Judul Koleksi: *</label>
                <input
                  type="text"
                  required
                  value={editBookTitle}
                  onChange={(e) => setEditBookTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Penulis / Penyusun:</label>
                  <input
                    type="text"
                    value={editBookAuthor}
                    onChange={(e) => setEditBookAuthor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Kategori Perpustakaan:</label>
                  <select
                    value={editBookCatId}
                    onChange={(e) => setEditBookCatId(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value={1}>Buku Fisik</option>
                    <option value={2}>E-Book Digital</option>
                    <option value={3}>Karya Tulis Akhir (Taskap)</option>
                    <option value={4}>Jurnal Kepolisian</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Penerbit:</label>
                  <input
                    type="text"
                    value={editBookPublisher}
                    onChange={(e) => setEditBookPublisher(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Tahun Terbit:</label>
                  <input
                    type="number"
                    value={editBookYear}
                    onChange={(e) => setEditBookYear(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Klasifikasi Akses:</label>
                <select
                  value={editBookAccess}
                  onChange={(e) => setEditBookAccess(e.target.value as AccessClassification)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                >
                  <option value="Terbuka">Terbuka (Dapat dibaca seluruh Serdik/Gadik)</option>
                  <option value="Internal">Internal Sespimma</option>
                  <option value="Terbatas">Terbatas (Khusus Pokja / Pimpinan)</option>
                  <option value="Metadata Saja">Metadata Saja (Tanpa Berkas Unduhan)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Ganti Berkas Digital (.pdf):</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setEditBookFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed var(--color-border)', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowEditBookModal(false)} className="btn-secondary" style={{ padding: '9px 16px' }}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '9px 20px', fontWeight: 700, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4.2 MODAL DELETE BUKU */}
      {showDeleteBookModal && deletingBook && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowDeleteBookModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '460px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '38px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444', margin: '0 0 8px' }}>
              Hapus Koleksi Buku?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 20px' }}>
              Apakah Anda yakin ingin menghapus buku <strong>&ldquo;{deletingBook.title}&rdquo;</strong> dari katalog perpustakaan?
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteBookModal(false)}
                disabled={isSubmitting}
                className="btn-secondary"
                style={{ padding: '9px 18px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteBook}
                disabled={isSubmitting}
                style={{
                  padding: '9px 20px',
                  borderRadius: '6px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus Buku'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL TAMBAH PENGGUNA */}
      {showAddUserModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddUserModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 6px' }}>
              Tambah Pengguna Baru
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
              Daftarkan akun Serdik, Gadik, Verifikator, atau Administrator baru.
            </p>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>NRP / NIP: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 89012345"
                  value={newUserNrp}
                  onChange={(e) => setNewUserNrp(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Nama Lengkap & Gelar: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KOMPOL Bagus Permana, S.I.K., M.Si."
                  value={newUserNama}
                  onChange={(e) => setNewUserNama(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Email: *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Peran (Role): *</label>
                  <select
                    value={newUserRoleId}
                    onChange={(e) => setNewUserRoleId(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                  >
                    <option value={1}>Peserta Didik (Serdik)</option>
                    <option value={2}>Tenaga Pendidik (Gadik)</option>
                    <option value={3}>Pengelola Data & Pustaka</option>
                    <option value={4}>Tim Verifikator</option>
                    <option value={5}>Administrator Sistem</option>
                    <option value={6}>Pimpinan Sespimma</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Kata Sandi (Password): *</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn-secondary" style={{ padding: '9px 16px' }}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '9px 20px', fontWeight: 700 }}>
                  {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL IMPORT DATA (CSV / EXCEL & JSON) */}
      {showImportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => {
            if (!isImporting) setShowImportModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface, #0f1c31)',
              borderRadius: 'var(--radius-lg, 12px)',
              border: '1px solid var(--color-border, #223758)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid var(--color-border, #223758)', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📤</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main, #e8f0fc)', margin: 0 }}>
                    Import Data {activeTab === 'resources' ? 'Dokumen & Bahan Ajar' : activeTab === 'books' ? 'Perpustakaan & Taskap' : 'Pengguna SIPINTAR'}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #94a3b8)', margin: '4px 0 0 28px' }}>
                  Unggah berkas spreadsheet <strong>.csv</strong> atau <strong>.json</strong> sesuai kolom master data institusi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  color: 'var(--color-text-muted, #94a3b8)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Step 1: Format & Download Template Banner */}
            <div
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#93c5fd', marginBottom: '3px' }}>
                  💡 Belum memiliki berkas sesuai format kolom?
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Unduh template Excel/CSV resmi dengan susunan header kolom dan contoh baris data siap pakai.
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  backgroundColor: '#2563eb',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduh Template CSV</span>
              </button>
            </div>

            {/* Step 2: Upload Area */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main, #e8f0fc)' }}>
                Pilih Berkas CSV / JSON untuk Diimpor:
              </label>
              <div
                onClick={() => importFileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--color-border, #223758)',
                  borderRadius: '10px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border, #223758)')}
              >
                <input
                  ref={importFileInputRef}
                  type="file"
                  accept=".csv, .json, text/csv, application/json"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main, #e8f0fc)', marginBottom: '4px' }}>
                  {importFile ? importFile.name : 'Klik atau seret berkas .csv / .json ke sini'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #94a3b8)' }}>
                  {importFile ? `${(importFile.size / 1024).toFixed(1)} KB — Siap diproses` : 'Mendukung CSV (Pemisah koma / titik koma) dan JSON'}
                </div>
              </div>
            </div>

            {/* Step 3: Error Warning Banner */}
            {importErrorDetails.length > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                  ⚠️ Ditemukan catatan validasi kolom:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#fca5a5' }}>
                  {importErrorDetails.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 4: Live Data Preview Table */}
            {importParsedRows.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main, #e8f0fc)' }}>
                    Pratinjau Data Terdeteksi ({importParsedRows.length} baris):
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(52, 211, 153, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Siap Diimpor
                  </span>
                </div>

                <div
                  style={{
                    maxHeight: '220px',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    border: '1px solid var(--color-border, #223758)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--color-border, #223758)' }}>
                        <th style={{ padding: '8px 10px', color: '#94a3b8' }}>#</th>
                        {activeTab === 'resources' && (
                          <>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Judul Dokumen</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Kategori</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Subkategori</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Penulis</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Akses</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Status</th>
                          </>
                        )}
                        {activeTab === 'books' && (
                          <>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Judul Buku</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Penulis</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Tahun</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Kategori</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Stok</th>
                          </>
                        )}
                        {activeTab === 'users' && (
                          <>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>NRP / NIP</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Nama Lengkap</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Email</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Peran</th>
                            <th style={{ padding: '8px 10px', color: '#94a3b8' }}>Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {importParsedRows.slice(0, 10).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '8px 10px', color: '#64748b' }}>{idx + 1}</td>
                          {activeTab === 'resources' && (
                            <>
                              <td style={{ padding: '8px 10px', fontWeight: 600, color: '#f1f5f9' }}>{row.judul || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.kategori || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.sub_kategori || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.penulis_penyusun || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.klasifikasi_akses || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.status || '-'}</td>
                            </>
                          )}
                          {activeTab === 'books' && (
                            <>
                              <td style={{ padding: '8px 10px', fontWeight: 600, color: '#f1f5f9' }}>{row.judul || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.penulis || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.tahun_terbit || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.kategori || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.stok_total || '1'}</td>
                            </>
                          )}
                          {activeTab === 'users' && (
                            <>
                              <td style={{ padding: '8px 10px', fontWeight: 600, color: '#f1f5f9' }}>{row.nrp_nip || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.nama_lengkap || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.email || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.peran || '-'}</td>
                              <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{row.status_akun || '-'}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {importParsedRows.length > 10 && (
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted, #94a3b8)', marginTop: '4px', textAlign: 'right' }}>
                    Menampilkan 10 dari {importParsedRows.length} baris data. Seluruh baris akan diproses saat import.
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--color-border, #223758)', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
                className="btn-secondary"
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isImporting || importParsedRows.length === 0}
                className="btn-primary"
                style={{
                  padding: '9px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  opacity: isImporting || importParsedRows.length === 0 ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                }}
              >
                {isImporting ? 'Memproses Import...' : `🚀 Mulai Import (${importParsedRows.length} Baris)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader Modal Preview */}
      {previewItem && (
        <ResourceDetailModal
          resource={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}

      {/* Lightbox Infographic Modal */}
      {showInfographicLightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowInfographicLightbox(false)}
        >
          <div
            style={{
              maxWidth: '1200px',
              width: '100%',
              backgroundColor: '#071731',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fbbf24' }}>📊</span>
                <span>{infographicData.title || 'INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU'} — Pratinjau Resolusi Penuh</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInfographicLightbox(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '16px', maxHeight: '82vh', overflow: 'auto', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newInfographicPreview || resolveInfographicUrl(infographicData.image_full_url || infographicData.image_url)}
                alt="Infografis Penuh"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'inline-block' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
