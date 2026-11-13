const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Model utama & cadangan bisa diganti lewat .env tanpa mengubah kode
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash';
const FALLBACK_MODEL = import.meta.env.VITE_GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';
const TIMEOUT_MS = 30000;
const RETRY_DELAYS = [1500, 3000]; // jeda antar percobaan ulang pada model utama (ms)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isRetryable = (status) => status === 503 || status === 500 || status === 408;

async function requestOnce(model, payload) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
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
            try { detail = await response.json(); } catch { /* body bukan JSON */ }
            console.error(`Gemini API Error (${model}):`, detail);
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
}

export const callGemini = async (messages, systemInstruction, schema = null) => {
    if (!API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY tidak ditemukan di .env (restart dev server setelah mengubah .env)');
    }

    const payload = {
        contents: messages,
        system_instruction: { parts: [{ text: systemInstruction }] },
    };
    if (schema) {
        payload.generationConfig = { responseMimeType: 'application/json', responseSchema: schema };
    }

    // 1) Model utama, dengan percobaan ulang jika server sibuk
    let firstError;
    for (let i = 0; i <= RETRY_DELAYS.length; i++) {
        try {
            return await requestOnce(MODEL, payload);
        } catch (e) {
            firstError = firstError || e;
            if (!isRetryable(e.status) || i === RETRY_DELAYS.length) break;
            await sleep(RETRY_DELAYS[i]);
        }
    }

    // 2) Model cadangan (hanya jika error berasal dari server sibuk)
    if (FALLBACK_MODEL && FALLBACK_MODEL !== MODEL && isRetryable(firstError?.status)) {
        try {
            return await requestOnce(FALLBACK_MODEL, payload);
        } catch {
            /* abaikan, lempar error model utama */
        }
    }

    throw firstError;
};
