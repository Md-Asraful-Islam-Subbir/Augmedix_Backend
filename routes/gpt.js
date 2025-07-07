import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

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
You are a medical assistant. Based on the following patient symptoms, respond in 1-2 sentences suggesting possible conditions in simple, helpful language.

Symptom description: "${prompt}"

If symptoms are serious, advise consulting a doctor.
                `.trim()
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    res.json({ answer: rawText.trim() });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Gemini API call failed' });
  }
});

export default router;
