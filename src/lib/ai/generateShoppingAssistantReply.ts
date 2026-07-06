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

	const response = await openai.responses.create({
		model: "gpt-4o-mini",
		instructions: composedSystemMessage,
		input: [
			...history.map((entry) => ({
				role: entry.role,
				content: entry.content,
			})),
			{
				role: "user",
				content: message,
			},
		],
		temperature: 0.7,
	});

	return response.output_text;
};

export default generateShoppingAssistantReply;
