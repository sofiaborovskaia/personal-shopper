import formatProductSummary from "@/lib/ai/formatProductSummary";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getCombinedShoppingAssistantPrompt } from "@/lib/prompts/combined-shopping-assistant";
import { STORE_POLICY_SUMMARY } from "@/lib/prompts/store-policy";
import type { ChatMessage } from "@/types/chat";
import type { Item } from "@prisma/client";

const generateCombinedReply = async ({
	message,
	history,
	products,
	includeProductContext = false,
	includePolicyContext = false,
	storeOverviewSummary,
}: {
	message: string;
	history: ChatMessage[];
	products: Item[];
	includeProductContext?: boolean;
	includePolicyContext?: boolean;
	storeOverviewSummary?: string;
}) => {
	const systemMessage = getCombinedShoppingAssistantPrompt({
		...(includeProductContext
			? { productSummary: formatProductSummary(products) }
			: {}),
		...(includePolicyContext ? { policySummary: STORE_POLICY_SUMMARY } : {}),
		...(storeOverviewSummary ? { storeOverviewSummary } : {}),
	});

	return generateShoppingAssistantReply(message, history, systemMessage);
};

export default generateCombinedReply;
