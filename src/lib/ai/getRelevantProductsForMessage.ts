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

	return items;
};

export default getRelevantProductsForMessage;
