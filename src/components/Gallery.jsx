import React from 'react';

export default function Gallery({ gallery }) {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold tracking-widest text-brand-green uppercase mb-2">Galeri</h2>
                    <h3 className="text-3xl font-display font-bold text-gray-900">Aktivitas Sekolah</h3>
                </div>

                {/* Grid Responsif: 2 kolom di HP, 3 di Tablet, 4 di Desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                    
                    {gallery && gallery.length > 0 ? (
                        gallery.map((item) => (
                            <div 
                                key={item.id} 
                                // h-auto menjaga proporsi asli foto
                                // items-center (di parent) menjaga foto berbaris rata tengah secara vertikal
                                className="group relative bg-white p-2 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <img 
                                    src={item.imageUrl || 'https://placehold.co/800x600?text=No+Image'} 
                                    alt={item.title || 'Foto Galeri'} 
                                    className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.02]" 
                                />
                                
                                {/* Overlay teks muncul saat di-hover */}
                                <div className="absolute inset-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg p-4">
                                    <h5 className="text-white text-sm font-medium text-center">{item.title}</h5>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                            Belum ada foto yang diunggah.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
