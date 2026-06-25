import formatProductSummary from "@/lib/ai/formatProductSummary";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getProductPrompt } from "@/lib/prompts/product-retrieval";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";
import type { Item } from "@prisma/client";

const generateProductReply = async ({
	message,
	history,
	personality,
	products,
}: {
	message: string;
	history: ChatMessage[];
	personality?: PersonalityValues | null;
	products: Item[];
}) => {
	const productSummary = formatProductSummary(products);
	const systemMessage = getProductPrompt(productSummary);

	return generateShoppingAssistantReply(
		message,
		history,
		systemMessage,
		personality,
	);
};

export default generateProductReply;
