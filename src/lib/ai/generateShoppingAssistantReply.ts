import OpenAI from "openai";
import type { ChatMessage } from "@/types/chat";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const generateShoppingAssistantReply = async (
	message: string,
	history: ChatMessage[],
	systemMessage: string,
) => {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content: systemMessage,
			},
			...history,
			{
				role: "user",
				content: message,
			},
		],
		temperature: 0.7,
	});

	const aiResponse = completion.choices[0].message.content;
	return aiResponse;
};

export default generateShoppingAssistantReply;
