// --- START OF FILE src/services/gemini.ts ---
import { PaletteData } from "../types";

// IMPORTANT: When running locally, use localhost. 
// When on GitHub Pages, use your Vercel Project URL.
const API_ENDPOINT = 'https://chroma-count-team4.vercel.app/api/analyze-image'; 

export const analyzeImage = async (base64Image: string): Promise<Omit<PaletteData, 'imageUrl' | 'timestamp' | 'id'>> => {

  // Remove the data URL prefix
  const imageData = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        prompt: 'Extract the 5 to 8 most dominant colors. Provide 3 to 5 descriptive mood tags.'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    const data = await response.json();

    // The backend now handles the cleaning, but we parse here to be safe
    const resultText = data.candidates[0].content.parts[0].text;
    const parsedResult = JSON.parse(resultText);

    return {
      colors: parsedResult.colors,
      moodTags: parsedResult.moodTags
    };

  } catch (error) {
    console.error('Analysis Error:', error);
    throw new Error('Failed to analyze image. Ensure backend is running.');
  }
};