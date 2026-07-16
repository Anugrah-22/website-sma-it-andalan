import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Pastikan path benar

export default function DetailBerita() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Mengambil data spesifik dari Firestore berdasarkan ID
                const docRef = doc(db, 'artifacts', 'sma-demo-id', 'public', 'data', 'news', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setNews({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Gagal mengambil berita:", error);
            } finally {
                setLoading(false);
            }
        window.scrollTo(0, 0);
            
        };

        fetchNews();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat berita...</div>;
    if (!news) return <div className="min-h-screen flex items-center justify-center">Berita tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                {/* Tombol Kembali */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 flex items-center gap-2 text-brandDark hover:text-brandRed transition-colors font-medium"
                >
                    <i className="ph-bold ph-arrow-left"></i> Kembali ke dashboard Berita
                </button>

                {/* Kontainer Berita */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                    
                    {/* Judul & Tanggal */}
                    <h1 className="text-3xl md:text-5xl font-bold text-brandDark mb-4 leading-tight">{news.title}</h1>
                    <p className="text-gray-500 mb-8 flex items-center gap-2">
                        <i className="ph ph-calendar"></i> {news.date}
                    </p>

                    {/* GAMBAR BERITA (Inilah yang Anda minta) */}
                    <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-md">
                        <img 
                            src={news.imageUrl} 
                            alt={news.title} 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Isi Berita */}
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        <p>{news.excerpt}</p>
                        {/* Jika nanti Anda menambahkan field 'content' di Firebase, Anda bisa menampilkannya di sini */}
                    </div>
                </div>
            </div>
        </div>
    );
}