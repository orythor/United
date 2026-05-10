export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, apiKey, apiUrl, model, systemPrompt } = req.body;

    if (!apiKey || !apiUrl || !model) {
        return res.status(400).json({ error: 'Missing configuration' });
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt || "Kamu adalah FROXX AI." },
                    { role: "user", content: message }
                ],
                temperature: 0.85,
                max_tokens: 2500
            })
        });

        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content || "Tidak ada respons.";
        res.status(200).json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}