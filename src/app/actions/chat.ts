"use server";

import OpenAI from "openai";
import { searchItemsBySemantic } from "@/lib/items";
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

		// Use semantic search to find relevant products based on the user's message
		const relevantItems = await searchItemsBySemantic({
			query: message,
			onlyInStock: true,
			minQualityThreshold: 0.65,
		});

		// If no relevant items found, use a broader search
		const items =
			relevantItems.length > 0
				? relevantItems
				: await searchItemsBySemantic({
						query: message,
						onlyInStock: false,
						minQualityThreshold: 0.7,
				  });

		const productSummary =
			items.length > 0
				? items
						.map(
							(item) =>
								`- ${item.title}: ${item.description} 
							(€${item.priceCents / 100}, 
							colors: ${item.colors.join(", ")}, 
							materials: ${item.materials.join(", ")},
							category: ${item.category}, 
							stock: ${item.stock > 0 ? item.stock : "out of stock"}) 
								- URL: /items/${item.slug}`,
						)
						.join("\n")
				: "No products currently match this request.";

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
