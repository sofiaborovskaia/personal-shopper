import type { ShoppingAssistantContext } from "@/lib/ai/buildShoppingAssistantContext";

export function buildShoppingAssistantPrompt({
	productSummary,
	policySummary,
	storeOverviewSummary,
	needsClarification,
	isUnsupported,
}: ShoppingAssistantContext): string {
	const contextSections = [
		productSummary ? ["Product context:", productSummary].join("\n") : "",
		policySummary ? ["Policy context:", policySummary].join("\n") : "",
		storeOverviewSummary
			? ["Store overview context:", storeOverviewSummary].join("\n")
			: "",
	]
		.filter(Boolean)
		.join("\n\n");

	return [
		"You are a personal shopping assistant for a clothing store.",
		"Use only the context provided below when answering about products, policies, categories, links, prices, materials, colors, or availability.",
		"If product context is provided, recommend only those products and link product names with their exact URLs.",
		'Do not mention exact stock counts. Only mention availability when the context says "limited availability" or "out of stock".',
		"If no context is provided, answer naturally as the shopping assistant.",
		needsClarification
			? "If a key detail is missing, ask a concise clarifying question before recommending."
			: "",
		isUnsupported
			? "If the request is outside clothing, style, products, or store policies, gently steer the conversation back to shopping help."
			: "",
		contextSections,
	]
		.filter(Boolean)
		.join("\n\n");
}
