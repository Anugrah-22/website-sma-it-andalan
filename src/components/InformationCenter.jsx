import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InformationCenter({ news }) {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const handleNavigate = (id) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(`/berita/${id}`);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
                    scrollRef.current.scrollLeft = 0;
                } else {
                    scrollRef.current.scrollLeft += 300;
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const scrollManual = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += direction === 'left' ? -300 : 300;
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="text-center mb-16 px-4">
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Berita</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Informasi terkini mengenai kegiatan, prestasi, dan pengumuman penting sekolah.</p>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">
                {/* Navigasi Manual */}
                <button onClick={() => scrollManual('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 hidden md:block">
                    <i className="ph ph-arrow-left text-xl"></i>
                </button>
                <button onClick={() => scrollManual('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 hidden md:block">
                    <i className="ph ph-arrow-right text-xl"></i>
                </button>

                <div ref={scrollRef} className="flex overflow-x-auto gap-8 px-4 pb-8 scrollbar-hide scroll-smooth">
                    {news && news.length > 0 ? (
                        news.map((item) => (
                            <div key={item.id} onClick={() => handleNavigate(item.id)} className="min-w-[320px] bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                                <img src={item.imageUrl || 'https://placehold.co/600x400'} className="h-48 w-full object-cover rounded-t-3xl" alt={item.title} />
                                <div className="p-6">
                                    <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">{item.title}</h4>
                                    <p className="text-sm text-gray-400">{item.date}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="w-full text-center py-20 text-gray-400">Belum ada berita.</p>
                    )}
                </div>
            </div>
        </section>
    );
}