import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(path);
    };

    return (
        <footer className="bg-slate-950 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Profil Singkat */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-2xl text-brandRed">SMA IT ANDALAN</h3>
                        <p className="text-brandGreen text-xs font-bold uppercase tracking-[0.2em]">International Boarding School</p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Menyiapkan generasi masa depan yang berakhlakul karimah, inovatif, dan unggul dalam teknologi.
                        </p>
                        
                        {/* Sosmed */}
                        <div className="pt-2">
                            <p className="text-gray-400 text-xs mb-3">Temukan Kami di:</p>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/sma_it_andalan?igsh=YTV2ZTlnN3BkbGJt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brandRed transition-all">
                                    <i className="ph-fill ph-instagram-logo"></i>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61571555561972" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                                    <i className="ph-fill ph-facebook-logo"></i>
                                </a>
                                <a href="https://www.tiktok.com/@sma_it_andalan_bone?_r=1&_t=ZS-97zWGXtx0yK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black transition-all">
                                    <i className="ph-fill ph-tiktok-logo"></i>
                                </a>
                                <a href="https://youtube.com/@smaitandalanbone?si=WCHeptZENvNVvQF9" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-all">
                                    <i className="ph-fill ph-youtube-logo"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <div>
                        <h4 className="font-bold mb-6 text-brandGreen">Menu Utama</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigate('/')}>Beranda</li>
                            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigate('/profil')}>Profil Sekolah</li>
                            
                            {/* Admin Login */}
                            <li 
                                className="cursor-pointer text-brandRed font-bold hover:text-red-400 transition-colors mt-6 flex items-center gap-2 border-t border-gray-800 pt-4" 
                                onClick={() => handleNavigate('/admin')}
                            >
                                <i className="ph-fill ph-shield-check"></i> Panel Admin
                            </li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h4 className="font-bold mb-6 text-brandGreen">Kontak</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-center gap-3"><i className="ph-fill ph-phone text-brandRed"></i> +62 215-135-8610</li>
                            <li className="flex items-center gap-3"><i className="ph-fill ph-envelope text-brandRed"></i> smaitandalan22@gmail.com</li>
                        </ul>
                    </div>

                    {/* Lokasi */}
                    <div>
                        <h4 className="font-bold mb-6 text-brandGreen">Lokasi</h4>
                        <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-800">
                            <iframe 
                                title="Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15181.66820686516!2d120.22026780238888!3d-4.6573542384184865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbde50074260837%3A0xf5b6d8bcb049197f!2sSMA%20Islam%20Terpadu%20Andalan%20Bone!5e1!3m2!1sid!2sid!4v1784096490139!5m2!1sid!2sid" 
                                className="w-full h-full grayscale hover:grayscale-0 transition-all"
                            />
                        </div>
                        <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                            Ajangpulu, Kec. Cina, Kabupaten Bone, Sulawesi Selatan
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} SMA IT Andalan International Boarding School. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}