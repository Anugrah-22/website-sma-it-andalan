import React from 'react';

export default function ESurat() {
    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white p-10 rounded-3xl shadow-soft border border-gray-100">
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Layanan E-Surat</h1>
                    <p className="text-gray-500 mb-8">Ajukan permohonan surat keterangan secara online.</p>
                    
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                            <input type="text" className="w-full p-4 border rounded-xl" placeholder="Masukkan nama..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Surat</label>
                            <select className="w-full p-4 border rounded-xl">
                                <option>Surat Keterangan Aktif</option>
                                <option>Surat Izin Penelitian</option>
                                <option>Surat Rekomendasi</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Keperluan</label>
                            <textarea className="w-full p-4 border rounded-xl" rows="4" placeholder="Jelaskan tujuan surat..."></textarea>
                        </div>
                        <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700">
                            Kirim Permohonan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
