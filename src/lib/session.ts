/**
 * Sespimma SIPINTAR Session & Authentication Guard Utility
 * Batas Kedaluwarsa Sesi: 6 Jam (21.600.000 ms) untuk keamanan kedinasan Polri.
 */

export const SESSION_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 jam dalam milidetik

export interface AuthSessionUser {
  id?: number | string;
  uuid?: string;
  nama_lengkap: string;
  nrp_nip: string;
  email: string;
  pangkat?: string;
  jabatan?: string;
  role: string;
  role_name?: string;
  can_delete?: boolean;
  permission_scope?: 'CRUD' | 'CRU';
  phone_number?: string;
  avatar_url?: string;
  token?: string;
}

export function saveAuthSession(user: AuthSessionUser, token?: string) {
  if (typeof window === 'undefined') return;
  const userToSave = { ...user, token: token || user.token };
  localStorage.setItem('sipintar_auth_user', JSON.stringify(userToSave));
  if (userToSave.token) {
    localStorage.setItem('sipintar_auth_token', userToSave.token);
  }
  localStorage.setItem('sipintar_session_login_time', Date.now().toString());
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sipintar_auth_user');
  localStorage.removeItem('sipintar_auth_token');
  localStorage.removeItem('sipintar_session_login_time');
}

export function getAuthSession(): { user: AuthSessionUser | null; isExpired: boolean } {
  if (typeof window === 'undefined') {
    return { user: null, isExpired: false };
  }

  const rawUser = localStorage.getItem('sipintar_auth_user');
  const loginTimeStr = localStorage.getItem('sipintar_session_login_time');

  if (!rawUser) {
    return { user: null, isExpired: false };
  }

  // Cek apakah waktu login sudah melebihi 6 jam
  if (loginTimeStr) {
    const loginTime = parseInt(loginTimeStr, 10);
    if (!isNaN(loginTime) && Date.now() - loginTime > SESSION_MAX_AGE_MS) {
      clearAuthSession();
      return { user: null, isExpired: true };
    }
  }

  try {
    const user = JSON.parse(rawUser) as AuthSessionUser;
    return { user, isExpired: false };
  } catch {
    clearAuthSession();
    return { user: null, isExpired: false };
  }
}

export function getRemainingSessionMs(): number {
  if (typeof window === 'undefined') return 0;
  const loginTimeStr = localStorage.getItem('sipintar_session_login_time');
  if (!loginTimeStr) return 0;
  const loginTime = parseInt(loginTimeStr, 10);
  if (isNaN(loginTime)) return 0;
  const elapsed = Date.now() - loginTime;
  const remaining = SESSION_MAX_AGE_MS - elapsed;
  return remaining > 0 ? remaining : 0;
}

