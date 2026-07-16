import { collection, getDocs, addDoc } from 'firebase/firestore';

export const seedInitialData = async (db, appId) => {
    // Cek koleksi Statistik
    const statsPath = collection(db, 'artifacts', appId, 'public', 'data', 'stats');
    const statsSnap = await getDocs(statsPath);
    if (statsSnap.empty) {
        await addDoc(statsPath, { label: "Siswa Aktif", value: "1,240+", icon: "Users" });
        await addDoc(statsPath, { label: "Tenaga Pengajar", value: "85", icon: "ChalkboardTeacher" });
        await addDoc(statsPath, { label: "Akreditasi", value: "A (Unggul)", icon: "Medal" });
        await addDoc(statsPath, { label: "Lulusan ke PTN", value: "92%", icon: "GraduationCap" });
    }

    // Cek koleksi Berita
    const newsPath = collection(db, 'artifacts', appId, 'public', 'data', 'news');
    const newsSnap = await getDocs(newsPath);
    if (newsSnap.empty) {
        await addDoc(newsPath, { 
            title: "Tim Robotik SMA Juara 1 Nasional", 
            date: "12 Juli 2026", 
            excerpt: "Prestasi membanggakan kembali ditorehkan oleh siswa-siswi kita di kancah nasional dalam ajang Indonesia Robotic Olympiad.",
            imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Robotik+Juara+1"
        });
        await addDoc(newsPath, { 
            title: "Peluncuran E-Raport Berbasis AI", 
            date: "05 Juli 2026", 
            excerpt: "Inovasi tiada henti, sekolah resmi menggunakan sistem evaluasi cerdas untuk memantau perkembangan karakter dan akademik siswa.",
            imageUrl: "https://placehold.co/600x400/DC2626/ffffff?text=E-Raport+AI"
        });
    }

    // Cek koleksi Pengumuman
    const annPath = collection(db, 'artifacts', appId, 'public', 'data', 'announcements');
    const annSnap = await getDocs(annPath);
    if (annSnap.empty) {
        await addDoc(annPath, { title: "Pendaftaran PPDB Gelombang 2 Dibuka", date: "15-30 Agustus 2026", type: "Penting" });
        await addDoc(annPath, { title: "Rapat Koordinasi Komite Sekolah & Wali Murid", date: "20 Agustus 2026", type: "Agenda" });
        await addDoc(annPath, { title: "Simulasi Ujian Nasional Berbasis Komputer", date: "01 September 2026", type: "Akademik" });
    }
};