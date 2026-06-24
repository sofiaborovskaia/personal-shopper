"use server";

import openai from "@/lib/ai/openai";
import {
	normalizePersonalityValues,
	personalityPreviewUserMessage,
} from "@/lib/personality";
import { getAssistantPersonalityPrompt } from "@/lib/prompts/personality";

export async function generatePersonalityPreview(personality: unknown) {
	const values = normalizePersonalityValues(personality);

	if (!values) {
		return {
			success: false,
			message: "Could not generate a preview for these personality settings.",
		};
	}

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `${getAssistantPersonalityPrompt(values)}

You are generating a short preview answer for the shopping assistant personality builder.
Do not search products, mention exact inventory, quote policies, include links, or invent prices.
Answer the user in 1-2 short sentences. Make the personality obvious.`,
				},
				{
					role: "user",
					content: personalityPreviewUserMessage,
				},
			],
			temperature: 0.9,
			max_tokens: 120,
		});

		return {
			success: true,
			message:
				completion.choices[0].message.content?.trim() ||
				"I can help you shape something easy but memorable.",
		};
	} catch (error) {
		console.error("Error generating personality preview:", error);

		return {
			success: false,
			message: "Could not generate a preview right now.",
		};
	}
}
