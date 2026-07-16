import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Cara 1: Scroll window (untuk kebanyakan kasus)
        window.scrollTo(0, 0);
        
        // Cara 2: Scroll elemen html (untuk browser tertentu)
        document.documentElement.scrollTo(0, 0);
        
        // Cara 3: Jika halaman menggunakan container scroll terpisah
        const main = document.querySelector('main');
        if (main) main.scrollTop = 0;
        
    }, [pathname]);

    return null;
}