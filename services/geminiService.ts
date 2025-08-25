import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Cleans the translation text by removing asterisks and trimming whitespace.
 * @param text The text to clean.
 * @returns The cleaned text.
 */
const cleanTranslation = (text: string): string => {
    return text.replace(/\*/g, '').trim();
};

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
        return cleanTranslation(response.text);
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
            text: "Đóng vai trò là một chuyên gia dịch thuật. Trích xuất bất kỳ văn bản nào từ hình ảnh này và chỉ cung cấp bản dịch tiếng Việt. Không bao gồm văn bản gốc hay bất kỳ lời giải thích nào. Nếu không có văn bản nào trong ảnh, hãy trả lời 'Không tìm thấy văn bản nào trong ảnh.'",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "text/plain",
            }
        });

        return cleanTranslation(response.text);

    } catch (error) {
        console.error("Error translating image:", error);
        throw new Error("Failed to get translation from API.");
    }
};