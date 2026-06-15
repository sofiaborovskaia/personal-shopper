import type { IntentClassification } from "@/types/chat";

const PRODUCT_RETRIEVAL_INTENTS = [
	"new_product_search",
	"refine_previous_search",
	"product_detail_question",
	"compare_products",
];

export default function shouldRetrieveProducts(
	classification: IntentClassification,
): boolean {
	return PRODUCT_RETRIEVAL_INTENTS.includes(classification.intent);
}
