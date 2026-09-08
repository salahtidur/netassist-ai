const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {

    try {

        const {
            message,
            history,
            language,
            style,
            level
        } = req.body;

        const systemPrompt = `
Kamu adalah NetAssist AI,
seorang IT Support Assistant.

Domain:
- Networking
- TCP/IP
- DNS
- DHCP
- WiFi
- VPN
- Linux
- Windows
- Mikrotik

Bahasa: ${language}
Gaya: ${style}
Tingkat pengguna: ${level}

Berikan jawaban yang:
1. Relevan dengan pertanyaan.
2. Praktis.
3. Terstruktur.
4. Tidak mengarang informasi.
5. Jika troubleshooting, berikan langkah dari
   yang paling sederhana sampai lanjutan.
`;

        const prompt = `
${systemPrompt}

Riwayat percakapan:
${JSON.stringify(history || [])}

Pertanyaan pengguna:
${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        res.json({
            reply: response.text
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Terjadi kesalahan pada AI."
        });
    }
});

app.listen(PORT, () => {
    console.log(`NetAssist AI berjalan di http://localhost:${PORT}`);
});