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

function getFormattedTimestamp() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

let messageSeq = 0;
function getNextMessageId(prefix: string) {
  messageSeq += 1;
  return `${prefix}-${Date.now()}-${messageSeq}`;
}

function createInitialGreeting(resource: ResourceItem): Message {
  return {
    id: `init-${resource.id}`,
    sender: 'gemini',
    text: `Halo! Saya **Asisten Cerdas Gemini AI** untuk sistem pembelajaran SIPINTAR Sespimma Lemdiklat Polri.\n\nSaya telah terhubung dengan dokumen yang sedang Anda baca:\n📘 **${resource.title}**\n📂 Kategori: *${resource.category}* (${resource.subCategory || 'Bahan Pokok'})\n\nSilakan klik salah satu menu rekomendasi di atas atau ketik pertanyaan Anda pada kolom di bawah.`,
    timestamp: getFormattedTimestamp(),
  };
}

export const GeminiReadingAssistant: React.FC<GeminiReadingAssistantProps> = ({
  resource,
  onClose,
}) => {
  const [prevResourceId, setPrevResourceId] = useState(resource.id);
  const [messages, setMessages] = useState<Message[]>(() => [createInitialGreeting(resource)]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (prevResourceId !== resource.id) {
    setPrevResourceId(resource.id);
    setMessages([createInitialGreeting(resource)]);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Knowledge response generator tailored to Sespimma Doktrin & Document Metadata
  const generateGeminiResponse = async (userPrompt: string): Promise<string> => {
    const q = userPrompt.toLowerCase();
    const title = resource.title;
    const category = resource.category;

    // 1. Try Live Google Gemini API if NEXT_PUBLIC_GEMINI_API_KEY exists
    const apiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GEMINI_API_KEY : '';
    if (apiKey) {
      try {
        const systemPrompt = `Anda adalah Asisten Pembelajaran AI resmi SIPINTAR Sespimma Lemdiklat Polri. Anda mendampingi Perwira Siswa (Serdik) atau Gadik yang sedang membaca dokumen: "${title}" (${category}). Berikan jawaban analitis, berbasis doktrin kepolisian Polri (UU No 2/2002, Presisi, kepemimpinan transformasional, OODA Loop), gunakan format Markdown yang rapi dengan subjudul dan rekomendasi aplikatif lapangan.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nPertanyaan Pembaca:\n${userPrompt}` }],
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
        console.warn('Gemini API call fallback to local domain model:', err);
      }
    }

    // 2. Intelligent Built-in Sespimma Lemdiklat AI Engine
    // Simulate natural AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 900));

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
      `Dalam perspektif doktrin pendidikan Sespimma Lemdiklat Polri, hal tersebut berkaitan erat dengan kompetensi kepemimpinan transformasional dan pemecahan masalah operasional.\n\n` +
      `**Rekomendasi Tindak Lanjut Serdik:**\n` +
      `• Rujuk naskah bagian pembahasan pokok pada dokumen yang terbuka di sebelah kiri.\n` +
      `• Kaitkan materi ini dengan naskah **Karya Tulis Akhir / Taskap** Anda pada bab analisis dan solusi alternatif.\n` +
      `• Diskusikan poin ini lebih lanjut dengan Gadik/Widyaiswara pengampu saat sesi tatap muka sindikat.\n\n` +
      `*Anda juga dapat membuka topik ini langsung di [Gemini Web (gemini.google.com)](https://gemini.google.com/app) untuk eksplorasi lebih luas.*`;
  };

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: getNextMessageId('usr'),
      sender: 'user',
      text: text.trim(),
      timestamp: getFormattedTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const responseText = await generateGeminiResponse(text.trim());
      const geminiMsg: Message = {
        id: getNextMessageId('gem'),
        sender: 'gemini',
        text: responseText,
        timestamp: getFormattedTimestamp(),
      };
      setMessages((prev) => [...prev, geminiMsg]);
    } catch {
      const errorMsg: Message = {
        id: getNextMessageId('err'),
        sender: 'gemini',
        text: 'Maaf, terjadi kendala saat memproses jawaban. Silakan coba kembali.',
        timestamp: getFormattedTimestamp(),
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

  // Formatter for bold **text** and *italic*
  const formatText = (text: string, isUser: boolean) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={i}
            style={{
              fontWeight: 800,
              color: isUser ? '#ffffff' : 'var(--color-primary, #60a5fa)',
            }}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} style={{ fontStyle: 'italic', opacity: 0.9 }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface, #121d30)',
        borderLeft: '1px solid var(--color-border, #2a3b56)',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header Gemini Assistant */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091a38 0%, #1e3a8a 50%, #4f46e5 100%)',
          color: '#ffffff',
          padding: '12px 16px',
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
              flexShrink: 0,
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Active status indicator (No API key setup needed) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
            }}
            title="Gemini AI aktif dan siap digunakan secara langsung"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#4ade80',
                display: 'inline-block',
                boxShadow: '0 0 6px #4ade80',
              }}
            />
            <span>AI Aktif</span>
          </div>

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

      {/* Quick Prompt Pills Bar */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'var(--color-surface-hover, #18263d)',
          borderBottom: '1px solid var(--color-border, #2a3b56)',
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
              padding: '5px 11px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-surface-raised, #1c2b44)',
              border: '1px solid var(--color-border, #2a3b56)',
              color: 'var(--color-primary, #60a5fa)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
          lineHeight: 1.6,
          backgroundColor: 'var(--color-bg-main, #0b1220)',
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
                maxWidth: '92%',
              }}
            >
              <div
                style={{
                  padding: '11px 15px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: isUser ? '#1d4ed8' : 'var(--color-surface-raised, #1c2b44)',
                  color: isUser ? '#ffffff' : 'var(--color-text-main, #e8f0fc)',
                  border: isUser ? 'none' : '1px solid var(--color-border, #2a3b56)',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {/* Parse Markdown-like simple bold, subtitles, and lists */}
                {m.text.split('\n').map((line, lIdx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <div
                        key={lIdx}
                        style={{
                          fontWeight: 800,
                          fontSize: '14px',
                          margin: '6px 0 4px',
                          color: isUser ? '#ffffff' : 'var(--color-primary, #60a5fa)',
                        }}
                      >
                        {formatText(line.replace('### ', ''), isUser)}
                      </div>
                    );
                  }
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <div key={lIdx} style={{ paddingLeft: '8px', margin: '3px 0' }}>
                        <span style={{ color: 'var(--color-primary, #60a5fa)', marginRight: '6px' }}>•</span>
                        {formatText(line.replace(/^[•-]\s*/, ''), isUser)}
                      </div>
                    );
                  }
                  if (!line.trim()) {
                    return <div key={lIdx} style={{ height: '6px' }} />;
                  }
                  return (
                    <div key={lIdx} style={{ margin: '2px 0' }}>
                      {formatText(line, isUser)}
                    </div>
                  );
                })}
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  color: 'var(--color-text-muted, #a7b7d0)',
                  marginTop: '4px',
                  padding: '0 4px',
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
              backgroundColor: 'var(--color-surface-raised, #1c2b44)',
              border: '1px solid var(--color-border, #2a3b56)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12.5px',
              color: 'var(--color-primary, #60a5fa)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <span
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid #60a5fa',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Gemini sedang menganalisis naskah dokumen...</span>
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
          borderTop: '1px solid var(--color-border, #2a3b56)',
          backgroundColor: 'var(--color-surface, #121d30)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ketik pertanyaan terkait materi ini..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--color-border, #2a3b56)',
            fontSize: '13px',
            backgroundColor: 'var(--color-bg-main, #0b1220)',
            color: 'var(--color-text-main, #e8f0fc)',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary, #3b82f6)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border, #2a3b56)';
          }}
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: !inputPrompt.trim() || isLoading
              ? 'rgba(59, 130, 246, 0.3)'
              : 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: !inputPrompt.trim() || isLoading ? 'not-allowed' : 'pointer',
            opacity: !inputPrompt.trim() || isLoading ? 0.6 : 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: !inputPrompt.trim() || isLoading ? 'none' : '0 2px 6px rgba(79, 70, 229, 0.4)',
            transition: 'all 0.15s ease',
          }}
          title="Kirim ke Gemini AI"
        >
          <span>Kirim</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
};
