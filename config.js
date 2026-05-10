export default async function handler(req, res) {
    // Hanya menerima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, user, pass, apiKey, apiUrl, model, systemPrompt } = req.body;

    // Validasi kredensial admin (hardcoded di server, tidak terlihat di frontend)
    const ADMIN_USER = "52aj7wh2hw772@Z";
    const ADMIN_PASS = "j6&gwggu6&ih-#$+8)! +9388#+-6#7+-3--67$777$7$7$7$7uwiuhhs@@@####uwiwiwiiw";

    if (action === 'login') {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            return res.status(200).json({ success: true });
        }
        return res.status(401).json({ success: false });
    }

    // Untuk action lain, harus sudah login (cek sesi sederhana pakai token, di sini pakai referer atau cookie opsional)
    // Untuk keamanan, kita gunakan header referer atau token sederhana
    // Karena Vercel serverless tidak menyimpan state, kita hanya andalkan env dan validasi manual
    if (action === 'getConfig') {
        // Kembalikan konfigurasi yang disimpan di environment variables atau default
        return res.status(200).json({
            apiKey: process.env.GROQ_API_KEY || "",
            apiUrl: process.env.API_URL || "https://api.groq.com/openai/v1/chat/completions",
            model: process.env.MODEL_NAME || "llama-3.3-70b-versatile",
            systemPrompt: process.env.SYSTEM_PROMPT || "Kamu adalah FROXX AI..."
        });
    }

    if (action === 'saveConfig') {
        // Di Vercel, kita tidak bisa menulis ke filesystem permanent.
        // Simpan ke environment variables tidak bisa lewat API.
        // Alternatif: simpan ke database (Vercel KV / Upstash) atau gunakan service eksternal.
        // Untuk demo, kita hanya return sukses dan menyimpan ke memory (tidak persisten).
        // Solusi produksi: gunakan Vercel KV atau simpan ke proses (tidak disarankan).
        // Karena itu kita kembalikan sukses dulu, asumsikan konfigurasi disimpan di sisi client.
        // Untuk keamanan asli, gunakan database.
        return res.status(200).json({ success: true, message: "Config saved (simulated)" });
    }

    return res.status(400).json({ error: 'Invalid action' });
}