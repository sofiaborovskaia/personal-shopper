import formatProductSummary from "@/lib/ai/formatProductSummary";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getShoppingAssistantPrompt } from "@/lib/prompts/shopping-assistant";
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
	const systemMessage = getShoppingAssistantPrompt(productSummary);

	return generateShoppingAssistantReply(
		message,
		history,
		systemMessage,
		personality,
	);
};

export default generateProductReply;
