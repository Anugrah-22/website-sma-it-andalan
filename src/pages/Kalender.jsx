
import React from 'react';

export default function Kalender() {
    const events = [
        { date: "01 Agu 2026", title: "Awal Semester Ganjil" },
        { date: "17 Agu 2026", title: "Upacara HUT RI" },
        { date: "05 Sep 2026", title: "Ujian Tengah Semester" },
        { date: "12 Okt 2026", title: "Libur Maulid Nabi" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white p-10 rounded-3xl shadow-soft border border-gray-100">
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Kalender Akademik</h1>
                    <div className="space-y-4">
                        {events.map((evt, idx) => (
                            <div key={idx} className="flex gap-6 p-6 bg-gray-50 rounded-2xl">
                                <div className="text-center bg-brandGreen text-white p-3 rounded-xl min-w-[80px]">
                                    <span className="block font-bold text-lg">{evt.date.split(" ")[0]}</span>
                                    <span className="block text-xs uppercase">{evt.date.split(" ")[1]}</span>
                                </div>
                                <div className="flex items-center">
                                    <h4 className="font-bold text-gray-800 text-lg">{evt.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}