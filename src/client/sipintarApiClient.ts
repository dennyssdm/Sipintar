/**
 * SIPINTAR Sespimma — Frontend API Client SDK
 * Production-ready typed client for Next.js / React frontend
 */

export interface ApiResponse<T = any> {
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
    details: any[];
  };
}

class SipintarApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1') {
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
      const errorMsg = json.error?.message || `Request failed with status ${response.status}`;
      const err: any = new Error(errorMsg);
      err.code = json.error?.code || 'API_ERROR';
      err.details = json.error?.details || [];
      err.status = response.status;
      throw err;
    }

    return json;
  }

  // --- 1. Autentikasi & Profil ---
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
    register: async (data: any) => {
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
    list: async (params: { page?: number; limit?: number; category_id?: number; access_classification?: string; q?: string; tag?: string } = {}) => {
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
    list: async (params: { fungsional?: boolean; pangkat?: string; search?: string; page?: number; limit?: number } = {}) => {
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
    getBooks: async (params: { category_id?: string; author?: string; stock_available?: boolean; page?: number; limit?: number; q?: string } = {}) => {
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
    unified: async (q: string, category = 'all', page = 1, limit = 10) => {
      const query = new URLSearchParams({ q, category, page: String(page), limit: String(limit) }).toString();
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
export default sipintarApi;

