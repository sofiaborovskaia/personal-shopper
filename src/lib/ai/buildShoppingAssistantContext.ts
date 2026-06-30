import formatProductSummary from "@/lib/ai/formatProductSummary";
import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
import formatStoreOverviewSummary from "@/lib/ai/formatStoreOverviewSummary";
import { getCategories } from "@/lib/categories";
import { STORE_POLICY_SUMMARY } from "@/lib/prompts/store-policy";
import type { ShoppingNeedClassification } from "@/types/chat";

const PREVIOUS_PRODUCT_CONTEXT_SUMMARY =
	"Use the recent conversation to answer about previously discussed products. Do not invent new products.";

export type ShoppingAssistantContext = {
	productSummary?: string;
	policySummary?: string;
	storeOverviewSummary?: string;
	needsClarification: boolean;
	isUnsupported: boolean;
};

export async function buildShoppingAssistantContext({
	message,
	classification,
}: {
	message: string;
	classification: ShoppingNeedClassification;
}): Promise<ShoppingAssistantContext> {
	const needs = new Set(classification.needs);
	const shouldRetrieveProducts = needs.has("product_retrieval");
	const shouldUsePreviousProducts = needs.has("previous_product_context");

	const products = shouldRetrieveProducts
		? await getRelevantProductsForMessage(
				classification.rewrittenQuery || message,
			)
		: [];
	const productSummary = shouldRetrieveProducts
		? formatProductSummary(products)
		: shouldUsePreviousProducts
			? PREVIOUS_PRODUCT_CONTEXT_SUMMARY
			: undefined;

	return {
		...(productSummary ? { productSummary } : {}),
		...(needs.has("policy_context")
			? { policySummary: STORE_POLICY_SUMMARY }
			: {}),
		...(needs.has("store_overview")
			? {
					storeOverviewSummary: formatStoreOverviewSummary(
						await getCategories(),
					),
				}
			: {}),
		needsClarification: needs.has("clarification"),
		isUnsupported: needs.has("unsupported_redirect"),
	};
}
