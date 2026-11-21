'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAuthSession, saveAuthSession, AuthSessionUser } from '@/lib/session';
import { sipintarApi } from '@/lib/apiClient';

// =========================================================================
// 1. DAFTAR RESMI 22 PANGKAT POLRI (Perkapolri No. 3 Tahun 2016)
// =========================================================================
export const PANGKAT_POLRI_GROUPS = [
  {
    category: 'Perwira Tinggi (Pati) Polri',
    icon: '⭐⭐⭐',
    items: [
      { code: 'Jenderal Polisi', name: 'Jenderal Polisi', desc: 'Perwira Tinggi (Tertinggi)', kesetaraan: 'IV/e' },
      { code: 'Komjen Pol', name: 'Komisaris Jenderal Polisi (Komjen Pol)', desc: 'Perwira Tinggi', kesetaraan: 'IV/e' },
      { code: 'Irjen Pol', name: 'Inspektur Jenderal Polisi (Irjen Pol)', desc: 'Perwira Tinggi', kesetaraan: 'IV/d' },
      { code: 'Brigjen Pol', name: 'Brigadir Jenderal Polisi (Brigjen Pol)', desc: 'Perwira Tinggi', kesetaraan: 'IV/c' },
    ],
  },
  {
    category: 'Perwira Menengah (Pamen) Polri',
    icon: '⭐⭐',
    items: [
      { code: 'Kombes Pol', name: 'Komisaris Besar Polisi (Kombes Pol)', desc: 'Perwira Menengah', kesetaraan: 'IV/c' },
      { code: 'AKBP', name: 'Ajun Komisaris Besar Polisi (AKBP)', desc: 'Perwira Menengah', kesetaraan: 'IV/b' },
      { code: 'Kompol', name: 'Komisaris Polisi (Kompol)', desc: 'Perwira Menengah', kesetaraan: 'IV/a' },
    ],
  },
  {
    category: 'Perwira Pertama (Pama) Polri',
    icon: '⭐',
    items: [
      { code: 'AKP', name: 'Ajun Komisaris Polisi (AKP)', desc: 'Perwira Pertama', kesetaraan: 'III/d' },
      { code: 'Iptu', name: 'Inspektur Polisi Satu (Iptu)', desc: 'Perwira Pertama', kesetaraan: 'III/c' },
      { code: 'Ipda', name: 'Inspektur Polisi Dua (Ipda)', desc: 'Perwira Pertama', kesetaraan: 'III/b' },
    ],
  },
  {
    category: 'Bintara Polri',
    icon: '🔷',
    items: [
      { code: 'Aiptu', name: 'Ajun Inspektur Polisi Satu (Aiptu)', desc: 'Bintara Tinggi', kesetaraan: 'II/d' },
      { code: 'Aipda', name: 'Ajun Inspektur Polisi Dua (Aipda)', desc: 'Bintara Tinggi', kesetaraan: 'II/c' },
      { code: 'Bripka', name: 'Brigadir Polisi Kepala (Bripka)', desc: 'Bintara', kesetaraan: 'II/c' },
      { code: 'Brigpol', name: 'Brigadir Polisi (Brigpol)', desc: 'Bintara', kesetaraan: 'II/b' },
      { code: 'Briptu', name: 'Brigadir Polisi Satu (Briptu)', desc: 'Bintara', kesetaraan: 'II/a' },
      { code: 'Bripda', name: 'Brigadir Polisi Dua (Bripda)', desc: 'Bintara', kesetaraan: 'II/a' },
    ],
  },
  {
    category: 'Tamtama Polri (Terendah)',
    icon: '🔶',
    items: [
      { code: 'Abrip', name: 'Ajun Brigadir Polisi (Abrip)', desc: 'Tamtama', kesetaraan: 'I/d' },
      { code: 'Abriptu', name: 'Ajun Brigadir Polisi Satu (Abriptu)', desc: 'Tamtama', kesetaraan: 'I/d' },
      { code: 'Abripda', name: 'Ajun Brigadir Polisi Dua (Abripda)', desc: 'Tamtama', kesetaraan: 'I/c' },
      { code: 'Bharaka', name: 'Bhayangkara Kepala (Bharaka)', desc: 'Tamtama', kesetaraan: 'I/b' },
      { code: 'Bharatu', name: 'Bhayangkara Satu (Bharatu)', desc: 'Tamtama', kesetaraan: 'I/b' },
      { code: 'Bharada', name: 'Bhayangkara Dua (Bharada)', desc: 'Tamtama (Terendah)', kesetaraan: 'I/a' },
    ],
  },
];

// =========================================================================
// 2. DAFTAR RESMI 17 PANGKAT PNS DI LINGKUNGAN POLRI
// =========================================================================
export const PANGKAT_PNS_POLRI_GROUPS = [
  {
    category: 'Golongan IV PNS (Pembina)',
    icon: '👔',
    items: [
      { code: 'Pembina Utama', name: 'Pembina Utama (PNS Gol. IV/e)', desc: 'Setara Jenderal / Komjen Pol', kesetaraan: 'IV/e' },
      { code: 'Pembina Utama Madya', name: 'Pembina Utama Madya (PNS Gol. IV/d)', desc: 'Setara Irjen Pol', kesetaraan: 'IV/d' },
      { code: 'Pembina Utama Muda', name: 'Pembina Utama Muda (PNS Gol. IV/c)', desc: 'Setara Brigjen / Kombes Pol', kesetaraan: 'IV/c' },
      { code: 'Pembina Tingkat I', name: 'Pembina Tingkat I (PNS Gol. IV/b)', desc: 'Setara AKBP', kesetaraan: 'IV/b' },
      { code: 'Pembina', name: 'Pembina (PNS Gol. IV/a)', desc: 'Setara Kompol', kesetaraan: 'IV/a' },
    ],
  },
  {
    category: 'Golongan III PNS (Penata)',
    icon: '👔',
    items: [
      { code: 'Penata Tingkat I', name: 'Penata Tingkat I (PNS Gol. III/d)', desc: 'Setara AKP', kesetaraan: 'III/d' },
      { code: 'Penata', name: 'Penata (PNS Gol. III/c)', desc: 'Setara Iptu', kesetaraan: 'III/c' },
      { code: 'Penata Muda Tingkat I', name: 'Penata Muda Tingkat I (PNS Gol. III/b)', desc: 'Setara Ipda', kesetaraan: 'III/b' },
      { code: 'Penata Muda', name: 'Penata Muda (PNS Gol. III/a)', desc: 'Calon Perwira', kesetaraan: 'III/a' },
    ],
  },
  {
    category: 'Golongan II PNS (Pengatur)',
    icon: '👔',
    items: [
      { code: 'Pengatur Tingkat I', name: 'Pengatur Tingkat I (PNS Gol. II/d)', desc: 'Setara Aiptu', kesetaraan: 'II/d' },
      { code: 'Pengatur', name: 'Pengatur (PNS Gol. II/c)', desc: 'Setara Aipda / Bripka', kesetaraan: 'II/c' },
      { code: 'Pengatur Muda Tingkat I', name: 'Pengatur Muda Tingkat I (PNS Gol. II/b)', desc: 'Setara Brigpol', kesetaraan: 'II/b' },
      { code: 'Pengatur Muda', name: 'Pengatur Muda (PNS Gol. II/a)', desc: 'Setara Briptu / Bripda', kesetaraan: 'II/a' },
    ],
  },
  {
    category: 'Golongan I PNS (Juru)',
    icon: '👔',
    items: [
      { code: 'Juru Tingkat I', name: 'Juru Tingkat I (PNS Gol. I/d)', desc: 'Setara Abrip / Abriptu', kesetaraan: 'I/d' },
      { code: 'Juru', name: 'Juru (PNS Gol. I/c)', desc: 'Setara Abripda', kesetaraan: 'I/c' },
      { code: 'Juru Muda Tingkat I', name: 'Juru Muda Tingkat I (PNS Gol. I/b)', desc: 'Setara Bharaka / Bharatu', kesetaraan: 'I/b' },
      { code: 'Juru Muda', name: 'Juru Muda (PNS Gol. I/a)', desc: 'Setara Bharada', kesetaraan: 'I/a' },
    ],
  },
];

// =========================================================================
// 3. DAFTAR RESMI 17 GOLONGAN RUANG PNS POLRI (I/a s.d IV/e) & KESETARAAN
// =========================================================================
export const GOLONGAN_PNS_OPTIONS = [
  {
    group: 'Golongan IV (Pembina / Setara Pamen - Pati Polri)',
    options: [
      { code: 'IV/e', label: 'IV/e – Pembina Utama (Setara Jenderal / Komjen Pol)' },
      { code: 'IV/d', label: 'IV/d – Pembina Utama Madya (Setara Irjen Pol)' },
      { code: 'IV/c', label: 'IV/c – Pembina Utama Muda (Setara Brigjen / Kombes Pol)' },
      { code: 'IV/b', label: 'IV/b – Pembina Tingkat I (Setara AKBP)' },
      { code: 'IV/a', label: 'IV/a – Pembina (Setara Kompol)' },
    ],
  },
  {
    group: 'Golongan III (Penata / Setara Pama Polri)',
    options: [
      { code: 'III/d', label: 'III/d – Penata Tingkat I (Setara AKP)' },
      { code: 'III/c', label: 'III/c – Penata (Setara Iptu)' },
      { code: 'III/b', label: 'III/b – Penata Muda Tingkat I (Setara Ipda)' },
      { code: 'III/a', label: 'III/a – Penata Muda' },
    ],
  },
  {
    group: 'Golongan II (Pengatur / Setara Bintara Polri)',
    options: [
      { code: 'II/d', label: 'II/d – Pengatur Tingkat I (Setara Aiptu)' },
      { code: 'II/c', label: 'II/c – Pengatur (Setara Aipda / Bripka)' },
      { code: 'II/b', label: 'II/b – Pengatur Muda Tingkat I (Setara Brigpol)' },
      { code: 'II/a', label: 'II/a – Pengatur Muda (Setara Briptu / Bripda)' },
    ],
  },
  {
    group: 'Golongan I (Juru / Setara Tamtama Polri)',
    options: [
      { code: 'I/d', label: 'I/d – Juru Tingkat I (Setara Abrip / Abriptu)' },
      { code: 'I/c', label: 'I/c – Juru (Setara Abripda)' },
      { code: 'I/b', label: 'I/b – Juru Muda Tingkat I (Setara Bharaka / Bharatu)' },
      { code: 'I/a', label: 'I/a – Juru Muda (Setara Bharada)' },
    ],
  },
];

// Helper mapping: Pangkat -> Kesetaraan Golongan Otomatis
export const MAP_PANGKAT_TO_GOLONGAN: Record<string, string> = {
  // Polri
  'Jenderal Polisi': 'IV/e',
  'Komjen Pol': 'IV/e',
  'Irjen Pol': 'IV/d',
  'Brigjen Pol': 'IV/c',
  'Kombes Pol': 'IV/c',
  'AKBP': 'IV/b',
  'Kompol': 'IV/a',
  'AKP': 'III/d',
  'Iptu': 'III/c',
  'Ipda': 'III/b',
  'Aiptu': 'II/d',
  'Aipda': 'II/c',
  'Bripka': 'II/c',
  'Brigpol': 'II/b',
  'Briptu': 'II/a',
  'Bripda': 'II/a',
  'Abrip': 'I/d',
  'Abriptu': 'I/d',
  'Abripda': 'I/c',
  'Bharaka': 'I/b',
  'Bharatu': 'I/b',
  'Bharada': 'I/a',
  // PNS Polri
  'Pembina Utama': 'IV/e',
  'Pembina Utama Madya': 'IV/d',
  'Pembina Utama Muda': 'IV/c',
  'Pembina Tingkat I': 'IV/b',
  'Pembina': 'IV/a',
  'Penata Tingkat I': 'III/d',
  'Penata': 'III/c',
  'Penata Muda Tingkat I': 'III/b',
  'Penata Muda': 'III/a',
  'Pengatur Tingkat I': 'II/d',
  'Pengatur': 'II/c',
  'Pengatur Muda Tingkat I': 'II/b',
  'Pengatur Muda': 'II/a',
  'Juru Tingkat I': 'I/d',
  'Juru': 'I/c',
  'Juru Muda Tingkat I': 'I/b',
  'Juru Muda': 'I/a',
};

export default function ProfilPenggunaPage() {
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields - Identitas & Jabatan
  const [namaLengkap, setNamaLengkap] = useState('');
  const [pangkat, setPangkat] = useState('');
  const [golongan, setGolongan] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Form Fields - Pendidikan & Sertifikasi
  const [pendidikanUmumTerakhir, setPendidikanUmumTerakhir] = useState('');
  const [pendidikanKedinasan, setPendidikanKedinasan] = useState('');
  const [sertifikasi, setSertifikasi] = useState('');

  // Form Fields - Kompetensi
  const [kompetensiUtama, setKompetensiUtama] = useState('');
  const [kompetensi, setKompetensi] = useState('');
  const [kompetensiPendukung, setKompetensiPendukung] = useState('');

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States & Feedback
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter & Helper Pangkat POLRI / PNS
  const [filterPangkatType, setFilterPangkatType] = useState<'all' | 'polri' | 'pns'>('all');

  const isPnsPangkat = (p: string) => {
    return PANGKAT_PNS_POLRI_GROUPS.some((g) => g.items.some((i) => i.code.toLowerCase() === p.toLowerCase()));
  };

  const handlePangkatSelect = (val: string) => {
    setPangkat(val);
    const autoGol = MAP_PANGKAT_TO_GOLONGAN[val];
    if (autoGol) {
      setGolongan(autoGol);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initProfile = async () => {
      const { user } = getAuthSession();
      if (user) {
        setCurrentUser(user);
        setNamaLengkap(user.nama_lengkap || '');
        setPangkat(
          user.pangkat ||
          (user.pangkat_golongan?.split('/')[0]?.trim()) ||
          (user.nrp_nip === 'dennyboy' ? 'KOMPOL' : user.nrp_nip === 'livi' ? 'AKP' : 'AKBP')
        );
        setGolongan(
          user.golongan ||
          (user.pangkat_golongan?.split('/')[1]?.trim()) ||
          (user.nrp_nip === 'dennyboy' ? 'IV/a' : user.nrp_nip === 'livi' ? 'III/d' : 'IV/b')
        );
        setJabatan(
          user.jabatan ||
          (user.nrp_nip === 'dennyboy'
            ? 'Super Administrator CRUD & Analis Sistem SIPINTAR'
            : user.nrp_nip === 'livi'
            ? 'Administrator CRU & Verifikator Konten SIPINTAR'
            : user.role === 'gadik'
            ? 'Gadik Madya Sespimma Lemdiklat Polri'
            : user.role === 'serdik'
            ? 'Peserta Didik (Serdik Sespimma)'
            : 'Personel Sespimma Lemdiklat Polri')
        );
        setPhoneNumber(user.phone_number || '');
        setEmail(user.email || '');
        setAvatarUrl(user.avatar_url || '');

        setPendidikanUmumTerakhir(user.pendidikan_umum_terakhir || '');
        setPendidikanKedinasan(user.pendidikan_kedinasan || '');
        setSertifikasi(user.sertifikasi || '');
        setKompetensiUtama(user.kompetensi_utama || '');
        setKompetensi(user.kompetensi || '');
        setKompetensiPendukung(user.kompetensi_pendukung || '');

        // Fetch fresh profile data from backend API
        try {
          const fresh = await sipintarApi.auth.getMe();
          if (fresh) {
            setNamaLengkap(fresh.nama_lengkap || user.nama_lengkap || '');
            if (fresh.pangkat) setPangkat(fresh.pangkat);
            if (fresh.golongan) {
              setGolongan(fresh.golongan);
            } else if (fresh.pangkat_golongan && fresh.pangkat_golongan.includes('/')) {
              setGolongan(fresh.pangkat_golongan.split('/')[1].trim());
            }
            if (fresh.jabatan) setJabatan(fresh.jabatan);
            if (fresh.phone_number) setPhoneNumber(fresh.phone_number);
            if (fresh.email) setEmail(fresh.email);
            if (fresh.avatar_url) setAvatarUrl(fresh.avatar_url);

            if (fresh.pendidikan_umum_terakhir) setPendidikanUmumTerakhir(fresh.pendidikan_umum_terakhir);
            if (fresh.pendidikan_kedinasan) setPendidikanKedinasan(fresh.pendidikan_kedinasan);
            if (fresh.sertifikasi) setSertifikasi(fresh.sertifikasi);
            if (fresh.kompetensi_utama) setKompetensiUtama(fresh.kompetensi_utama);
            if (fresh.kompetensi) setKompetensi(fresh.kompetensi);
            if (fresh.kompetensi_pendukung) setKompetensiPendukung(fresh.kompetensi_pendukung);

            // Update session cache
            const merged = { ...user, ...fresh };
            saveAuthSession(merged);
            setCurrentUser(merged);
          }
        } catch {
          // ignore error if offline or using mock
        }
      }
      setIsLoading(false);
    };

    initProfile();
  }, []);

  // --- PHOTO UPLOAD & REMOVE HANDLERS ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setProfileFeedback({
        type: 'error',
        message: 'Ukuran berkas foto terlalu besar. Maksimal ukuran berkas adalah 2 MB.',
      });
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setProfileFeedback({
        type: 'error',
        message: 'Format berkas tidak valid. Harap pilih gambar dengan format JPG, PNG, atau WEBP.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setProfileFeedback({
        type: 'success',
        message: 'Foto profil baru berhasil dimuat ke pratinjau. Klik "Simpan Perubahan Data" untuk menetapkan.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setProfileFeedback({
      type: 'success',
      message: 'Foto profil dihapus dari pratinjau. Klik "Simpan Perubahan Data" untuk menerapkan avatar inisial.',
    });
  };

  // --- PROFILE UPDATE SUBMIT ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      setProfileFeedback({ type: 'error', message: 'Nama lengkap wajib diisi.' });
      return;
    }

    setIsSubmittingProfile(true);
    setProfileFeedback(null);

    const synthesizedPangkatGolongan = pangkat && golongan ? `${pangkat} / ${golongan}` : (pangkat || golongan);
    const updatedData: Partial<AuthSessionUser> = {
      nama_lengkap: namaLengkap.trim(),
      pangkat: pangkat.trim(),
      golongan: golongan.trim(),
      pangkat_golongan: synthesizedPangkatGolongan.trim(),
      jabatan: jabatan.trim(),
      pendidikan_umum_terakhir: pendidikanUmumTerakhir.trim(),
      pendidikan_kedinasan: pendidikanKedinasan.trim(),
      sertifikasi: sertifikasi.trim(),
      kompetensi_utama: kompetensiUtama.trim(),
      kompetensi: kompetensi.trim(),
      kompetensi_pendukung: kompetensiPendukung.trim(),
      phone_number: phoneNumber.trim(),
      email: email.trim(),
      avatar_url: avatarUrl || undefined,
    };

    try {
      // 1. Send update to Backend API
      const res = await sipintarApi.auth.updateProfile(updatedData);

      // 2. Update local storage session
      if (currentUser) {
        const newSessionUser: AuthSessionUser = {
          ...currentUser,
          ...updatedData,
          ...(res?.data || res || {}),
        };
        saveAuthSession(newSessionUser);
        setCurrentUser(newSessionUser);
      }

      // 3. Dispatch global event to sync AppShell and header live
      window.dispatchEvent(new Event('sipintar-auth-changed'));

      setProfileFeedback({
        type: 'success',
        message: 'Data profil pengguna dan rincian kompetensi berhasil diperbarui secara permanen!',
      });
    } catch {
      // Graceful fallback: persist locally if API encounters network issue
      if (currentUser) {
        const newSessionUser: AuthSessionUser = {
          ...currentUser,
          ...updatedData,
        };
        saveAuthSession(newSessionUser);
        setCurrentUser(newSessionUser);
        window.dispatchEvent(new Event('sipintar-auth-changed'));
      }
      setProfileFeedback({
        type: 'success',
        message: 'Perubahan data profil berhasil disimpan pada sesi lokal aplikasi.',
      });
    } finally {
      setIsSubmittingProfile(false);
      setTimeout(() => setProfileFeedback(null), 6000);
    }
  };

  // --- CHANGE PASSWORD SUBMIT ---
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi saat ini wajib diisi.' });
      return;
    }

    if (!newPassword) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi baru wajib diisi.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi baru harus minimal 8 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Konfirmasi kata sandi baru tidak sesuai dengan kata sandi baru.' });
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const res = await sipintarApi.auth.changePassword(currentPassword, newPassword);
      setPasswordFeedback({
        type: 'success',
        message: res?.message || 'Kata sandi akun Anda berhasil diperbarui! Silakan gunakan kata sandi baru saat login berikutnya.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        message: err?.message || 'Gagal mengubah kata sandi. Pastikan kata sandi saat ini yang Anda masukkan benar.',
      });
    } finally {
      setIsSubmittingPassword(false);
      setTimeout(() => setPasswordFeedback(null), 8000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Memuat detail data pengguna...
      </div>
    );
  }

  const roleName = currentUser?.role_name || currentUser?.role || 'Pengguna';
  const isSuperadminCrud = currentUser?.role === 'admin' && currentUser?.permission_scope !== 'CRU' && currentUser?.nrp_nip !== 'livi';
  const isAdminCru = currentUser?.role === 'admin' && (currentUser?.permission_scope === 'CRU' || currentUser?.nrp_nip === 'livi');

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Detail Data Pengguna</span>
      </nav>

      {/* Hero Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #07162d 0%, #0d2549 50%, #16407c 100%)',
          color: '#ffffff',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(7, 22, 45, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.6px',
              }}
            >
              PROFIL PERSONEL KEDINASAN
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isSuperadminCrud ? '#34d399' : isAdminCru ? '#38bdf8' : '#fbbf24',
                backgroundColor: isSuperadminCrud ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: `1px solid ${isSuperadminCrud ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {isSuperadminCrud ? 'SUPERADMIN CRUD' : isAdminCru ? 'ADMIN CRU' : roleName.toUpperCase()}
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
            Detail Data Pengguna & Pengaturan Akun
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '720px', lineHeight: 1.5, margin: 0 }}>
            Kelola data identitas personel, pangkat kedinasan, golongan/ruang, jabatan saat ini, riwayat pendidikan umum & kedinasan, sertifikasi, kompetensi utama & pendukung, serta keamanan akun portal SIPINTAR Sespimma Lemdiklat Polri.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Status Personel:</div>
            <div style={{ fontWeight: 700, color: '#34d399' }}>✓ Aktif Terverifikasi Sespimma</div>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Column (Photo & Summary), Right Column (Profile Data & Password) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ========================================================================= */}
        {/* LEFT COLUMN: RUANG FOTO & STATUS HAK AKSES */}
        {/* ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card: Ruang Foto Profil */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>📸</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Ruang Foto Profil
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Avatar Preview Box */}
              <div
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  border: '4px solid rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  marginBottom: '14px',
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={namaLengkap || 'Foto Pengguna'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{namaLengkap?.slice(0, 2).toUpperCase() || 'PO'}</span>
                )}
              </div>

              {/* User Rank, Golongan & Name Tag */}
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                {pangkat ? `${pangkat} ` : ''}{golongan ? `(Gol. ${golongan}) ` : ''}{namaLengkap || 'Personel Sespimma'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                NRP/NIP: <strong>{currentUser?.nrp_nip || '-'}</strong>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              {/* Action Buttons for Photo */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid var(--color-primary)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Unggah Foto Baru</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: 1.4 }}>
                Format didukung: <strong>JPG, PNG, WEBP</strong> (Maksimal 2 MB). Disarankan menggunakan foto resmi kedinasan berseragam Polri.
              </div>
            </div>
          </section>

          {/* Card: Status Hak Akses Sistem */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Wewenang & Hak Akses
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Peran Institusional:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {roleName}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Cakupan Izin Operasi:</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: isSuperadminCrud ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: isSuperadminCrud ? '#16a34a' : '#0284c7',
                  }}
                >
                  {isSuperadminCrud
                    ? 'CRUD PENUH (CREATE, READ, UPDATE, DELETE)'
                    : isAdminCru
                    ? 'CRU AKTIF (CREATE, READ, UPDATE - TANPA DELETE)'
                    : 'AKSES STANDAR KEDINASAN'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Status Akun:</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                  Aktif & Terverifikasi Kedinasan
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DETAIL DATA PENGGUNA, PENDIDIKAN, KOMPETENSI, & PASSWORD */}
        {/* ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card: Form Detail Identitas, Pendidikan & Kompetensi */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Detail Data Pengguna & Kompetensi
              </h2>
            </div>

            {profileFeedback && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: profileFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: profileFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                  border: `1px solid ${profileFeedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
                }}
              >
                {profileFeedback.message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* --- KELOMPOK 1: IDENTITAS KEDINASAN & JABATAN --- */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎖️</span>
                  <span>1. Identitas Kedinasan & Jabatan</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Baris: NRP/NIP, Pangkat Kedinasan & Golongan/Ruang */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                        NRP / NIP (Kunci Akun)
                      </label>
                      <input
                        type="text"
                        value={currentUser?.nrp_nip || ''}
                        disabled
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface-hover)',
                          color: 'var(--color-text-muted)',
                          fontSize: '13px',
                          cursor: 'not-allowed',
                          fontWeight: 600,
                        }}
                      />
                      <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Identitas resmi kedinasan (terkunci)</span>
                    </div>

                    {/* Input Pangkat Kedinasan */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                          Pangkat Kedinasan
                        </label>
                        <span style={{ fontSize: '10.5px', color: 'var(--color-primary)', fontWeight: 700 }}>
                          {isPnsPangkat(pangkat) ? '👔 PNS POLRI' : '👮‍♂️ POLRI (Perkap 3/2016)'}
                        </span>
                      </div>

                      {/* Dropdown 22 Pangkat POLRI / 17 Pangkat PNS */}
                      <select
                        value={pangkat}
                        onChange={(e) => handlePangkatSelect(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-main)',
                          fontSize: '13px',
                          fontWeight: 700,
                          marginBottom: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">-- Pilih Pangkat Resmi --</option>
                        {/* Jika pangkat tersimpan di database belum ada di daftar, render opsi khusus */}
                        {pangkat &&
                          !PANGKAT_POLRI_GROUPS.some((g) => g.items.some((i) => i.code === pangkat)) &&
                          !PANGKAT_PNS_POLRI_GROUPS.some((g) => g.items.some((i) => i.code === pangkat)) && (
                            <option value={pangkat}>{pangkat} (Tersimpan)</option>
                          )}

                        {/* Kelompok Pangkat POLRI (22 Tingkatan - Perkapolri No. 3/2016) */}
                        {(filterPangkatType === 'all' || filterPangkatType === 'polri') && (
                          <>
                            {PANGKAT_POLRI_GROUPS.map((grp) => (
                              <optgroup key={grp.category} label={`👮‍♂️ ${grp.category.toUpperCase()}`}>
                                {grp.items.map((item) => (
                                  <option key={item.code} value={item.code}>
                                    {item.name} ({item.desc})
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </>
                        )}

                        {/* Kelompok Pangkat PNS POLRI (17 Jenjang - Gol. I s.d IV) */}
                        {(filterPangkatType === 'all' || filterPangkatType === 'pns') && (
                          <>
                            {PANGKAT_PNS_POLRI_GROUPS.map((grp) => (
                              <optgroup key={grp.category} label={`👔 ${grp.category.toUpperCase()}`}>
                                {grp.items.map((item) => (
                                  <option key={item.code} value={item.code}>
                                    {item.name}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </>
                        )}
                      </select>

                      {/* Input teks pendukung untuk fleksibilitas */}
                      <input
                        type="text"
                        value={pangkat}
                        onChange={(e) => setPangkat(e.target.value)}
                        placeholder="Ketik atau pilih pangkat resmi..."
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border-subtle)',
                          backgroundColor: 'var(--color-surface-hover)',
                          color: 'var(--color-text-main)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    {/* Input Golongan / Ruang PNS POLRI */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                          Golongan / Ruang PNS
                        </label>
                        <span style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 700 }}>
                          Jenjang I/a s.d IV/e
                        </span>
                      </div>

                      {/* Dropdown 17 Golongan Ruang PNS */}
                      <select
                        value={golongan}
                        onChange={(e) => setGolongan(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-main)',
                          fontSize: '13px',
                          fontWeight: 700,
                          marginBottom: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">-- Pilih Golongan / Ruang --</option>
                        {/* Jika golongan tersimpan (misal IV-B) belum di format slash, tetap tampilkan */}
                        {golongan &&
                          !GOLONGAN_PNS_OPTIONS.some((g) => g.options.some((o) => o.code === golongan)) && (
                            <option value={golongan}>{golongan} (Tersimpan)</option>
                          )}

                        {GOLONGAN_PNS_OPTIONS.map((grp) => (
                          <optgroup key={grp.group} label={`👔 ${grp.group.toUpperCase()}`}>
                            {grp.options.map((opt) => (
                              <option key={opt.code} value={opt.code}>
                                {opt.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      {/* Input teks pendukung untuk fleksibilitas */}
                      <input
                        type="text"
                        value={golongan}
                        onChange={(e) => setGolongan(e.target.value)}
                        placeholder="Contoh: IV/b atau IV/a"
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border-subtle)',
                          backgroundColor: 'var(--color-surface-hover)',
                          color: 'var(--color-text-main)',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  {/* Filter Cepat Tipe Kepangkatan */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '-4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      Tampilkan Opsi:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterPangkatType('all')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: filterPangkatType === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: filterPangkatType === 'all' ? 'var(--color-primary)' : 'transparent',
                        color: filterPangkatType === 'all' ? '#ffffff' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      Semua (39 Pangkat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPangkatType('polri')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: filterPangkatType === 'polri' ? '#2563eb' : 'var(--color-border)',
                        backgroundColor: filterPangkatType === 'polri' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                        color: filterPangkatType === 'polri' ? '#2563eb' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      👮‍♂️ 22 Pangkat POLRI (Perkap 3/2016)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPangkatType('pns')}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: filterPangkatType === 'pns' ? '#0284c7' : 'var(--color-border)',
                        backgroundColor: filterPangkatType === 'pns' ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
                        color: filterPangkatType === 'pns' ? '#0284c7' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      👔 17 Pangkat PNS POLRI
                    </button>
                  </div>

                  {/* Kotak Pedoman Resmi Kepangkatan & Golongan Ruang */}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-surface-hover)',
                      border: '1px solid var(--color-border)',
                      fontSize: '11.5px',
                      lineHeight: 1.5,
                      color: 'var(--color-text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '6px' }}>
                      <span>⚖️ Pedoman Resmi Kepangkatan POLRI & Golongan Ruang PNS POLRI:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                      <div style={{ backgroundColor: 'var(--color-surface)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                        <strong style={{ color: 'var(--color-text-main)', display: 'block', marginBottom: '3px' }}>
                          👮‍♂️ Pangkat POLRI (22 Tingkatan - Perkapolri No. 3/2016):
                        </strong>
                        <div style={{ fontSize: '11px', lineHeight: 1.45 }}>
                          • <strong>Tamtama:</strong> Bharada, Bharatu, Bharaka, Abripda, Abriptu, Abrip.<br />
                          • <strong>Bintara:</strong> Bripda, Briptu, Brigpol, Bripka, Aipda, Aiptu.<br />
                          • <strong>Pama:</strong> Ipda, Iptu, AKP.<br />
                          • <strong>Pamen:</strong> Kompol, AKBP, Kombes Pol.<br />
                          • <strong>Pati:</strong> Brigjen Pol, Irjen Pol, Komjen Pol, Jenderal Polisi.
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--color-surface)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)' }}>
                        <strong style={{ color: 'var(--color-text-main)', display: 'block', marginBottom: '3px' }}>
                          👔 Golongan Ruang PNS POLRI (I/a s.d IV/e):
                        </strong>
                        <div style={{ fontSize: '11px', lineHeight: 1.45 }}>
                          • <strong>Golongan I (Juru):</strong> I/a (Juru Muda) s.d I/d (Juru Tk. I).<br />
                          • <strong>Golongan II (Pengatur):</strong> II/a (Pengatur Muda) s.d II/d (Pengatur Tk. I).<br />
                          • <strong>Golongan III (Penata):</strong> III/a (Penata Muda) s.d III/d (Penata Tk. I).<br />
                          • <strong>Golongan IV (Pembina):</strong> IV/a (Pembina) s.d IV/e (Pembina Utama).<br />
                          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>* Disetarakan dengan jenjang kepangkatan Polri untuk administrasi dinas.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Baris: Nama Lengkap */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Nama Lengkap Beserta Gelar
                    </label>
                    <input
                      type="text"
                      required
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: Dewi Susilo Pangestuti, S.Ak."
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  {/* Baris: Jabatan Saat Ini */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Jabatan Saat Ini
                    </label>
                    <input
                      type="text"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Contoh: Gadik Madya Sespimma Lemdiklat Polri / Super Administrator CRUD"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  {/* Baris: Email & Telepon */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                        Email Kedinasan
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@sespimma.polri.go.id"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-main)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                        Nomor Telepon / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-text-main)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- KELOMPOK 2: RIWAYAT PENDIDIKAN & SERTIFIKASI --- */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎓</span>
                  <span>2. Riwayat Pendidikan & Sertifikasi</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Pendidikan Umum Terakhir */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Pendidikan Umum Terakhir
                    </label>
                    <input
                      type="text"
                      value={pendidikanUmumTerakhir}
                      onChange={(e) => setPendidikanUmumTerakhir(e.target.value)}
                      placeholder="Contoh: S1 Akuntansi (S.Ak) / S2 Magister Hukum (M.H.)"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  {/* Pendidikan Kedinasan / Profesi yang Relevan */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Pendidikan Kedinasan / Profesi yang Relevan
                    </label>
                    <textarea
                      rows={2}
                      value={pendidikanKedinasan}
                      onChange={(e) => setPendidikanKedinasan(e.target.value)}
                      placeholder="Contoh: PKN Tingkat II Angkatan XXIX Nawasena TA 2026, Sespimma Lemdiklat Polri, Dikjur Manajemen Keuangan Polri"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Sertifikasi */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Sertifikasi
                    </label>
                    <textarea
                      rows={2}
                      value={sertifikasi}
                      onChange={(e) => setSertifikasi(e.target.value)}
                      placeholder="Contoh: Sertifikasi Asesor Kompetensi BNSP, Pendidik Vokasi Kepolisian, Sertifikasi Akuntan Pemerintah"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* --- KELOMPOK 3: PEMETAAN KOMPETENSI PERSONEL --- */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.08))' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💡</span>
                  <span>3. Pemetaan Kompetensi Personel</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Kompetensi Utama */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Kompetensi Utama (Kepakaran Pokok)
                    </label>
                    <textarea
                      rows={2}
                      value={kompetensiUtama}
                      onChange={(e) => setKompetensiUtama(e.target.value)}
                      placeholder="Contoh: Manajemen Keuangan Negara & Polri, Tata Kelola Akuntansi Pemerintahan Presisi"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Kompetensi Bidang / Teknis */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Kompetensi Bidang / Teknis
                    </label>
                    <textarea
                      rows={2}
                      value={kompetensi}
                      onChange={(e) => setKompetensi(e.target.value)}
                      placeholder="Contoh: Pemeriksaan Keuangan Internal, Penganggaran Berbasis Kinerja, Evaluasi Hanjar Kurikulum"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Kompetensi Pendukung */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Kompetensi Pendukung
                    </label>
                    <textarea
                      rows={2}
                      value={kompetensiPendukung}
                      onChange={(e) => setKompetensiPendukung(e.target.value)}
                      placeholder="Contoh: Analisis Laporan Keuangan, Kepemimpinan Strategis Sespimma, Literasi Regulasi Keuangan Negara"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '13px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button Profile */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  style={{
                    padding: '11px 22px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    cursor: isSubmittingProfile ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    opacity: isSubmittingProfile ? 0.7 : 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>{isSubmittingProfile ? 'Menyimpan...' : 'Simpan Perubahan Data'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Card: Ganti Kata Sandi (Password) */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>🔒</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Keamanan & Ganti Kata Sandi
              </h2>
            </div>

            {passwordFeedback && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: passwordFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: passwordFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                  border: `1px solid ${passwordFeedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
                }}
              >
                {passwordFeedback.message}
              </div>
            )}

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Kata Sandi Saat Ini */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Kata Sandi Saat Ini
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi yang sedang digunakan"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showCurrentPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showCurrentPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Kata Sandi Baru (Minimal 8 Karakter)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru yang kuat"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showNewPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showNewPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Konfirmasi Kata Sandi Baru
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showConfirmPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Password Checklist Helper */}
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.5, backgroundColor: 'var(--color-surface-hover)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                🔒 <strong>Standar Keamanan Sespimma:</strong> Gunakan kombinasi huruf besar, huruf kecil, dan angka dengan panjang minimal 8 karakter untuk melindungi akun kedinasan Anda.
              </div>

              {/* Submit Button Password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid #16a34a',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    cursor: isSubmittingPassword ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                    opacity: isSubmittingPassword ? 0.7 : 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>{isSubmittingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
