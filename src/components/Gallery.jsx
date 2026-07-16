import React, { useRef, useEffect } from 'react';

export default function Gallery({ gallery }) {
    const scrollRef = useRef(null);

    // Fungsi Scroll Manual
    const scrollManual = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400; // Menggeser sebesar 400px
            scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
        }
    };

    // Fungsi Auto-Scroll
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 10) {
                    scrollRef.current.scrollLeft = 0; // Kembali ke awal jika sudah di ujung
                } else {
                    scrollRef.current.scrollLeft += 400;
                }
            }
        }, 4000); // Geser otomatis setiap 4 detik
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold tracking-widest text-brand-green uppercase mb-2">Galeri</h2>
                    <h3 className="text-4xl font-display font-bold text-gray-900">Aktivitas Sekolah</h3>
                </div>

                <div className="relative group">
                    {/* Tombol Navigasi Manual */}
                    <button 
                        onClick={() => scrollManual('left')} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-4 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100 hidden md:flex"
                    >
                        <i className="ph ph-arrow-left text-xl"></i>
                    </button>
                    
                    <button 
                        onClick={() => scrollManual('right')} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-4 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100 hidden md:flex"
                    >
                        <i className="ph ph-arrow-right text-xl"></i>
                    </button>

                    {/* Container Slider */}
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-8 scroll-smooth scrollbar-hide snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {gallery && gallery.length > 0 ? (
                            gallery.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="min-w-[320px] md:min-w-[400px] aspect-video relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 hover:-translate-y-2 snap-center"
                                >
                                    <img 
                                        src={item.imageUrl || 'https://placehold.co/800x450?text=No+Image'} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                    />
                                    
                                    {/* Efek Timbul saat di-hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                        <h5 className="text-white font-display font-bold text-xl">{item.title}</h5>
                                        <p className="text-gray-200 text-sm mt-2">{item.excerpt}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                                Belum ada foto di galeri.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}