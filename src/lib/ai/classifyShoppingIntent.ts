import openai from "@/lib/ai/openai";
import {
	getClassifyShoppingIntentPrompt,
	SHOPPING_INTENTS,
} from "@/lib/prompts/classify-shopping-intent";
import type {
	ChatMessage,
	IntentClassification,
	ShoppingIntent,
} from "@/types/chat";

function isShoppingIntent(value: unknown): value is ShoppingIntent {
	return (
		typeof value === "string" &&
		SHOPPING_INTENTS.includes(value as ShoppingIntent)
	);
}

function toConfidence(value: unknown): number {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return 0.5;
	}

	return Math.max(0, Math.min(1, value));
}

function normalizeClassification(value: unknown): IntentClassification {
	if (!value || typeof value !== "object") {
		return {
			intent: "new_product_search",
			confidence: 0.4,
		};
	}

	const candidate = value as Partial<IntentClassification>;

	return {
		intent: isShoppingIntent(candidate.intent)
			? candidate.intent
			: "new_product_search",
		confidence: toConfidence(candidate.confidence),
		...(typeof candidate.rewrittenQuery === "string" &&
		candidate.rewrittenQuery.trim()
			? { rewrittenQuery: candidate.rewrittenQuery.trim() }
			: {}),
		...(Array.isArray(candidate.referencedProducts)
			? {
					referencedProducts: candidate.referencedProducts.filter(
						(product): product is string => typeof product === "string",
					),
				}
			: {}),
		...(typeof candidate.reason === "string" && candidate.reason.trim()
			? { reason: candidate.reason.trim() }
			: {}),
	};
}

const classifyShoppingIntent = async ({
	message,
	history,
}: {
	message: string;
	history: ChatMessage[];
}): Promise<IntentClassification> => {
	const recentHistory = history.slice(-6);

	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		response_format: { type: "json_object" },
		messages: [
			{
				role: "system",
				content: getClassifyShoppingIntentPrompt(),
			},
			{
				role: "user",
				content: JSON.stringify({
					latestMessage: message,
					recentHistory,
				}),
			},
		],
		temperature: 0,
	});

	const content = completion.choices[0].message.content;
	if (!content) {
		return { intent: "new_product_search", confidence: 0.4 };
	}

	try {
		return normalizeClassification(JSON.parse(content));
	} catch (error) {
		console.error("Error parsing intent classification:", error);
		return { intent: "new_product_search", confidence: 0.4 };
	}
};

export default classifyShoppingIntent;
