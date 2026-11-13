import React, { useState, useEffect, useRef } from 'react';
import { callGemini } from '../utils/gemini';

const GREETING =
    'Halo! Saya AndalanBot ✨, asisten virtual cerdas SMA IT Andalan International Boarding School. Ada yang bisa saya bantu tentang sekolah, fasilitas, atau pendaftaran PPDB?';

// TODO (isi oleh pihak sekolah): data resmi agar bot tidak mengarang jawaban.
const SCHOOL_INFO = `
- Nama sekolah: SMA IT Andalan International Boarding School
- Alamat: (isi alamat)
- Jadwal & biaya PPDB: (isi jadwal dan biaya)
- Fasilitas: (isi daftar fasilitas)
- Kontak resmi: (isi nomor WhatsApp / email)
`;

const SYSTEM_PROMPT = `Anda adalah AndalanBot, asisten virtual resmi SMA IT Andalan International Boarding School.
Berikan informasi yang ramah, profesional, dan informatif mengenai sekolah, pendaftaran (PPDB), fasilitas, dan hal terkait.
Gunakan bahasa Indonesia. Jawab ringkas dan hangat, maksimal 2 paragraf.
Jawab HANYA berdasarkan data sekolah di bawah ini. Jika informasi tidak tersedia, jujur katakan belum tahu dan arahkan pengguna menghubungi pihak sekolah. Jangan mengarang biaya, tanggal, atau data lain.

DATA SEKOLAH:
${SCHOOL_INFO}`;

const MAX_HISTORY = 12; // batasi riwayat yang dikirim agar hemat token & tidak melebihi limit

const FALLBACK_ERROR = 'Maaf, sistem saya sedang mengalami kendala. Silakan coba beberapa saat lagi ya.';

function getErrorMessage(err) {
    const msg = String(err?.message || '');
    const status = err?.status;

    // Saat development (npm run dev), tampilkan penyebab asli error langsung di chat
    if (import.meta.env.DEV) {
        return `[DEBUG] ${msg}`;
    }

    if (status === 401 || status === 403) {
        return 'Layanan AI belum dapat diakses karena masalah konfigurasi. Silakan hubungi admin sekolah.';
    }
    if (status === 404 || status === 400) {
        return 'Layanan AI sedang dalam perbaikan. Silakan coba lagi nanti ya.';
    }
    if (status === 429) {
        return 'AndalanBot sedang istirahat sejenak karena terlalu banyak yang bertanya. Tunggu 1 menit lalu coba lagi ya! ✨';
    }
    if (status === 408) {
        return 'Respons terlalu lama. Silakan coba kirim ulang pertanyaan Anda ya.';
    }
    if (status >= 500) {
        return 'Server AI sedang sibuk. Silakan coba lagi dalam beberapa saat ya.';
    }
    if (!navigator.onLine || msg.toLowerCase().includes('failed to fetch')) {
        return 'Koneksi internet Anda sepertinya terputus. Periksa koneksi lalu coba lagi ya.';
    }
    return FALLBACK_ERROR;
}

// Gemini mewajibkan riwayat dimulai dari role "user", dan pesan error tidak boleh ikut dikirim.
function buildGeminiHistory(messages) {
    const clean = messages.filter((m) => !m.isError);
    const firstUser = clean.findIndex((m) => m.role === 'user');
    if (firstUser === -1) return [];

    return clean
        .slice(firstUser)
        .slice(-MAX_HISTORY)
        .reduce((acc, m) => {
            const role = m.role === 'model' ? 'model' : 'user';
            const last = acc[acc.length - 1];
            if (last && last.role === role) {
                // gabungkan pesan berturut-turut dengan role sama agar urutan tetap bergantian
                last.parts[0].text += '\n' + m.text;
            } else {
                acc.push({ role, parts: [{ text: m.text }] });
            }
            return acc;
        }, [])
        // pastikan potongan riwayat tetap diawali "user"
        .filter((_, i, arr) => !(i === 0 && arr[0].role !== 'user'));
}

export default function VirtualAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'model', text: GREETING }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [messages, isOpen, isLoading]);

    const addMessage = (msg) => {
        if (isMounted.current) setMessages((prev) => [...prev, msg]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText || isLoading) return;

        const newMessages = [...messages, { role: 'user', text: userText }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const geminiMessages = buildGeminiHistory(newMessages);
            const res = await callGemini(geminiMessages, SYSTEM_PROMPT);

            const candidate = res?.candidates?.[0];
            const aiResponse = candidate?.content?.parts
                ?.filter((p) => !p.thought)
                .map((p) => p.text || '')
                .join('')
                .trim();

            if (aiResponse) {
                addMessage({ role: 'model', text: aiResponse });
            } else {
                console.error('Respons Gemini kosong:', res);
                // jawaban kosong / diblokir filter keamanan
                const blocked = candidate?.finishReason === 'SAFETY' || res?.promptFeedback?.blockReason;
                addMessage({
                    role: 'model',
                    isError: true,
                    text: blocked
                        ? 'Maaf, saya tidak dapat menjawab pertanyaan tersebut. Coba ajukan pertanyaan lain seputar sekolah ya.'
                        : FALLBACK_ERROR,
                });
            }
        } catch (err) {
            console.error('AI Error:', err);
            addMessage({ role: 'model', isError: true, text: getErrorMessage(err) });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div
                role="dialog"
                aria-label="Chat AndalanBot"
                aria-hidden={!isOpen}
                className={`bg-white w-[90vw] sm:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right mb-4 ${
                    isOpen ? 'scale-100 opacity-100 visible' : 'scale-0 opacity-0 invisible pointer-events-none h-0 mb-0'
                }`}
            >
                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-robot text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">AndalanBot AI</h4>
                            <p className="text-[10px] text-indigo-100">Selalu Aktif (24/7)</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Tutup chat"
                        className="text-white/70 hover:text-white"
                    >
                        <i className="ph ph-x text-xl"></i>
                    </button>
                </div>

                <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4" aria-live="polite">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : msg.isError
                                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}
                            >
                                <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start" aria-label="AndalanBot sedang mengetik">
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tanya AndalanBot..."
                        maxLength={500}
                        autoComplete="off"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                    <button
                        type="submit"
                        aria-label="Kirim pesan"
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        <i className="ph-fill ph-paper-plane-tilt"></i>
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Tutup chat' : 'Buka chat'}
                aria-expanded={isOpen}
                className="bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
            >
                {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>}
                <i className={`ph-fill ${isOpen ? 'ph-x' : 'ph-chats-teardrop'} text-3xl`}></i>
            </button>
        </div>
    );
}
