import React from 'react';

export default function PrincipalStats({ stats }) {
    const getIcon = (name) => {
        const icons = { 
            'Users': 'ph-users', 
            'ChalkboardTeacher': 'ph-chalkboard-teacher', 
            'Medal': 'ph-medal', 
            'GraduationCap': 'ph-graduation-cap',
            'Trophy': 'ph-trophy'
        };
        return icons[name] || 'ph-info';
    };

    return (
        <div className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Bagian Kepala Sekolah */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-green-500/10 to-red-500/10 rounded-[2.5rem] -z-10 transform -rotate-2"></div>
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-8">Sambutan</h2>
                            
                            {/* Layout Flexbox */}
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                
                                {/* Foto (Container diperlebar menjadi 45% agar terlihat besar) */}
                                <div className="relative shrink-0 w-full md:w-[45%] flex justify-center">
                                    {/* Lingkaran lembut (blob) diperbesar menyesuaikan foto */}
                                    <div className="absolute w-48 h-48 md:w-56 md:h-56 bg-green-100 rounded-full blur-3xl opacity-70"></div>
                                    
                                    <img 
                                        src="/kepsek.png" 
                                        alt="Alif Salama Samsul" 
                                        // Dihapus max-w-240px agar foto mengisi ruang container
                                        className="relative z-10 w-full h-auto object-contain drop-shadow-xl" 
                                    />
                                </div>

                                {/* Teks Sambutan */}
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-2xl text-gray-900 leading-tight mb-2">Alif Salama Samsul, S.Pd., M.Pd.</h3>
                                    <p className="text-brand-green font-medium text-sm mb-6">Kepala Sekolah SMA IT Andalan</p>
                                    
                                    <div className="text-gray-600 leading-relaxed italic border-l-4 border-brand-green pl-6">
                                        "Selamat datang di SMA IT Andalan International Boarding School. Kami berdedikasi membangun generasi yang tidak hanya cerdas dalam teknologi dan akademik, namun juga memiliki kedalaman iman dan akhlak mulia."
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Statistik */}
                    <div>
                        <div className="mb-10">
                            <h2 className="text-sm font-bold tracking-wider text-brand-red uppercase mb-2">Statistik Sekolah</h2>
                            <h3 className="font-display text-3xl font-bold text-gray-900">Pusat Keunggulan Edukasi</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {stats && stats.length > 0 ? (
                                stats.map((stat, idx) => (
                                    <div key={stat.id || idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 group">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-green text-3xl mb-6 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                                            <i className={`ph-fill ${getIcon(stat.icon)}`}></i>
                                        </div>
                                        <h4 className="font-display text-3xl font-bold text-gray-900 mb-1">
                                            {stat.value || stat.excerpt || '0'}
                                        </h4>
                                        <p className="text-gray-500 font-medium text-sm">
                                            {stat.label || stat.title}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-10 text-gray-400">Data statistik belum tersedia.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}