import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Berita({ news }) {
    const navigate = useNavigate();

    // Debug: Cek apakah data benar-benar ada di browser console (F12)
    console.log("Data Berita:", news);

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-brandDark">Berita</h1>
            
            {news && news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((n) => (
                        <div key={n.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                            {/* Gambar di sini */}
                            <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
                                <img 
                                    src={n.imageUrl} 
                                    className="w-full h-full object-cover"
                                    alt={n.title}
                                    onLoad={() => console.log("Gambar berhasil dimuat:", n.title)}
                                    onError={(e) => {
                                        console.log("Gambar gagal dimuat:", n.imageUrl);
                                        e.target.src = 'https://placehold.co/600x400/DC2626/white?text=No+Image';
                                    }}
                                />
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2 text-brandDark">{n.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{n.excerpt}</p>
                            <button 
                                onClick={() => navigate(`/berita/${n.id}`)} 
                                className="text-brandRed font-bold text-sm underline"
                            >
                                Baca Selengkapnya
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Belum ada berita yang tersedia.</p>
            )}
        </div>
    );
}