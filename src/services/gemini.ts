import { GoogleGenAI, Type } from "@google/genai";
import { PaletteData } from "../types";

const SYSTEM_INSTRUCTION = `
You are ChromaCount, an expert color theorist and accessibility specialist. 
Your task is to analyze images and extract the most visually dominant and aesthetically significant colors.
You must also determine the "mood" of the image using descriptive tags (e.g., Warm, Cyberpunk, Melancholic, Pastel, Corporate).
`;

export const analyzeImage = async (base64Image: string): Promise<Omit<PaletteData, 'imageUrl' | 'timestamp' | 'id'>> => {
  
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: "Extract the 5 to 8 most dominant colors. Provide 3 to 5 descriptive mood tags." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            moodTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["colors", "moodTags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return {
      colors: data.colors,
      moodTags: data.moodTags
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};