import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getStoreOverviewPrompt } from "@/lib/prompts/store-overview";
import type { ChatMessage } from "@/types/chat";

const generateStoreOverviewReply = async ({
	message,
	history,
	storeOverviewSummary,
}: {
	message: string;
	history: ChatMessage[];
	storeOverviewSummary: string;
}) => {
	return generateShoppingAssistantReply(
		message,
		history,
		getStoreOverviewPrompt(storeOverviewSummary),
	);
};

export default generateStoreOverviewReply;
