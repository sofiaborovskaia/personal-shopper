"use server";

import handleShoppingAssistantMessage from "@/lib/ai/handleShoppingAssistantMessage";
import type { ChatMessage } from "@/types/chat";

export async function sendChatMessage(
	userMessage: string,
	history: ChatMessage[],
) {
	try {
		return await handleShoppingAssistantMessage({
			message: userMessage,
			history,
		});
	} catch (error) {
		console.error("Error calling OpenAI:", error);

		return {
			success: false,
			message: "Failed to get response from AI",
		};
	}
}
