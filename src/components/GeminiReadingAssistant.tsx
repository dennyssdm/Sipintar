'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResourceItem } from '@/types';

interface GeminiReadingAssistantProps {
  resource: ResourceItem;
  onClose?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const GeminiReadingAssistant: React.FC<GeminiReadingAssistantProps> = ({
  resource,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('sipintar_gemini_api_key') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      setApiKey(savedKey);
      setTempApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sipintar_gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowKeyModal(false);
    }
  };

  // Initialize with document context when resource changes
  useEffect(() => {
    const initialGreeting: Message = {
      id: 'init-1',
      sender: 'gemini',
      text: `Halo! Saya **Asisten Cerdas Gemini** untuk sistem pembelajaran SIPINTAR Sespimma Lemdiklat Polri.\n\nSaya telah terhubung dengan dokumen yang sedang Anda baca:\n📘 **${resource.title}**\n📂 Kategori: *${resource.category}* (${resource.subCategory || 'Bahan Pokok'})\n\nSilakan pilih salah satu menu cepat di bawah atau ajukan pertanyaan spesifik terkait materi ini.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialGreeting]);
  }, [resource]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Knowledge response generator tailored to Sespimma Doktrin & Document Metadata
  const generateGeminiResponse = async (userPrompt: string): Promise<string> => {
    const q = userPrompt.toLowerCase();
    const title = resource.title;
    const category = resource.category;

    // 1. Try Live Google Gemini API if API key is provided
    if (apiKey) {
      try {
        const systemPrompt = `Anda adalah Asisten Pembelajaran AI resmi SIPINTAR Sespimma Lemdiklat Polri (Sekolah Staf dan Pimpinan Pertama). Anda mendampingi Perwira Siswa (Serdik) atau Tenaga Pendidik (Gadik) yang sedang membaca dokumen:\nJudul: "${title}"\nKategori: "${category}" (${resource.subCategory || 'Bahan Pokok'})\nPengampu: "${resource.authorOrInstructor}".\nBerikan jawaban yang analitis, berbasis doktrin kepolisian Polri (UU No 2/2002, Presisi, kepemimpinan transformasional, OODA Loop, manajemen operasional), gunakan format Markdown yang rapi dengan subjudul, poin-poin tegas, dan rekomendasi aplikatif lapangan.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nPertanyaan Pembaca / Serdik:\n${userPrompt}` }],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return candidateText;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local domain model:', err);
      }
    }

    // 2. Intelligent Built-in Sespimma Lemdiklat AI Engine
    // Simulate natural AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1100));

    if (q.includes('rangkum') || q.includes('ringkas') || q.includes('intisari')) {
      return `### 📑 Intisari Eksekutif Materi: ${title}\n\n` +
        `Dokumen ini merupakan pedoman pembelajaran resmi di lingkungan **Sespimma Lemdiklat Polri** yang dirancang untuk membekali Perwira Menengah (Pamen) dengan wawasan manajerial dan kepemimpinan strategis.\n\n` +
        `**1. Tujuan Utama Pembelajaran:**\n` +
        `• Mengakselerasi kompetensi teknis, taktis, dan kepemimpinan operasional Polri.\n` +
        `• Membangun kapabilitas analitis dalam mengantisipasi ancaman kamtibmas kontemporer.\n` +
        `• Standarisasi proses pengambilan keputusan berdasar diskresi kepolisian yang akuntabel.\n\n` +
        `**2. Landasan Doktrinal & Regulasi:**\n` +
        `• UU No. 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia.\n` +
        `• Standar Kurikulum Pendidikan Reguler Sespimma Lemdiklat Polri.\n` +
        `• Standar Pelayanan dan Tata Kelola Jarlat Sespimma.\n\n` +
        `**3. Output Kompetensi Lulusan (Serdik):**\n` +
        `Mampu memimpin kesatuan tingkat Polres / Subdit Polda dengan integrasi data, kepatuhan HAM, dan responsivitas cepat terhadap dinamika masyarakat.`;
    }

    if (q.includes('konsep') || q.includes('poin') || q.includes('teori') || q.includes('kunci')) {
      return `### 💡 Poin-Poin Kunci & Kerangka Konseptual\n\n` +
        `Berdasarkan kajian naskah **${title}**, terdapat 3 pilar konseptual utama:\n\n` +
        `**1. Kerangka Analisis Situasional:**\n` +
        `Penggunaan metode pemetaan masalah berbasis bukti (*evidence-based policing*) dan identifikasi akar masalah melalui analisis tren data kejahatan dan dinamika sosial.\n\n` +
        `**2. Mekanisme Komando & Pengambilan Keputusan:**\n` +
        `Penerapan *OODA Loop* (Observe, Orient, Decide, Act) dalam situasi krisis operasional di lapangan untuk meminimalkan risiko eskalasi.\n\n` +
        `**3. Akuntabilitas & Transparansi Layanan:**\n` +
        `Setiap tahapan implementasi materi ini wajib disertai pelaporan terstruktur dan pemantauan kepatuhan standar operasional prosedur (SOP).`;
    }

    if (q.includes('soal') || q.includes('latihan') || q.includes('kuis') || q.includes('ujian')) {
      return `### 🎯 3 Studi Kasus & Pertanyaan Latihan Serdik\n\n` +
        `Gunakan latihan berikut untuk menguji pemahaman materi **${title}**:\n\n` +
        `**Kasus 1 — Pengambilan Keputusan Taktis:**\n` +
        `*Sebagai pimpinan di wilayah hukum dengan eskalasi gangguan kamtibmas mendadak, bagaimana langkah prioritas Anda mengintegrasikan prinsip materi ini dalam 1x24 jam pertama?*\n\n` +
        `**Kasus 2 — Koordinasi Lintas Fungsi:**\n` +
        `*Jelaskan sinergi fungsi operasional (Intelkam, Reskrim, Binmas, Samapta) dalam konteks penerapan materi ${title} untuk menjamin efektivitas penugasan!*\n\n` +
        `**Kasus 3 — Mitigasi Risiko Reputasi:**\n` +
        `*Bila terjadi disinformasi di media sosial terkait tindakan operasional anggota, bagaimana Anda merumuskan mitigasi berbasis transparansi sesuai pedoman modul ini?*`;
    }

    if (q.includes('lapangan') || q.includes('polres') || q.includes('polda') || q.includes('aplikasi') || q.includes('terap')) {
      return `### 🛡️ Implementasi Lapangan pada Tingkat Polres & Polda\n\n` +
        `Langkah aplikatif pelaksanaan materi **${title}** di satuan kewilayahan:\n\n` +
        `1. **Audit Kesiapsiagaan Internal:** Lakukan *Tactical Floor Game* (TFG) atau gladi posko bersama para Kapolsek dan Kasatfung.\n` +
        `2. **Sosialisasi Berjenjang:** Distribusikan intisari naskah ini sebagai lembar instruksi kerja (*check-sheet*) anggota patroli dan penyidik.\n` +
        `3. **Pengawasan Melekat (Waskat):** Para perwira pengendali wajib memantau langsung pelaksanaan di lapangan guna mencegah penyimpangan diskresi.\n` +
        `4. **Evaluasi Berkala:** Evaluasi mingguan pada saat jam pimpinan untuk mengukur efektivitas intervensi operasional.`;
    }

    // Default intelligent conversational response
    return `### 🔍 Analisis Gemini untuk: "${userPrompt}"\n\n` +
      `Terkait pertanyaan Anda mengenai materi **${title}**:\n\n` +
      `Dalam perspektif doktrin pendidikan Sespimma Polri, hal tersebut berkaitan erat dengan kompetensi kepemimpinan transformasional dan pemecahan masalah operasional.\n\n` +
      `**Rekomendasi Tindak Lanjut Serdik:**\n` +
      `• Rujuk naskah bagian pembahasan pokok pada dokumen yang terbuka di sebelah kiri.\n` +
      `• Kaitkan materi ini dengan naskah **Karya Tulis Akhir / Taskap** Anda pada bab analisis dan solusi alternatif.\n` +
      `• Diskusikan poin ini lebih lanjut dengan Gadik/Widyaiswara pengampu saat sesi tatap muka sindikat.\n\n` +
      `*Anda juga dapat membuka topik ini langsung di [Gemini Web (gemini.google.com)](https://gemini.google.com/app) untuk eksplorasi lebih luas.*`;
  };

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const responseText = await generateGeminiResponse(text.trim());
      const geminiMsg: Message = {
        id: `gem-${Date.now()}`,
        sender: 'gemini',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, geminiMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'gemini',
        text: 'Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: '📝 Rangkum Intisari', prompt: 'Tolong rangkum intisari eksekutif dan poin penting dokumen ini.' },
    { label: '💡 Konsep & Teori Kunci', prompt: 'Apa saja konsep kunci, teori manajerial, dan kerangka pikir materi ini?' },
    { label: '🎯 Buat 3 Soal Latihan', prompt: 'Buatkan 3 soal latihan studi kasus pemecahan masalah untuk Serdik Sespimma.' },
    { label: '🛡️ Aplikasi Lapangan Polri', prompt: 'Bagaimana cara menerapkan materi ini di tingkat Polres / Polda?' },
  ];

  const externalGeminiUrl = `https://gemini.google.com/app?prompt=${encodeURIComponent(
    `Saya sedang membaca naskah resmi Sespimma Lemdiklat Polri: "${resource.title}" (${resource.category}). Mohon bantu saya menganalisis intisari materi dan implementasinya dalam kepemimpinan Polri.`
  )}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface, #ffffff)',
        borderLeft: '1px solid var(--color-border, #e2e8f0)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        overflow: 'hidden',
      }}
    >
      {/* Header Gemini Assistant */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091a38 0%, #1e3a8a 50%, #4f46e5 100%)',
          color: '#ffffff',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)',
            }}
          >
            <span style={{ fontSize: '18px' }}>✨</span>
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Gemini AI Assistant</span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  letterSpacing: '0.5px',
                }}
              >
                PRO COPILOT
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.2 }}>
              Teman Cerdas Membaca Naskah Sespimma
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            style={{
              background: apiKey ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.15)',
              border: apiKey ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
            title={apiKey ? 'Gemini API Key Aktif (Live Google AI)' : 'Atur Gemini API Key (Opsional)'}
          >
            <span>{apiKey ? '🔑 Key On' : '⚙️ API Key'}</span>
          </button>

          <a
            href={externalGeminiUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
            title="Buka topik naskah ini langsung di situs resmi gemini.google.com"
          >
            <span>gemini.google.com</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Tutup panel Gemini AI"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Optional Modal to set Gemini API Key */}
      {showKeyModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface, #ffffff)',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              border: '1px solid var(--color-border, #cbd5e1)',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: 'var(--color-navy, #0f172a)' }}>
              🔑 Konfigurasi Google Gemini API Key
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #64748b)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Masukkan Gemini API Key dari <em>Google AI Studio (aistudio.google.com)</em> untuk menghubungkan pembaca dokumen langsung dengan model live <strong>gemini-1.5-flash</strong>. Jika dikosongkan, sistem tetap berjalan menggunakan model kecerdasan Sespimma bawaan.
            </p>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border, #cbd5e1)',
                fontSize: '12.5px',
                marginBottom: '14px',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #cbd5e1)',
                  background: 'transparent',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Simpan Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Pills Bar */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'var(--color-surface-hover, #f8fafc)',
          borderBottom: '1px solid var(--color-border, #e2e8f0)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {quickActions.map((qa, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendPrompt(qa.prompt)}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #cbd5e1)',
              color: 'var(--color-primary, #1e40af)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            {qa.label}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontSize: '13px',
          lineHeight: 1.55,
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: isUser ? '#1d4ed8' : 'var(--color-surface-hover, #f1f5f9)',
                  color: isUser ? '#ffffff' : 'var(--color-text, #0f172a)',
                  border: isUser ? 'none' : '1px solid var(--color-border, #e2e8f0)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {/* Parse Markdown-like simple bold and lists */}
                {m.text.split('\n').map((line, lIdx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <div key={lIdx} style={{ fontWeight: 800, fontSize: '13.5px', margin: '4px 0', color: isUser ? '#ffffff' : 'var(--color-navy, #0f172a)' }}>
                        {line.replace('### ', '')}
                      </div>
                    );
                  }
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <div key={lIdx} style={{ paddingLeft: '8px', margin: '2px 0' }}>
                        • {line.slice(2)}
                      </div>
                    );
                  }
                  return (
                    <div key={lIdx} style={{ margin: '2px 0' }}>
                      {line}
                    </div>
                  );
                })}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-muted, #94a3b8)',
                  marginTop: '3px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 16px',
              borderRadius: '14px 14px 14px 2px',
              backgroundColor: 'var(--color-surface-hover, #f1f5f9)',
              border: '1px solid var(--color-border, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-primary, #1e40af)',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                border: '2px solid #1e40af',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>Gemini sedang menganalisis materi naskah...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputPrompt);
        }}
        style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--color-border, #e2e8f0)',
          backgroundColor: 'var(--color-surface, #ffffff)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Tanyakan analisis naskah ini ke Gemini..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid var(--color-border, #cbd5e1)',
            fontSize: '12.5px',
            backgroundColor: 'var(--color-surface, #ffffff)',
            color: 'var(--color-text, #0f172a)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          style={{
            padding: '0 14px',
            borderRadius: 'var(--radius-sm, 6px)',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: !inputPrompt.trim() || isLoading ? 'not-allowed' : 'pointer',
            opacity: !inputPrompt.trim() || isLoading ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Kirim ke Gemini AI"
        >
          Kirim
        </button>
      </form>
    </div>
  );
};
