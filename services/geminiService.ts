import { GoogleGenAI } from "@google/genai";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFetcherResponse = async (model: string, prompt: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Context: ${context}\n\nUser Prompt: ${prompt}`,
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};