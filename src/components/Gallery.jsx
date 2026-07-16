import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { callGemini } from '../utils/gemini';

export default function AdminPanel({ db, appId, authUser }) {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [originalData, setOriginalData] = useState(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('lastAdminActivity');
            navigate('/', { replace: true });
        } catch (e) { console.error("Logout error", e); }
    };

    useEffect(() => {
        const TIMEOUT_DURATION = 10 * 60 * 1000;
        const logoutUser = async () => {
            try {
                await signOut(auth);
                localStorage.removeItem('lastAdminActivity');
                navigate('/', { replace: true });
            } catch (e) { console.error("Logout error", e); }
        };

        const checkSession = () => {
            const lastActive = localStorage.getItem('lastAdminActivity');
            if (lastActive && (Date.now() - parseInt(lastActive) > TIMEOUT_DURATION)) {
                logoutUser();
            }
        };

        const updateActivity = () => localStorage.setItem('lastAdminActivity', Date.now().toString());

        window.addEventListener('mousedown', updateActivity);
        window.addEventListener('keydown', updateActivity);
        const interval = setInterval(checkSession, 10000);

        return () => {
            window.removeEventListener('mousedown', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            clearInterval(interval);
        };
    }, [navigate]);

    useEffect(() => {
        if (authUser === undefined) return; 
        if (authUser === null) {
            navigate('/', { replace: true });
        } else {
            setIsChecking(false);
            if (!localStorage.getItem('lastAdminActivity')) {
                localStorage.setItem('lastAdminActivity', Date.now().toString());
            }
        }
    }, [authUser, navigate]);

    const [activeTab, setActiveTab] = useState('news');
    const [dataList, setDataList] = useState([]);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState('');
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const getColRef = (type) => collection(db, 'artifacts', appId, 'public', 'data', type);

    useEffect(() => {
        if (!db || isChecking) return;
        const unsub = onSnapshot(getColRef(activeTab), (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));
            setDataList(items);
        });
        return () => unsub();
    }, [activeTab, db, appId, isChecking]);

    const showNotif = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 3000); };

    const sanitizeData = (data) => {
        const clean = {};
        for (let key in data) {
            if (typeof data[key] === 'string') {
                clean[key] = data[key].trim().replace(/<[^>]*>?/gm, '');
            } else {
                clean[key] = data[key];
            }
        }
        return clean;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showNotif('❌ File terlalu besar!'); return; }

        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset");
        
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
            const fileData = await res.json();
            setFormData(prev => ({ ...prev, imageUrl: fileData.secure_url }));
            showNotif('✅ Gambar berhasil diunggah!');
        } catch (e) { showNotif('❌ Gagal upload gambar'); }
        setIsUploading(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', activeTab, id));
            showNotif('✅ Data berhasil dihapus');
        } catch (e) { showNotif('❌ Gagal menghapus'); }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData(item);
        setOriginalData(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sanitizedData = sanitizeData(formData);

        if (editingId && originalData) {
            const hasChanged = JSON.stringify(sanitizedData) !== JSON.stringify(sanitizeData(originalData));
            if (!hasChanged) {
                showNotif('⚠️ Tidak ada data yang berubah');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            const finalData = { ...sanitizedData, priority: Number(formData.priority) || 99 };
            if (editingId) {
                await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', activeTab, editingId), finalData);
                showNotif('✅ Data berhasil diupdate');
                setEditingId(null);
                setOriginalData(null);
            } else {
                await addDoc(getColRef(activeTab), finalData);
                showNotif('✅ Data berhasil disimpan');
            }
            setFormData({});
            e.target.reset();
        } catch (e) { showNotif('❌ Gagal menyimpan'); }
        setIsSubmitting(false);
    };

    const handleGenerateDraftAI = async () => {
        if (!aiTopic.trim()) return;
        setIsGeneratingAI(true);
        try {
            const schema = { type: "OBJECT", properties: { title: { type: "STRING" }, excerpt: { type: "STRING" } }, required: ["title", "excerpt"] };
            const res = await callGemini([{ role: "user", parts: [{ text: `Buatkan berita SMA tentang: ${aiTopic}. Judul max 8 kata.` }] }], "Anda penulis humas profesional.", schema);
            if (res.candidates && res.candidates[0].content) {
                const data = JSON.parse(res.candidates[0].content.parts[0].text);
                setFormData({ ...formData, ...data, date: new Date().toLocaleDateString('id-ID'), imageUrl: 'https://placehold.co/600x400/059669/white?text=Berita' });
                setShowAIPrompt(false);
                showNotif('✨ Draft berita dibuat dengan AI!');
            }
        } catch (e) { showNotif('❌ Gagal generate AI'); }
        setIsGeneratingAI(false);
    };

    if (isChecking) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-xl animate-pulse">Memverifikasi Sesi...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 px-4 sm:px-8 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg"><i className="ph-fill ph-shield-check text-sm"></i></div>
                    <span className="font-bold text-lg hidden sm:block">Admin Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[9px] uppercase text-slate-400 font-bold">User</p>
                        <p className="text-xs font-medium truncate max-w-[100px]">{authUser?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-white/5 hover:bg-red-600/20 border border-white/10 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all">Logout</button>
                </div>
            </header>

            <div className="flex p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full flex-col md:flex-row">
                <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {['news', 'announcements', 'stats', 'gallery', 'hero'].map(tab => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setEditingId(null); setFormData({}); setOriginalData(null); }} 
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold capitalize transition-all duration-300 ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}>
                            {tab}
                        </button>
                    ))}
                </aside>

                <main className="flex-1 space-y-6">
                    {notification && <div className="bg-green-600 text-white p-4 rounded-2xl font-bold animate-pulse shadow-lg">{notification}</div>}

                    <div className="bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl">{editingId ? 'Edit' : 'Tambah'}</h3>
                            {activeTab === 'news' && (
                                <button type="button" onClick={() => setShowAIPrompt(!showAIPrompt)} className="text-xs sm:text-sm bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl font-medium hover:bg-indigo-500/30 flex items-center gap-2">
                                    <i className="ph-fill ph-magic-wand"></i> AI
                                </button>
                            )}
                        </div>

                        {showAIPrompt && activeTab === 'news' && (
                            <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 mb-6 flex gap-2">
                                <input type="text" placeholder="Topik berita..." className="flex-1 p-3 bg-transparent border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={aiTopic} onChange={e => setAiTopic(e.target.value)} disabled={isGeneratingAI} />
                                <button type="button" onClick={handleGenerateDraftAI} disabled={isGeneratingAI} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                                    {isGeneratingAI ? <i className="ph ph-spinner animate-spin"></i> : 'Generate'}
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder={activeTab === 'stats' ? "Label (cth: Siswa)" : "Judul (Penanda Admin)"} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" value={formData.title || formData.label || ''} onChange={e => setFormData({...formData, title: e.target.value, label: e.target.value})} />
                            <input type="number" placeholder="Prioritas (1 = Teratas)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" value={formData.priority || ''} onChange={e => setFormData({...formData, priority: e.target.value})} />
                            {(activeTab === 'news' || activeTab === 'announcements') && <input required placeholder="Tanggal (DD/MM/YYYY)" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />}
                            {(activeTab === 'news' || activeTab === 'gallery' || activeTab === 'announcements' || activeTab === 'hero') && (
                                <div className="space-y-3">
                                    <label className={`block cursor-pointer w-full p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl text-center text-sm transition-all hover:border-red-500 ${isUploading ? 'animate-pulse opacity-50' : ''}`}>
                                        <i className={`ph ${isUploading ? 'ph-spinner animate-spin' : 'ph-upload-simple'} text-3xl mb-2`}></i>
                                        <p>{isUploading ? 'Uploading...' : 'Pilih foto (Max 5MB)'}</p>
                                        <input type="file" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    {formData.imageUrl && <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-lg"><img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" /></div>}
                                </div>
                            )}
                            {activeTab === 'stats' && (
                                <select required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 outline-none" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})}>
                                    <option value="" className="bg-slate-900">Pilih Kategori Statistik</option>
                                    <option value="Users" className="bg-slate-900">Siswa (Users)</option>
                                    <option value="ChalkboardTeacher" className="bg-slate-900">Guru (Teacher)</option>
                                    <option value="UserGear" className="bg-slate-900">Tenaga Kependidikan</option>
                                    <option value="Medal" className="bg-slate-900">Akreditasi (Medal)</option>
                                    <option value="GraduationCap" className="bg-slate-900">Lulusan (Graduation)</option>
                                    <option value="Trophy" className="bg-slate-900">Prestasi (Trophy)</option>
                                </select>
                            )}
                            {activeTab !== 'hero' && (
                                <textarea placeholder="Deskripsi/Detail" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl h-32 text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 outline-none" value={formData.excerpt || formData.value || formData.label_desc || ''} onChange={e => setFormData({...formData, excerpt: e.target.value, value: e.target.value, label_desc: e.target.value})}></textarea>
                            )}
                            <div className="flex gap-2">
                                <button type="submit" disabled={isSubmitting} className={`flex-1 py-4 rounded-2xl font-bold transition-all ${editingId ? 'bg-blue-600' : 'bg-red-600'}`}>
                                    {isSubmitting ? 'Memproses...' : (editingId ? 'Update' : 'Simpan')}
                                </button>
                                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({}); setOriginalData(null); }} className="px-6 py-4 rounded-2xl font-bold bg-white/5">Batal</button>}
                            </div>
                        </form>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-white/5 uppercase text-xs text-slate-400"><tr><th className="p-4">Judul/Label</th><th className="p-4">Detail</th><th className="p-4 text-right">Aksi</th></tr></thead>
                                <tbody className="divide-y divide-white/10">
                                    {dataList.map(item => (
                                        <tr key={item.id} className="hover:bg-white/5">
                                            <td className="p-4 font-medium text-white max-w-[150px] truncate">{item.title || item.label || 'Foto Slider'}</td>
                                            <td className="p-4">{item.date || item.value || '-'}</td>
                                            <td className="p-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(item)} className="text-blue-400 font-bold">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-400 font-bold">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
