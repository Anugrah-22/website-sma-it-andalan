import React from 'react';

export default function Dokumen() {
    const files = [
        { name: "Tata Tertib Siswa 2026", size: "2.4 MB", type: "PDF" },
        { name: "Formulir Izin Keluar", size: "1.1 MB", type: "PDF" },
        { name: "Kurikulum Operasional Sekolah", size: "5.6 MB", type: "PDF" },
        { name: "Panduan Seragam", size: "1.8 MB", type: "DOCX" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white p-10 rounded-3xl shadow-soft border border-gray-100">
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Pusat Download Dokumen</h1>
                    <div className="space-y-4">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                        {file.type}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-400">{file.size}</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors">
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}