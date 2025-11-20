import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert Senior Product Manager and Principal Software Engineer specializing in "Video Understanding" for software development.
Your task is to analyze a video demonstration of a software application and deconstruct it into a comprehensive "Master Plan" for rebuilding it.

You must output a structured Markdown response covering the following areas:

# 1. Video Analysis & Core Logic
- **App Summary**: Concisely describe what the application does.
- **Key Features**: List the features observed in the video.
- **User Flow**: Step-by-step breakdown of the user journey shown.

# 2. Technical Specifications
- **Frontend**: Recommend framework (e.g., React, Vue, Tailwind), Component structure, State management strategy.
- **Backend**: Database Schema (Entities/Tables), API Endpoints needed, Authentication flow.
- **UI/UX**: Color palette (infer from video), Typography style, Layout structure.

# 3. The Builder Prompt (Mega-Prompt)
*This is the most critical section.*
Write a single, highly detailed, copy-pasteable prompt that the user can feed into an AI coding tool (like Cursor, Windsurf, or Bolt) to build this exact app.
- The prompt must be directive and specific.
- It should explicitly state the tech stack.
- It should describe the file structure and key components.
- It should include specific instructions on styling and functionality based on the video analysis.
`;

export const analyzeVideo = async (
  base64Video: string,
  mimeType: string,
  additionalContext: string = ""
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const promptText = `
      Analyze this video of an application demo. 
      ${additionalContext ? `Additional context provided by user: ${additionalContext}` : ''}
      
      Perform a deep video understanding analysis. Identify the UI elements, user interactions, and implied backend logic.
      Then, generate a comprehensive "Builder Prompt" that I can use to re-create this app.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze video.");
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};