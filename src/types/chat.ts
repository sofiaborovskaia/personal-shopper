export type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export type ShoppingNeed =
	| "product_retrieval"
	| "previous_product_context"
	| "policy_context"
	| "store_overview"
	| "clarification"
	| "conversational_style_advice"
	| "unsupported_redirect";

export type ShoppingNeedClassification = {
	needs: ShoppingNeed[];
	confidence: number;
	rewrittenQuery?: string;
	referencedProducts?: string[];
	reason?: string;
};
