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
        // h-[60vh] mobile, h-[80vh] desktop agar proporsional
        // rounded-b-[2.5rem] mobile, rounded-b-[4rem] desktop untuk lengkungan halus
        <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 rounded-b-[2.5rem] md:rounded-b-[4rem]">
            <div className="absolute inset-0 z-0">
                {imagesToDisplay.map((img, index) => (
                    <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img 
                            src={img} 
                            // object-bottom: Fokus utama di bagian bawah (bangunan)
                            // object-cover: Tetap menutupi layar
                            className="w-full h-full object-cover object-bottom brightness-[0.3]" 
                            alt="Hero background" 
                        />
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center md:text-left pb-6 md:pb-0">
                <div className="max-w-3xl">
                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 animate-fade-in-up">
                        SMA IT ANDALAN BONE
                    </h1>
                    <p className="text-base md:text-2xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
                        Berbasis <span className="text-brandRed">Teknologi</span> & <span className="text-brandGreen">Boarding School</span>
                    </p>
                    <button className="bg-brandRed text-white px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-xl hover:shadow-red-900/50 animate-fade-in-up animation-delay-400">
                        Daftar PPDB Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}
