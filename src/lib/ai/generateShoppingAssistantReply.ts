import openai from "@/lib/ai/openai";
import { getAssistantPersonalityPrompt } from "@/lib/prompts/personality";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

const generateShoppingAssistantReply = async (
	message: string,
	history: ChatMessage[],
	systemMessage: string,
	personality?: PersonalityValues | null,
) => {
	const personalityPrompt = getAssistantPersonalityPrompt(personality);
	const composedSystemMessage = personalityPrompt
		? `${systemMessage}\n\n${personalityPrompt}`
		: systemMessage;

	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content: composedSystemMessage,
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
