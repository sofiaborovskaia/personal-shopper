import formatProductSummary from "@/lib/ai/formatProductSummary";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getShoppingAssistantPrompt } from "@/lib/prompts/shopping-assistant";
import type { ChatMessage } from "@/types/chat";
import type { Item } from "@prisma/client";

const generateProductReply = async ({
	message,
	history,
	products,
}: {
	message: string;
	history: ChatMessage[];
	products: Item[];
}) => {
	const productSummary = formatProductSummary(products);
	const systemMessage = getShoppingAssistantPrompt(productSummary);

	return generateShoppingAssistantReply(message, history, systemMessage);
};

export default generateProductReply;
