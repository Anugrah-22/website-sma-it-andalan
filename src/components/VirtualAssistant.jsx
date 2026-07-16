import React, { useState, useEffect, useRef } from 'react';
import { callGemini } from '../utils/gemini';

export default function VirtualAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ 
        role: 'model', 
        text: 'Halo! Saya AndalanBot ✨, asisten virtual cerdas SMA IT Andalan International Boarding School. Ada yang bisa saya bantu tentang sekolah, fasilitas, atau pendaftaran PPDB?' 
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom() }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const newMessages = [...messages, { role: 'user', text: userText }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Persiapkan pesan untuk Gemini
            const geminiMessages = newMessages.map(m => ({ 
                role: m.role === 'model' ? 'model' : 'user', 
                parts: [{ text: m.text }] 
            }));
            
            const sysPrompt = "Anda adalah AndalanBot, asisten virtual resmi SMA IT Andalan International Boarding School. Berikan informasi yang ramah, profesional, dan informatif mengenai sekolah, pendaftaran (PPDB), fasilitas, dll. Gunakan bahasa Indonesia. Jawab secara ringkas, hangat, dan informatif maksimal 2 paragraf.";
            
            const res = await callGemini(geminiMessages, sysPrompt);
            
            if (res.candidates && res.candidates[0].content) {
                const aiResponse = res.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
            }
        } catch (err) {
            console.error("AI Error:", err);
            let errorMessage = 'Maaf, sistem saya sedang mengalami kendala. Silakan coba beberapa saat lagi ya.';
            
            if (err.message.includes('429')) {
                errorMessage = 'AndalanBot sedang istirahat sejenak karena terlalu banyak yang bertanya. Tunggu 1 menit lalu coba lagi ya! ✨';
            }
            
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div className={`bg-white w-[90vw] sm:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right mb-4 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 hidden'}`}>
                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <i className="ph-fill ph-robot text-xl"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">AndalanBot AI</h4>
                            <p className="text-[10px] text-indigo-100">Selalu Aktif (24/7)</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                        <i className="ph ph-x text-xl"></i>
                    </button>
                </div>
                
                <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                            }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Tanya AndalanBot..." 
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading} 
                        className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        <i className="ph-fill ph-paper-plane-tilt"></i>
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative">
                {!isOpen && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>}
                <i className={`ph-fill ${isOpen ? 'ph-x' : 'ph-chats-teardrop'} text-3xl`}></i>
            </button>
        </div>
    );
}