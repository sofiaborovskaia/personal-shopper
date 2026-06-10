"use server";

import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
import checkMessageModeration from "@/lib/ai/checkMessageModeration";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import formatProductSummary from "@/lib/ai/formatProductSummary";

import { getShoppingAssistantPrompt } from "@/lib/prompts/shopping-assistant";
import type { ChatMessage } from "@/types/chat";

export async function sendChatMessage(
	userMessage: string,
	history: ChatMessage[],
) {
	try {
		// Moderation: if fails, return the moderation message and abort the chat response
		const moderation = await checkMessageModeration(userMessage);
		if (!moderation.success) {
			return {
				success: false,
				message: moderation.message,
			};
		}

		const products = await getRelevantProductsForMessage(userMessage);
		const productSummary = formatProductSummary(products);

		const systemMessage = getShoppingAssistantPrompt(productSummary);

		const reply = await generateShoppingAssistantReply(
			userMessage,
			history,
			systemMessage,
		);

		return {
			success: true,
			message: reply,
		};
	} catch (error) {
		console.error("Error calling OpenAI:", error);

		return {
			success: false,
			message: "Failed to get response from AI",
		};
	}
}
