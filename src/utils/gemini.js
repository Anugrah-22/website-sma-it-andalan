export const callGemini = async (messages, systemInstruction, schema = null) => {
    const accessToken = import.meta.env.VITE_GEMINI_API_KEY;

    if (!accessToken) {
        throw new Error("Token tidak ditemukan di .env");
    }

    const model = "gemini-1.5-flash"; 
    // Endpoint tanpa ?key=
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const payload = {
        contents: messages,
        system_instruction: { 
            parts: [{ text: systemInstruction }] 
        },
    };

    if (schema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: schema
        };
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // Gunakan Authorization Bearer untuk Access Token (AQ...)
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error Detail:", errorData);
        throw new Error(errorData.error?.message || "Gagal menghubungi Gemini AI");
    }

    return await response.json();
};