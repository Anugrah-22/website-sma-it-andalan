import React from 'react';

export default function PrincipalStats({ stats }) {
    // Fungsi untuk memetakan nama ikon dari AdminPanel ke class Phosphor Icon
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
                    
                    {/* Sambutan Kepala Sekolah */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-green-500/10 to-red-500/10 rounded-[2.5rem] -z-10 transform -rotate-2"></div>
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-brand-red font-bold uppercase tracking-widest text-xs mb-6">Sambutan</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80" alt="Kepala Sekolah" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-2xl text-gray-900 leading-tight">Dr. Budi Santoso, M.Pd</h3>
                                    <p className="text-brand-green font-medium text-sm">Kepala Sekolah</p>
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed italic border-l-4 border-brand-green pl-6">
                                "Selamat datang di SMA IT Andalan International Boarding School. Kami berdedikasi membangun generasi yang tidak hanya cerdas dalam teknologi dan akademik, namun juga memiliki kedalaman iman dan akhlak mulia."
                            </p>
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