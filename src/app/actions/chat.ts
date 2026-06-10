"use server";

import OpenAI from "openai";
import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
import checkMessageModeration from "@/lib/ai/checkMessageModeration";

import { getShoppingAssistantPrompt } from "@/lib/prompts/shopping-assistant";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export async function sendChatMessage(message: string, history: ChatMessage[]) {
	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		// Check moderation
		const moderation = await checkMessageModeration(message);

		if (!moderation.success) {
			// If moderation fails, return the moderation message and abort the chat response
			return {
				success: false,
				message: moderation.message,
			};
		}

		const productSummary = await getRelevantProductsForMessage(message);
		const systemMessage = getShoppingAssistantPrompt(productSummary);

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

		return {
			success: true,
			message: aiResponse,
		};
	} catch (error) {
		console.error("Error calling OpenAI:", error);

		return {
			success: false,
			message: "Failed to get response from AI",
		};
	}
}
