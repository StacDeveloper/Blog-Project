import { GoogleGenAI } from "@google/genai";
export const googleGemini = async (content) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GEMINI_API,
        });
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: content
        });
        console.log(response?.data);
    }
    catch (error) {
        console.log(error.message);
    }
};
//# sourceMappingURL=googlegemini.js.map