import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false); // State untuk mendeteksi kegagalan load logo

    // Deteksi apakah sedang di halaman utama
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fungsi navigasi terpadu
    const navigateTo = (path) => {
        setIsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(path);
    };

    // Styling dinamis
    const navBg = isHome 
        ? (scrolled ? 'bg-white shadow-md border-b border-gray-100 py-3' : 'bg-transparent py-5')
        : 'bg-white shadow-md border-b border-gray-100 py-3';

    const textColor = (isHome && !scrolled) ? 'text-white' : 'text-gray-900';
    const subTextColor = (isHome && !scrolled) ? 'text-green-200' : 'text-green-600';

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                
                {/* Logo Section */}
                <button onClick={() => navigateTo('/')} className="flex items-center gap-3 group">
                    {/* Logika Fallback Logo */}
                    {logoError ? (
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-red-600 shadow-sm group-hover:scale-105 transition-transform">
                            <i className="ph-fill ph-student text-2xl text-red-600"></i>
                        </div>
                    ) : (
                        <img 
                            src="/logo.jpeg" 
                            alt="logo" 
                            onError={() => setLogoError(true)}
                            className="w-20 h-15 object-contain bg-white rounded-full border-2 border-red-600 shadow-sm group-hover:scale-105 transition-transform"
                        />
                    )}

                    <div className="flex flex-col text-left">
                        <span className={`font-bold text-lg leading-none ${textColor}`}>SMA IT ANDALAN BONE</span>
                        <span className={`text-[10px] uppercase tracking-widest ${subTextColor}`}>International Boarding School</span>
                    </div>
                </button>

                {/* Menu Desktop */}
                <div className={`hidden lg:flex items-center space-x-8 font-medium ${textColor}`}>
                    <button onClick={() => navigateTo('/')} className="hover:text-red-600 transition-colors">Beranda</button>
                    <button onClick={() => navigateTo('/profil')} className="hover:text-red-600 transition-colors">Profil</button>
                    <button onClick={() => navigateTo('/berita')} className="hover:text-red-600 transition-colors">Berita</button>
                </div>

                {/* Menu Mobile Button */}
                <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden text-3xl ${textColor}`}>
                    <i className={`ph ${isOpen ? 'ph-x' : 'ph-list'}`}></i>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 px-4 border-t text-gray-900">
                    <div className="flex flex-col gap-6 font-bold text-lg">
                        <button onClick={() => navigateTo('/')} className="text-left">Beranda</button>
                        <button onClick={() => navigateTo('/profil')} className="text-left">Profil</button>
                        <button onClick={() => navigateTo('/berita')} className="text-left">Berita</button>
                    </div>
                </div>
            )}
        </nav>
    );
}