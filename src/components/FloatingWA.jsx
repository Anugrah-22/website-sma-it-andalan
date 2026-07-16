import React from 'react';

export default function FloatingWA() {
    // Nomor sudah diperbarui ke format seluler yang benar
    const phoneNumber = "6282151358610"; 
    const message = "Halo admin, saya ingin bertanya tentang PPDB SMA IT Andalan.";

    return (
        <a 
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75"></div>
            <i className="ph-fill ph-whatsapp-logo text-3xl relative z-10"></i>
        </a>
    );
}