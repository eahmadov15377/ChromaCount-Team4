// --- START OF FILE api/analyze-image.js ---
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS Configuration: Allow your GitHub Pages domain to access this API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Server API Key configuration missing");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Construct the prompt for JSON output
    const fullPrompt = `
      ${prompt}
      Return ONLY a raw JSON object (no markdown formatting, no backticks).
      Format:
      {
        "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"],
        "moodTags": ["Tag1", "Tag2", "Tag3"]
      }
    `;

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([fullPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks from Gemini
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ candidates: [{ content: { parts: [{ text: cleanedText }] } }] });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}