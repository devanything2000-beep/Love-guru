
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPTS } from '../constants';
import { CoachSessionInput, CoachResponse, AvatarConfig, VideoCoachResponse } from '../types';

const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {}
  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

// Helper to clean JSON strings from Markdown code blocks
const cleanAndParseJSON = <T>(text: string): T | null => {
    try {
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
        }
        return JSON.parse(cleanText) as T;
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
};

export const generateLoveCoachResponse = async (input: CoachSessionInput): Promise<CoachResponse | null> => {
  try {
    let detailedContext = "";
    if (input.detailedLocation) {
        detailedContext += `\n- Detailed Location: ${input.detailedLocation.city}, ${input.detailedLocation.state}, ${input.detailedLocation.country} (Pincode: ${input.detailedLocation.pincode})`;
    }
    if (input.advancedContext) {
        detailedContext += `\n- User Personality: ${input.advancedContext.userPersonality}`;
        detailedContext += `\n- Partner Personality: ${input.advancedContext.partnerPersonality}`;
        detailedContext += `\n- Timing/Meeting Context: ${input.advancedContext.timing}`;
        detailedContext += `\n- Who they are with: ${input.advancedContext.company}`;
        detailedContext += `\n- Atmosphere: ${input.advancedContext.atmosphere}`;
    }

    const prompt = `
      User Situation:
      - Mood: ${input.mood}
      - Location Type: ${input.locationType}
      - Relationship Stage: ${input.stage}
      - Confidence Level: ${input.confidence}
      - Primary Obstacle: ${input.obstacleCategory} -> ${input.obstacleDetail}
      
      Detailed Context:
      ${detailedContext}
      
      Additional Notes:
      - Location Details (Legacy): ${input.context.locationDetails}
      - Surroundings (Legacy): ${input.context.surroundings}
      
      TASK: Provide advice in Hinglish (Hindi + English mix).
      RETURN JSON ONLY.
      Structure:
      {
        "solution": "Psychology backed solution in 2-3 lines",
        "script": "Exact dialogue to say",
        "tone": "How to speak",
        "bodyLanguage": "Actionable body language tips",
        "bestTime": "Best time to execute this",
        "keyNote": "One crucial warning or tip"
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
        return cleanAndParseJSON<CoachResponse>(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateVideoCoachResponse = async (
  userMessage: string, 
  config: AvatarConfig, 
  history: {role: string, text: string}[]
): Promise<VideoCoachResponse | null> => {
  try {
    const prompt = `
      You are a specific AI Persona:
      - Gender: ${config.gender}
      - Age: ${config.age}
      - Role: ${config.personality}
      - Style: ${config.style}
      - Language: ${config.language} (Mix English + Hindi naturally if Hinglish)

      Context: Video Call with user.
      User said: "${userMessage}"
      
      Instructions:
      1. Reply as if talking face-to-face. 
      2. Keep it short (1-3 sentences) so it flows like a real chat.
      3. Be very expressive and human-like. Use fillers like "Hmm", "Dekho", "Listen".
      4. Select an emotion for your face: 'happy', 'serious', 'thinking', 'surprised', 'empathetic', 'flirty', 'romantic', 'confident'.

      Output JSON ONLY:
      {
        "text": "Your spoken response...",
        "emotion": "happy",
        "psychologyTip": "Short tip"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a human-like Indian Dating Coach on a video call. Speak naturally.",
        temperature: 0.8,
        responseMimeType: "application/json"
      },
      contents: prompt,
    });

    if (response.text) {
      return cleanAndParseJSON<VideoCoachResponse>(response.text);
    }
    return null;
  } catch (error) {
    console.error("Video Coach API Error:", error);
    return {
      text: "Connection weak hai, can you say that again?",
      emotion: "thinking"
    };
  }
};

// NEW: Natural Human Voice Generation
export const generateSpeechFromText = async (text: string, gender: 'Male' | 'Female'): Promise<string | null> => {
    try {
        const voiceName = gender === 'Female' ? 'Puck' : 'Fenrir'; // 'Puck' is soft female-ish, 'Fenrir' is deep male-ish in Gemini
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: text }] },
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
};

export const generateDailyGuidance = async (reflection: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a friendly, wise Indian Dating Coach. Give short advice in Hinglish.",
        temperature: 0.8,
      },
      contents: `User's Reflection: "${reflection}"`,
    });
    return response.text || "Keep going!";
  } catch (error) {
    return "Error generating guidance.";
  }
};

export const generateTechniqueGuide = async (techniqueName: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "Explain technique application in Hinglish.",
        temperature: 0.7,
      },
      contents: `Technique: ${techniqueName}. Context: ${context}.`,
    });
    return response.text || "Could not generate guide.";
  } catch (error) {
    return "Error generating guide.";
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
