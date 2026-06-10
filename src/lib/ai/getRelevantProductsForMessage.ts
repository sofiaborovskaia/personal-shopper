import { searchItemsBySemantic, getItems } from "@/lib/items";
import type { Item } from "@prisma/client";

const OPTIMAL_QUALITY_THRESHOLD = 0.65;
const BROAD_QUALITY_THRESHOLD = 0.7;

const getRelevantProductsForMessage = async (
	message: string,
): Promise<Item[]> => {
	// Use semantic search to find relevant products based on the user's message
	const relevantItems = await searchItemsBySemantic({
		query: message,
		onlyInStock: true,
		minQualityThreshold: OPTIMAL_QUALITY_THRESHOLD,
	});

	// If no relevant items found, use a broader search
	const items =
		relevantItems.length > 0
			? relevantItems
			: await searchItemsBySemantic({
					query: message,
					onlyInStock: false,
					minQualityThreshold: BROAD_QUALITY_THRESHOLD,
				});

	// If still no results, user might be asking a general question
	// Provide a sample of products for them to browse
	const finalItems =
		items.length > 0 ? items : await getItems({ limit: 10, onlyInStock: true });

	return finalItems;
};

export default getRelevantProductsForMessage;
