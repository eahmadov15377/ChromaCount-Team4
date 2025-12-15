import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const { imageData, prompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // "gemini-pro-latest" is in your JSON list. It is stable and handles images.
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

    const fullPrompt = `${prompt} Return ONLY a raw JSON object. Format: {"colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"], "moodTags": ["Tag1", "Tag2", "Tag3"]}`;
    
    const imagePart = { inlineData: { data: imageData, mimeType: "image/jpeg" } };
    
    const result = await model.generateContent([fullPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.status(200).json({ candidates: [{ content: { parts: [{ text: cleanedText }] } }] });

  } catch (error) {
    console.error('Server Error:', error);
    // If it's a 503, it's just bad luck. Tell the user to click again.
    if (error.message.includes('503')) {
      return res.status(503).json({ error: "AI is warming up (503). Please click Analyze again!" });
    }
    return res.status(500).json({ error: error.message });
  }
}