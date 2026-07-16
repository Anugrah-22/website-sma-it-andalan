import React from 'react';

export default function Gallery({ gallery }) {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-sm font-bold tracking-widest text-brand-green uppercase mb-2">Galeri</h2>
                    <h3 className="text-3xl font-display font-bold text-gray-900">Aktivitas Sekolah</h3>
                </div>

                {/* 
                   Mobile: auto-cols-[45%] (Menampilkan 2 foto, ukuran lebih kecil)
                   Desktop: grid-cols-5 (Menampilkan 5 foto, ukuran thumbnail yang sangat rapi)
                */}
                <div className="grid grid-flow-col auto-cols-[45%] md:grid-flow-row md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide snap-x">
                    
                    {gallery && gallery.length > 0 ? (
                        gallery.map((item) => (
                            <div 
                                key={item.id} 
                                // aspect-square memaksa bingkai menjadi kotak sempurna (TIDAK ADA yang kecil sebelah)
                                className="aspect-square relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group bg-gray-200 snap-center"
                            >
                                <img 
                                    src={item.imageUrl || 'https://placehold.co/800x800?text=No+Image'} 
                                    alt={item.title} 
                                    // object-cover + object-center = Fokus ke tengah, tidak ada ruang kosong
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                                />
                                
                                {/* Overlay minimalis */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                                    <h5 className="text-white text-xs font-medium text-center truncate">{item.title}</h5>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                            Belum ada foto.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}