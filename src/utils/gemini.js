const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Model bisa diganti lewat .env tanpa mengubah kode: VITE_GEMINI_MODEL=nama-model
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash';
const TIMEOUT_MS = 30000;

export const callGemini = async (messages, systemInstruction, schema = null) => {
    if (!API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY tidak ditemukan di .env (restart dev server setelah mengubah .env)');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const payload = {
        contents: messages,
        system_instruction: {
            parts: [{ text: systemInstruction }],
        },
    };

    if (schema) {
        payload.generationConfig = {
            responseMimeType: 'application/json',
            responseSchema: schema,
        };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // API key (AIza... maupun AQ....) dikirim lewat header ini, BUKAN Authorization: Bearer
                'x-goog-api-key': API_KEY,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        if (!response.ok) {
            let detail = null;
            try {
                detail = await response.json();
            } catch {
                /* body bukan JSON */
            }
            console.error('Gemini API Error Detail:', detail);

            // Sertakan kode HTTP agar bisa dikenali di komponen (mis. 429 = kuota)
            const err = new Error(`Gemini API ${response.status}: ${detail?.error?.message || response.statusText || 'Gagal menghubungi Gemini AI'}`);
            err.status = response.status;
            throw err;
        }

        return await response.json();
    } catch (e) {
        if (e.name === 'AbortError') {
            const err = new Error('Gemini API timeout');
            err.status = 408;
            throw err;
        }
        throw e;
    } finally {
        clearTimeout(timer);
    }
};
