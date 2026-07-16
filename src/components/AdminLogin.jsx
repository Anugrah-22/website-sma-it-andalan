import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function AdminLogin({ auth }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const AUTHORIZED = ["admin@sekolah.sch.id", "smaitandalan20@gmail.com", "anugrahdwidamawan@gmail.com"];

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (AUTHORIZED.includes(user.user.email)) {
                navigate('/admin-panel'); 
            } else {
                await signOut(auth);
                alert("Email tidak memiliki akses admin.");
            }
        } catch (e) { alert("Login Gagal, cek kembali email/password anda."); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animasi CSS Dasar */}
            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up { animation: slideUp 0.6s ease-out; }
            `}</style>

            {/* Elemen Latar Belakang Dekoratif */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600 rounded-full blur-[128px] opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-[128px] opacity-20"></div>
            </div>

            {/* Card Login */}
            <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-sm space-y-6 animate-slide-up relative z-10">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-3xl">
                        <i className="ph-fill ph-shield-check"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Admin Access</h2>
                    <p className="text-slate-400 text-sm">Masuk untuk mengelola konten sekolah</p>
                </div>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Admin" 
                        className="w-full p-4 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-4 border border-white/10 rounded-xl bg-white/5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-600/30"
                >
                    {loading ? 'Memproses...' : 'Masuk ke Panel'}
                </button>

                <button 
                    type="button" 
                    onClick={() => navigate('/')} 
                    className="w-full text-slate-400 hover:text-white text-sm transition-colors"
                >
                    Kembali ke Halaman Utama
                </button>
            </form>
        </div>
    );
}