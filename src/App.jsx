import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './config/firebase';
import { seedInitialData } from './utils/seedData';

// Komponen
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import VirtualAssistant from './components/VirtualAssistant';
import FloatingWA from './components/FloatingWA';
import ScrollToTop from './components/ScrollToTop'; // Pastikan file ini ada di folder components

// Halaman
import Home from './pages/Home';
import Profil from './pages/Profil';
import Berita from './pages/Berita';
import DetailBerita from './pages/DetailBerita';
import Dokumen from './pages/Dokumen';
import ESurat from './pages/ESurat';
import Kalender from './pages/Kalender';

// Layout wrapper
function AppLayout({ children }) {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin' || location.pathname === '/admin-panel';
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {!isAdmin && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!isAdmin && <Footer />}
            {!isAdmin && <VirtualAssistant />}
            {!isAdmin && <FloatingWA />}
        </div>
    );
}

export default function App() {
    const [news, setNews] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [stats, setStats] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const appId = "sma-demo-id";

    useEffect(() => {
        if (!auth || !db) return;
        
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                signInAnonymously(auth).catch(err => console.error("Auth Error:", err));
            }
            setAuthLoading(false);
        });

        seedInitialData(db, appId);

        const sortData = (items) => items.sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));

        const collections = [
            { name: 'news', setter: setNews },
            { name: 'announcements', setter: setAnnouncements },
            { name: 'stats', setter: setStats },
            { name: 'gallery', setter: setGallery }
        ];

        const unsubscribes = collections.map(col => 
            onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', col.name), snap => {
                col.setter(sortData(snap.docs.map(d => ({id: d.id, ...d.data()}))));
            })
        );

        return () => {
            unsubscribeAuth();
            unsubscribes.forEach(unsub => unsub());
        };
    }, []);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center font-bold">Memuat Sistem...</div>;

    return (
        <Router>
            {/* ScrollToTop ditempatkan di dalam Router agar bisa membaca perubahan URL */}
            <ScrollToTop />
            
            <AppLayout>
                <Routes>
                    <Route path="/" element={
                        <Home 
                            news={news} 
                            announcements={announcements} 
                            stats={stats} 
                            gallery={gallery} 
                            db={db} 
                            appId={appId} 
                        />
                    } />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/berita" element={<Berita news={news} />} />
                    <Route path="/berita/:id" element={<DetailBerita />} />
                    <Route path="/dokumen" element={<Dokumen />} />
                    <Route path="/e-surat" element={<ESurat db={db} appId={appId} />} />
                    <Route path="/kalender" element={<Kalender />} />
                    <Route path="/admin" element={<AdminLogin auth={auth} />} />
                    <Route path="/admin-panel" element={<AdminPanel db={db} appId={appId} authUser={currentUser} />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}