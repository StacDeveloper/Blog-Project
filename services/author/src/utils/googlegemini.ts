import { GoogleGenAI } from "@google/genai"

export const googleGemini = async (content: string) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GEMINI_API! as string,
        });
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: content
        })
        console.log(response?.data)

    } catch (error: any) {
        console.log(error.message)
    }
}