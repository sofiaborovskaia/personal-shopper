export type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

export type ShoppingIntent =
	| "new_product_search"
	| "refine_previous_search"
	| "product_detail_question"
	| "compare_products"
	| "policy_question"
	| "store_overview"
	| "unsupported";

export type IntentClassification = {
	intent: ShoppingIntent;
	confidence: number;
	rewrittenQuery?: string;
	referencedProducts?: string[];
	reason?: string;
};
