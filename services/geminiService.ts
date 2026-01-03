
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAcademicAdvice = async (absencePercentage: number, subjects: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am a student with an absence percentage of ${absencePercentage}% in these subjects: ${subjects}. Give me professional academic advice to avoid disqualification and improve my performance. Keep it encouraging and bulleted.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to get advice right now. Please focus on attending your upcoming lectures.";
  }
};

export const processUserListAI = async (rawText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Process this raw list of names and data into a structured JSON array for university accounts. 
      Raw Data: ${rawText}
      Rules:
      1. Create a unique username (English, lowercase, no spaces).
      2. Create a professional university email (@unismart.edu).
      3. Set a temporary password.
      4. Identify if they are likely Students or Staff if mentioned.
      Return ONLY a JSON array of objects with keys: name, email, username, password, role (STUDENT, TA, or DOCTOR).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              username: { type: Type.STRING },
              password: { type: Type.STRING },
              role: { type: Type.STRING }
            },
            required: ["name", "email", "username", "password", "role"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Processing Error:", error);
    return null;
  }
};
