import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (text: string): Promise<string> => {
    try {
        if (!text.trim()) {
            return "";
        }
        const prompt = `Đóng vai trò là một chuyên gia có nhiều năm kinh nghiệm về dịch thuật, hãy dịch văn bản dưới đây sang tiếng việt một cách ngắn gọn, súc tích, tập trung vào ngữ cảnh của văn bản mà không cần nói gì thêm:\n\n${text}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "text/plain",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error translating text:", error);
        throw new Error("Failed to get translation from API.");
    }
};

export const translateImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };

        const textPart = {
            text: "Please extract any text you find in this image and translate it accurately into Vietnamese. If there is no discernible text, please respond with 'Không tìm thấy văn bản nào trong ảnh.'.",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "text/plain",
            }
        });

        return response.text;

    } catch (error) {
        console.error("Error translating image:", error);
        throw new Error("Failed to get translation from API.");
    }
};