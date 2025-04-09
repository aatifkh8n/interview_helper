import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
console.log("DD: OPEN API KEY: ", apiKey);
const generationConfig = {
    model: "gpt-4",  // Use "gpt-4-turbo" for cost-efficiency
    temperature: 1,
    //max_tokens: 8192,
};

export async function generateChatResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: generationConfig.model,
            messages: [
                { role: "developer", content: "You are an AI interviewer generating mock interview questions." },
                { role: "user", content: prompt }
            ],
            temperature: generationConfig.temperature,
            max_tokens: generationConfig.max_tokens,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error generating response:", error);
        return "Error generating question. Please try again.";
    }
}
