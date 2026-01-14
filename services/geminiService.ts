
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPTS } from '../constants';
import { CoachSessionInput, CoachResponse } from '../types';

const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {}
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateLoveCoachResponse = async (input: CoachSessionInput): Promise<CoachResponse | null> => {
  try {
    const prompt = `
      User Situation:
      - Mood: ${input.mood}
      - Location Type: ${input.locationType}
      - Relationship Stage: ${input.stage}
      - Confidence Level: ${input.confidence}
      - Primary Obstacle: ${input.obstacleCategory} -> ${input.obstacleDetail}
      
      Additional Context:
      - Location Details: ${input.context.locationDetails}
      - Personality: ${input.context.personality}
      - Surroundings: ${input.context.surroundings}
      
      TASK: Provide advice in Hinglish (Hindi + English mix).
      RETURN JSON ONLY. Do not use Markdown code blocks.
      Structure:
      {
        "solution": "Psychology backed solution in 2-3 lines (Samadhan)",
        "script": "Exact dialogue to say (Bolne ke liye script)",
        "tone": "How to speak (Awaaz aur Tone)",
        "bodyLanguage": "Actionable body language tips (Body Language)",
        "bestTime": "Best time to execute this (Baat karne ke liye accha din)",
        "keyNote": "One crucial warning or tip (Khas baat)"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPTS.loveCoach,
        temperature: 0.7,
        responseMimeType: "application/json"
      },
      contents: prompt,
    });
    
    if (response.text) {
        return JSON.parse(response.text) as CoachResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateDatePlan = async (city: string, vibe: string, vibe2: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPTS.datePlanner,
        temperature: 0.8,
      },
      contents: `Plan a date in ${city}. Vibe: ${vibe}. Budget: ${vibe2}.`,
    });
    return response.text || "Generating plan...";
  } catch (error) {
    return "Could not generate plan.";
  }
};

export const generateProfileReview = async (bio: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPTS.profileRoaster,
        temperature: 0.9,
      },
      contents: `Review this bio: "${bio}"`,
    });
    return response.text || "Analyzing...";
  } catch (error) {
    return "Could not review profile.";
  }
};

export const generatePracticeResponse = async (history: {role: string, content: string}[], scenario: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `${SYSTEM_PROMPTS.practiceMode} Scenario: ${scenario}`,
        temperature: 0.8,
      },
      contents: { role: 'user', parts: [{ text: history[history.length - 1].content }] },
    });
    return response.text || "...";
  } catch (error) {
    return "(Silence...)";
  }
};

export const generateMessageSuggestions = async (context: string, tone: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPTS.messageHelper,
        temperature: 0.7,
      },
      contents: `Context: ${context}. Tone: ${tone}. Generate 3 options.`,
    });
    return response.text || "Suggestions unavailable.";
  } catch (error) {
    return "Error generating suggestions.";
  }
};

export const generateCaption = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPTS.captionGenerator,
        temperature: 0.8,
      },
      contents: `Photo Description: ${description}`,
    });
    return response.text || "Caption unavailable.";
  } catch (error) {
    return "Error generating caption.";
  }
};

export const generateFetcherResponse = async (model: string, prompt: string, systemInstruction: string) => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I encountered an error processing your request." };
  }
};
