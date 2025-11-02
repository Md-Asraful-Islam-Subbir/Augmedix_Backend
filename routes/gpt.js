import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ✅ Use latest Gemini model and API version
const MODEL = 'gemini-2.5-flash';  // or 'gemini-2.5-pro' if you prefer higher quality
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;
const API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  console.log("🔥 Incoming prompt:", prompt);

  if (!prompt) {
    console.log("⚠️ Missing prompt");
    return res.status(400).json({ error: 'Missing prompt' });
  }

  console.log("🔑 API Key loaded:", API_KEY ? "✅ Yes" : "❌ No");

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are a helpful medical assistant.
Based on the following patient symptoms, respond in 1–2 short sentences suggesting possible conditions in simple language.
If symptoms seem serious, advise consulting a doctor.

Symptoms: "${prompt}"
                `.trim()
              }
            ]
          }
        ]
      })
    });

    const text = await response.text();
    console.log("📦 Raw Gemini response:", text);

    // ✅ Safely parse JSON response
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Gemini did not return valid JSON");
      return res.status(500).json({ error: 'Invalid response from Gemini API', raw: text });
    }

    // ✅ Check for API errors
    if (data.error) {
      console.error("🚨 Gemini API returned an error:", data.error);
      return res.status(500).json({ error: data.error.message || 'Gemini API Error', details: data.error });
    }

    // ✅ Extract the assistant's response
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.error("❌ No text found in Gemini response");
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    res.json({ answer: rawText.trim() });
  } catch (error) {
    console.error('🚨 Gemini API Fetch Error:', error);
    res.status(500).json({ error: 'Gemini API call failed', details: error.message });
  }
});

export default router;
