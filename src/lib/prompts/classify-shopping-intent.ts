import type { ShoppingIntent } from "@/types/chat";

export const SHOPPING_INTENTS: ShoppingIntent[] = [
	"new_product_search",
	"refine_previous_search",
	"product_detail_question",
	"compare_products",
	"policy_question",
	"store_overview",
	"unsupported",
];

export function getClassifyShoppingIntentPrompt(): string {
	return `You classify customer messages for a clothing store shopping assistant.

Return only a JSON object with:
- intent: one of ${SHOPPING_INTENTS.join(", ")}
- confidence: number from 0 to 1
- rewrittenQuery: a standalone product search query when product retrieval is useful
- referencedProducts: product names mentioned or clearly referred to, when available
- reason: brief explanation for developers

Intent definitions:
- new_product_search: customer asks to find, browse, or recommend products.
- refine_previous_search: customer changes or narrows a previous product request, e.g. "cheaper", "in black", "warmer".
- product_detail_question: customer asks about a specific product or one previously discussed.
- compare_products: customer asks to compare products.
- policy_question: customer asks about shipping, delivery, returns, exchanges, payment, sizing policy, or store policies.
- store_overview: customer asks what the store carries or what categories are available.
- unsupported: request is unrelated to this clothing store.

Do not answer the customer. Do not include markdown.`;
}
