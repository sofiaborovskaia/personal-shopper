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
		const response = await openai.responses.create({
			model: "gpt-4o-mini",
			instructions: `${getAssistantPersonalityPrompt(values)}

You are generating a short preview answer for the shopping assistant personality builder.
Do not search products, mention exact inventory, quote policies, include links, or invent prices.
Answer the user in 1-2 short sentences. Make the personality obvious.`,
			input: personalityPreviewUserMessage,
			temperature: 0.9,
			max_output_tokens: 120,
		});

		return {
			success: true,
			message:
				response.output_text.trim() ||
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
