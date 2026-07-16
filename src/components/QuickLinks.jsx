import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickLinks() {
    const navigate = useNavigate();

    const links = [
        { title: "Download Dokumen", desc: "Modul & Tata Tertib", icon: "ph-download-simple", color: "text-blue-600", path: "/dokumen" },
        { title: "Layanan E-Surat", desc: "Pengajuan Surat", icon: "ph-envelope-simple", color: "text-purple-600", path: "/e-surat" },
        { title: "Portal PPDB", desc: "Pendaftaran Siswa", icon: "ph-identification-card", color: "text-red-600", path: "https://ppdb.andal-an.sch.id", isExternal: true },
        { title: "Kalender Akademik", desc: "Jadwal Sekolah", icon: "ph-calendar-blank", color: "text-green-600", path: "/kalender" },
    ];

    const handleClick = (link) => {
        if (link.isExternal) {
            window.open(link.path, "_blank");
        } else {
            navigate(link.path);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {links.map((link, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleClick(link)}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-3 cursor-pointer"
                >
                    <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-6 ${link.color}`}>
                        <i className={`ph-fill ${link.icon}`}></i>
                    </div>
                    
                    <div>
                        <h5 className="font-bold text-gray-900 text-lg mb-1">{link.title}</h5>
                        <p className="text-sm text-gray-500 leading-relaxed">{link.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}