"use server";

import handleShoppingAssistantMessage from "@/lib/ai/handleShoppingAssistantMessage";
import { normalizePersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

export async function sendChatMessage(
	userMessage: string,
	history: ChatMessage[],
	personality?: unknown,
) {
	try {
		return await handleShoppingAssistantMessage({
			message: userMessage,
			history,
			personality: normalizePersonalityValues(personality),
		});
	} catch (error) {
		console.error("Error calling OpenAI:", error);

		return {
			success: false,
			message: "Failed to get response from AI",
		};
	}
}
