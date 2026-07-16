import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Hero({ db, appId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [heroImages, setHeroImages] = useState([]);

    const defaultImages = [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80"
    ];

    useEffect(() => {
        if (!db || !appId) return;
        const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'hero');
        const unsub = onSnapshot(colRef, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));
            setHeroImages(data);
        });
        return () => unsub();
    }, [db, appId]);

    const imagesToDisplay = heroImages.length > 0 ? heroImages.map(img => img.imageUrl) : defaultImages;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imagesToDisplay.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [imagesToDisplay.length]);

    return (
        // Perubahan di sini: rounded-b-[3rem] (mobile) dan [6rem] (desktop) memberikan kurva yang lebih halus & mewah
        <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 rounded-b-[3rem] md:rounded-b-[6rem]">
            <div className="absolute inset-0 z-0">
                {imagesToDisplay.map((img, index) => (
                    <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img 
                            src={img} 
                            className="w-full h-full object-cover object-center brightness-[0.3]" 
                            alt="Hero background" 
                        />
                    </div>
                ))}
            </div>

            {/* Menambahkan pb-10 pada container teks agar ada ruang napas dari kurva bawah */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center md:text-left pb-10">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
                        SMA IT ANDALAN BONE
                    </h1>
                    <p className="text-lg md:text-2xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
                        Berbasis <span className="text-brandRed">Teknologi</span> & <span className="text-brandGreen">Boarding School</span>
                    </p>
                    <button className="bg-brandRed text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-xl hover:shadow-red-900/50 animate-fade-in-up animation-delay-400">
                        Daftar PPDB Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
