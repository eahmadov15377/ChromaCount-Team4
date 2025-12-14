// @ts-ignore
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { PaletteData } from "../types";



const SYSTEM_INSTRUCTION = `
You are ChromaCount, an expert color theorist and accessibility specialist. 
Your task is to analyze images and extract the most visually dominant and aesthetically significant colors.
You must also determine the "mood" of the image using descriptive tags (e.g., Warm, Cyberpunk, Melancholic, Pastel, Corporate).
`;

export const analyzeImage = async (base64Image: string): Promise<Omit<PaletteData, 'imageUrl' | 'timestamp' | 'id'>> => {
  
  // 1. Access the API key safely(FINALLLY SOMEONE FIXED THIS )
  const apiKey = (import.meta as any).env.VITE_API_KEY;


  // DEBUG:
  console.log("Current API Key:", apiKey); 

  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key in your .env file.");
  }

  // 2. Initialize the standard SDK
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // 3. Configure the model (Discorda baxin please chat da log var, 2.5 cox gec isleyir)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          colors: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          },
          moodTags: { 
            type: SchemaType.ARRAY, 
            items: { type: SchemaType.STRING } 
          }
        },
        required: ["colors", "moodTags"]
      }
    }
  });

  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  try {
    const result = await model.generateContent([
      { inlineData: { mimeType: "image/png", data: cleanBase64 } },
      "Extract the 5 to 8 most dominant colors. Provide 3 to 5 descriptive mood tags."
    ]);

    const text = result.response.text();
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