// --- START OF FILE api/analyze-image.js ---
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

  try {
    const { imageData, prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Server API Key configuration missing");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Construct prompt
    const fullPrompt = `
      ${prompt}
      Return ONLY a raw JSON object (no markdown formatting, no backticks).
      Format: {"colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"], "moodTags": ["Tag1", "Tag2", "Tag3"]}
    `;

    const imagePart = {
      inlineData: { data: imageData, mimeType: "image/jpeg" },
    };

    // We try the standard free model first. If it fails, we try the backup.
    let result;
    let usedModel = "gemini-1.5-flash";
    
    try {
      console.log("Attempting gemini-1.5-flash...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent([fullPrompt, imagePart]);
    } catch (e) {
      console.error("1.5-flash failed, trying backup gemini-1.5-pro...");
      // Backup: gemini-1.5-pro is also free-tier eligible (just slower)
      usedModel = "gemini-1.5-pro";
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      result = await model.generateContent([fullPrompt, imagePart]);
    }

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ 
      candidates: [{ content: { parts: [{ text: cleanedText }] } }],
      debug: `Used model: ${usedModel}`
    });

  } catch (error) {
    console.error('Server Error:', error);
    // If the error is a 503 (Overloaded), tell the frontend to just try again
    if (error.message.includes('503') || error.message.includes('overloaded')) {
      return res.status(503).json({ error: "Google AI is busy. Please click 'Analyze' again!" });
    }
    return res.status(500).json({ error: error.message });
  }
}