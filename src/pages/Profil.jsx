import React from 'react';

export default function Profil() {
    return (
        // Gunakan bg-gray-50 agar konten putih di dalamnya terlihat menonjol
        <div className="min-h-screen py-32 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 animate-fade-in">
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
                    <h1 className="text-4xl font-bold text-brandDark mb-6">Profil SMA IT Andalan</h1>
                    
                    <div className="space-y-6 text-gray-700 leading-relaxed">
                        <p>
                            SMA IT Andalan International Boarding School adalah institusi pendidikan yang memadukan keunggulan akademik, 
                            kemajuan teknologi, dan karakter islami yang kokoh.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-brandRed mt-8">Visi</h2>
                        <p>Mewujudkan Sekolah Islam Bertaraf Internasional Guna Mencetak Pemimpin yang Andalan, Cerdas, Berkarakter dan Unggul dalam Imtaq dan Iptek.</p>
                        
                        <h2 className="text-2xl font-bold text-brandRed mt-8">Misi</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Menyelenggarakan pendidikan berkualitas dan berstandar internasional.</li>
                            <li>Menyelenggarakan sistem penjaminan mutu dan manajemen profesional.</li>
                            <li>Mengintegrasikan nilai agama, sains, dan teknologi dalam pengembangan karakter.</li>
                            <li>Menciptakan budaya belajar yang islami, kreatif, inovatif, dan berwawasan internasional.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}