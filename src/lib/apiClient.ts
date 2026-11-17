/**
 * SIPINTAR Sespimma — Frontend API Client SDK & Transformers
 * Connects Next.js Frontend with Express/MySQL REST API on http://localhost:5001/api/v1
 */

import {
  ResourceItem,
  ResourceCategory,
  LifecycleStatus,
  AccessClassification,
  GadikMember,
  BookItem
} from '@/types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

class SipintarApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('sipintar_auth_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('sipintar_auth_token', token);
      } else {
        localStorage.removeItem('sipintar_auth_token');
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('sipintar_auth_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    const json = await response.json();

    if (!response.ok) {
      const errorMsg = json.error?.message || `Permintaan gagal (status ${response.status})`;
      const err: any = new Error(errorMsg);
      err.code = json.error?.code || 'API_ERROR';
      err.details = json.error?.details || [];
      err.status = response.status;
      throw err;
    }

    return json;
  }

  // --- 1. Autentikasi & Pengguna ---
  public auth = {
    login: async (identifier: string, password: string) => {
      const res = await this.request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.data?.token) {
        this.setToken(res.data.token);
      }
      return res.data;
    },
    logout: () => {
      this.setToken(null);
    },
    getMe: async () => {
      const res = await this.request<any>('/auth/me');
      return res.data;
    },
    register: async (data: {
      nama_lengkap: string;
      email: string;
      password: string;
      role_code?: string;
      nrp_nip?: string;
      pangkat?: string;
      jabatan?: string;
      phone_number?: string;
    }) => {
      const res = await this.request<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (res.data?.token) {
        this.setToken(res.data.token);
      }
      return res.data;
    }
  };

  // --- 2. Kategori & Subkategori ---
  public categories = {
    getAll: async () => {
      const res = await this.request<any[]>('/categories');
      return res.data;
    },
    getSubcategories: async (categoryIdOrSlug: string | number) => {
      const res = await this.request<any[]>(`/categories/${categoryIdOrSlug}/subcategories`);
      return res.data;
    }
  };

  // --- 3. Sumber Belajar (Resources) ---
  public resources = {
    list: async (params: {
      page?: number;
      limit?: number;
      category_id?: number | string;
      access_classification?: string;
      lifecycle_status?: string;
      q?: string;
      tag?: string;
    } = {}) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await this.request<any[]>(`/resources${query ? `?${query}` : ''}`);
      return { items: res.data, meta: res.meta };
    },
    getDetail: async (idOrUuid: string | number) => {
      const res = await this.request<any>(`/resources/${idOrUuid}`);
      return res.data;
    },
    getRelated: async (idOrUuid: string | number, limit = 4) => {
      const res = await this.request<any[]>(`/resources/${idOrUuid}/related?limit=${limit}`);
      return res.data;
    },
    getFileUrl: (id: string | number, isDownload = false) => {
      return `${this.baseUrl}/resources/${id}/file${isDownload ? '?download=true' : ''}`;
    }
  };

  // --- 4. Tenaga Pendidik (Gadik) ---
  public gadik = {
    list: async (params: {
      fungsional?: boolean;
      pangkat?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await this.request<any[]>(`/gadik${query ? `?${query}` : ''}`);
      return { items: res.data, meta: res.meta };
    },
    getDetail: async (idOrNrp: string | number) => {
      const res = await this.request<any>(`/gadik/${idOrNrp}`);
      return res.data;
    }
  };

  // --- 5. Perpustakaan & E-Library ---
  public library = {
    getCategories: async () => {
      const res = await this.request<any[]>('/library/categories');
      return res.data;
    },
    getBooks: async (params: {
      category_id?: string;
      author?: string;
      stock_available?: boolean;
      page?: number;
      limit?: number;
      q?: string;
    } = {}) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await this.request<any[]>(`/library/books${query ? `?${query}` : ''}`);
      return { items: res.data, meta: res.meta };
    },
    getBookDetail: async (id: string | number) => {
      const res = await this.request<any>(`/library/books/${id}`);
      return res.data;
    },
    getPreviewUrl: (id: string | number) => {
      return `${this.baseUrl}/library/books/${id}/preview`;
    }
  };

  // --- 6. Pencarian Terpadu (Unified Search) ---
  public search = {
    unified: async (q: string, category = 'all', page = 1, limit = 20) => {
      const query = new URLSearchParams({
        q,
        category,
        page: String(page),
        limit: String(limit)
      }).toString();
      const res = await this.request<any[]>(`/search?${query}`);
      return { items: res.data, meta: res.meta };
    }
  };

  // --- 7. Administrasi & Tata Kelola ---
  public admin = {
    createResource: async (formData: FormData) => {
      const res = await this.request<any>('/admin/resources', {
        method: 'POST',
        body: formData
      });
      return res.data;
    },
    archiveResource: async (id: number | string) => {
      const res = await this.request<any>(`/admin/resources/${id}/archive`, {
        method: 'PATCH'
      });
      return res.data;
    },
    getVerificationQueue: async (page = 1, limit = 10) => {
      const res = await this.request<any[]>(`/admin/verification/queue?page=${page}&limit=${limit}`);
      return { items: res.data, meta: res.meta };
    },
    reviewResource: async (id: number | string, decision: 'approve' | 'revision' | 'reject', notes?: string) => {
      const res = await this.request<any>(`/admin/verification/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ decision, notes })
      });
      return res.data;
    },
    getStats: async () => {
      const res = await this.request<any>('/admin/monitoring/stats');
      return res.data;
    },
    getLogs: async (params: { type?: 'activity' | 'search' | 'verification'; page?: number; limit?: number } = {}) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await this.request<any[]>(`/admin/monitoring/logs${query ? `?${query}` : ''}`);
      return { items: res.data, meta: res.meta };
    }
  };
}

export const sipintarApi = new SipintarApiClient();

// --- DATA MAPPERS (Database snake_case -> Frontend camelCase Types) ---

export function mapResourceToItem(r: any): ResourceItem {
  const fileUrl = r.has_digital_file
    ? `${API_BASE_URL}/resources/${r.id}/file`
    : undefined;

  let tags: string[] = [];
  if (Array.isArray(r.tags)) {
    tags = r.tags.map((t: any) => (typeof t === 'string' ? t : t.tag_name || t.name));
  }

  return {
    id: r.uuid || `res-${r.id}`,
    title: r.title || 'Tanpa Judul',
    category: (r.category_name || 'Modul & Hanjar') as ResourceCategory,
    subCategory: r.sub_category_name || r.sub_category_text || undefined,
    description: r.description || '',
    authorOrInstructor: r.author_or_instructor || 'Sespimma Sespim Lemdiklat Polri',
    unitOrSource: r.unit_or_source || 'Sespimma Sespim Lemdiklat Polri',
    updatedAt: r.updated_at ? r.updated_at.split('T')[0] : '2026-10-15',
    lifecycle: (r.lifecycle_status || 'Dipublikasikan') as LifecycleStatus,
    access: (r.access_classification || 'Terbuka') as AccessClassification,
    hasDigitalFile: Boolean(r.has_digital_file),
    fileFormat: (r.file_format || 'PDF') as any,
    fileSize: r.file_size_label || (r.file_size_bytes ? `${(r.file_size_bytes / 1024 / 1024).toFixed(1)} MB` : undefined),
    fileUrl,
    physicalLocation: r.physical_location || undefined,
    competencies: tags,
    tags
  };
}

export function mapGadikToMember(g: any): GadikMember {
  const kepakaran: string[] = [];
  const mataAjar: string[] = [];

  if (Array.isArray(g.competencies)) {
    g.competencies.forEach((c: any) => {
      if (c.type === 'mata_ajar') {
        mataAjar.push(c.name || c);
      } else {
        kepakaran.push(c.name || c);
      }
    });
  }

  return {
    id: g.uuid || `gadik-${g.nrp_nip || g.id}`,
    noUrut: g.no_urut_nominatif || 1,
    nama: g.nama_lengkap || '',
    pangkat: (g.pangkat || 'KOMBES POL') as any,
    nrp: g.nrp_nip || '',
    jabatan: g.jabatan || '',
    kategoriJabatan: (g.kategori_jabatan || 'Anjak Madya') as any,
    agama: (g.agama || 'ISLAM') as any,
    eselon: (g.eselon || 'II B3') as any,
    golongan: (g.golongan || 'IV-C') as any,
    bidangKepakaran: kepakaran.length > 0 ? kepakaran : ['Kepemimpinan Kepolisian', 'Manajemen Diklat'],
    mataAjarHanjar: mataAjar.length > 0 ? mataAjar : ['Manajemen Organisasi Polri'],
    status: 'Aktif Fungsional',
    bio: g.bio || `Perwira Menengah Polri berpangkat ${g.pangkat || 'Pamen'} di lingkungan Sespimma Sespim Lemdiklat Polri.`
  };
}

export function mapBookToItem(b: any): BookItem {
  let tags: string[] = [];
  if (Array.isArray(b.tags)) {
    tags = b.tags.map((t: any) => (typeof t === 'string' ? t : t.tag_name || t.name));
  }

  return {
    id: b.uuid || `bk-${b.id}`,
    isbn: b.isbn || '-',
    title: b.title || 'Judul Koleksi',
    author: b.author || 'Tim Penulis Sespimma',
    publisher: b.publisher || 'Sespimma Lemdiklat Polri Press',
    publishedYear: b.published_year || 2025,
    synopsis: b.synopsis || 'Sinopsis dan deskripsi koleksi pustaka Sespimma.',
    categoryId: b.library_category_id || 'buku-fisik',
    categoryName: b.library_category_name || 'Koleksi Buku Fisik',
    subCategory: b.sub_category || undefined,
    language: (b.language || 'Indonesia') as any,
    digitalFile: {
      id: `file-${b.id}`,
      bookId: b.uuid || `bk-${b.id}`,
      filePath: b.has_digital_file ? `${API_BASE_URL}/library/books/${b.id}/preview` : '',
      previewFilePath: b.has_preview ? `${API_BASE_URL}/library/books/${b.id}/preview` : '',
      fileFormat: (b.file_format || 'PDF') as any,
      fileSize: b.file_size_label || '2.5 MB',
      totalPages: b.total_pages || 100,
      previewPages: b.preview_pages || 20,
    },
    callNumber: b.call_number || 'SESPIMMA-2026',
    physicalLocation: b.physical_location || 'Lantai 2 Perpustakaan Sespimma',
    stockAvailable: b.stock_available ?? 0,
    stockTotal: b.stock_total ?? 0,
    coverImage: b.cover_image_url || undefined,
    coverColor: b.cover_color || '#1e3a8a',
    coverGradient: b.cover_gradient || 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    tags
  };
}

export default sipintarApi;
