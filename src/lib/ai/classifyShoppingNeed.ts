import openai from "@/lib/ai/openai";
import {
	getClassifyShoppingNeedPrompt,
	SHOPPING_NEEDS,
} from "@/lib/prompts/classify-shopping-need";
import type {
	ChatMessage,
	ShoppingNeed,
	ShoppingNeedClassification,
} from "@/types/chat";

function isShoppingNeed(value: unknown): value is ShoppingNeed {
	return (
		typeof value === "string" &&
		SHOPPING_NEEDS.includes(value as ShoppingNeed)
	);
}

function toConfidence(value: unknown): number {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return 0.5;
	}

	return Math.max(0, Math.min(1, value));
}

function normalizeClassification(value: unknown): ShoppingNeedClassification {
	if (!value || typeof value !== "object") {
		return {
			needs: ["product_retrieval"],
			confidence: 0.4,
		};
	}

	const candidate = value as Partial<ShoppingNeedClassification>;
	const needs = Array.isArray(candidate.needs)
		? candidate.needs.filter(isShoppingNeed)
		: [];

	return {
		needs: needs.length > 0 ? needs : ["product_retrieval"],
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

const shoppingNeedResponseFormat = {
	type: "json_schema" as const,
	name: "shopping_need_classification",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		properties: {
			needs: {
				type: "array",
				items: {
					type: "string",
					enum: SHOPPING_NEEDS,
				},
			},
			confidence: {
				type: "number",
				minimum: 0,
				maximum: 1,
			},
			rewrittenQuery: {
				type: ["string", "null"],
			},
			referencedProducts: {
				type: "array",
				items: {
					type: "string",
				},
			},
			reason: {
				type: ["string", "null"],
			},
		},
		required: [
			"needs",
			"confidence",
			"rewrittenQuery",
			"referencedProducts",
			"reason",
		],
	},
};

const classifyShoppingNeed = async ({
	message,
	history,
}: {
	message: string;
	history: ChatMessage[];
}): Promise<ShoppingNeedClassification> => {
	const response = await openai.responses.create({
		model: "gpt-4o-mini",
		instructions: getClassifyShoppingNeedPrompt(),
		input: JSON.stringify({
			latestMessage: message,
			recentHistory: history,
		}),
		text: {
			format: shoppingNeedResponseFormat,
		},
		temperature: 0,
	});

	const content = response.output_text;
	console.log("shopping needs", content);
	if (!content) {
		return { needs: ["product_retrieval"], confidence: 0.4 };
	}

	try {
		return normalizeClassification(JSON.parse(content));
	} catch (error) {
		console.error("Error parsing shopping need classification:", error);
		return { needs: ["product_retrieval"], confidence: 0.4 };
	}
};

export default classifyShoppingNeed;
