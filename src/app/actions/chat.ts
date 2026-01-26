"use server";

import OpenAI from "openai";
import { searchItemsBySemantic, getItems } from "@/lib/items";
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
		const moderation = await openai.moderations.create({
			input: message,
		});

		const result = moderation.results[0];

		console.log("🛡️ Moderation Check:");
		console.log(`  Flagged: ${result.flagged}`);
		console.log("  Categories:");
		console.log(`    Hate: ${result.categories.hate}`);
		console.log(
			`    Hate/Threatening: ${result.categories["hate/threatening"]}`,
		);
		console.log(`    Harassment: ${result.categories.harassment}`);
		console.log(
			`    Harassment/Threatening: ${result.categories["harassment/threatening"]}`,
		);
		console.log(`    Self-harm: ${result.categories["self-harm"]}`);
		console.log(
			`    Self-harm/Intent: ${result.categories["self-harm/intent"]}`,
		);
		console.log(
			`    Self-harm/Instructions: ${result.categories["self-harm/instructions"]}`,
		);
		console.log(`    Sexual: ${result.categories.sexual}`);
		console.log(`    Sexual/Minors: ${result.categories["sexual/minors"]}`);
		console.log(`    Violence: ${result.categories.violence}`);
		console.log(
			`    Violence/Graphic: ${result.categories["violence/graphic"]}`,
		);

		// Optionally block flagged content
		if (result.flagged) {
			return {
				success: false,
				message:
					"Your message was flagged by our content moderation system. Please rephrase your question.",
			};
		}

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

		// If still no results, user might be asking a general question
		// Provide a sample of products for them to browse
		const finalItems =
			items.length > 0
				? items
				: await getItems({ limit: 10, onlyInStock: true });

		const productSummary =
			finalItems.length > 0
				? finalItems
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
				: "No products available or match this request.";

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

		// Log token usage
		const usage = completion.usage;
		if (usage) {
			console.log("🤖 Token Usage:");
			console.log(`  Prompt tokens: ${usage.prompt_tokens}`);
			console.log(`  Completion tokens: ${usage.completion_tokens}`);
			console.log(`  Total tokens: ${usage.total_tokens}`);
		}

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
