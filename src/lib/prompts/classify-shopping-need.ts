import type { ShoppingNeed } from "@/types/chat";

export const SHOPPING_NEEDS: ShoppingNeed[] = [
	"product_retrieval",
	"previous_product_context",
	"policy_context",
	"store_overview",
	"clarification",
	"conversational_style_advice",
	"unsupported_redirect",
];

export function getClassifyShoppingNeedPrompt(): string {
	return `You decide what context or actions a clothing store shopping assistant needs before answering.

Return only a JSON object with:
- needs: array containing one or more of ${SHOPPING_NEEDS.join(", ")}
- confidence: number from 0 to 1
- rewrittenQuery: a standalone product search query when product_retrieval is useful
- referencedProducts: product names mentioned or clearly referred to, when available
- reason: brief explanation for developers

Need definitions:
- product_retrieval: a fresh product search, refined product search, comparison, or product question would benefit from retrieving products.
- previous_product_context: the customer explicitly refers to a previously recommended or discussed product, product group, or option, e.g. "that jacket", "it", "the second one", "something cheaper", "would this work with the boots?".
- policy_context: the customer asks about shipping, delivery, arrival timing, returns, exchanges, payment, sizing policy, or store policies.
- store_overview: the customer asks what the store carries or what categories are available.
- clarification: the assistant should ask a clarifying question before searching or answering.
- conversational_style_advice: the customer asks for taste, styling, fit, occasion, or outfit judgment related to clothing.
- unsupported_redirect: the request is unrelated to this clothing store, clothing, style, products, or policies.

Continuity rules:
- Broad questions like "what do you have?", "what do you sell?", "what is in the shop?", or "show me the store" should be store_overview only. Do not add product_retrieval unless the customer asks for a specific category, item type, comparison, outfit, occasion, budget, or recommendation.
- Classify the latestMessage first. Use recentHistory only to resolve explicit references in the latestMessage.
- Do not assume the latestMessage is about the last discussed product just because a product appears in recentHistory.
- Set previous_product_context only when the latestMessage has a product continuity cue: a product name, product category already under discussion, option ordinal ("first one"), demonstrative tied to a product ("that jacket", "this one"), or an elliptical refinement of a product request ("cheaper", "in black", "more formal").
- Pronouns and words like "that" can refer to an occasion, event, trip, deadline, or idea instead of a product. If "that" refers to the customer's new event/occasion, do not set previous_product_context.
- A new occasion, location, date, or use case with a broad request such as "do you have anything that could work?" is a fresh shopping mission. Use product_retrieval and conversational_style_advice, not previous_product_context, unless the customer explicitly connects it to a prior product.
- Do not set policy_context merely because the customer mentions an event date. Set policy_context only when they ask about shipping, delivery, returns, exchanges, payment, sizing policy, or whether an order/product will arrive by a deadline.

Prefer needs over rigid intent categories. A message can have multiple needs.
Examples:
- "Do you ship to Portugal and have waterproof jackets?" => ["policy_context", "product_retrieval"]
- "Would that be too much for a wedding?" => ["previous_product_context", "conversational_style_advice"]
- "Something cheaper in black" => ["previous_product_context", "product_retrieval"]
- "Will it arrive in time for my wedding next week?" => ["previous_product_context", "policy_context"]
- "Would the leather jacket work for that business event in Paris?" => ["previous_product_context", "conversational_style_advice"]
- "I have a conference next month. Do you have any suits?" => ["product_retrieval", "conversational_style_advice"]
- "What do you sell?" => ["store_overview"]
- "Who won the game?" => ["unsupported_redirect"]

Do not answer the customer. Do not include markdown.`;
}
