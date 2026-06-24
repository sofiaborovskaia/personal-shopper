import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getStoreOverviewPrompt } from "@/lib/prompts/store-overview";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

const generateStoreOverviewReply = async ({
	message,
	history,
	personality,
	storeOverviewSummary,
}: {
	message: string;
	history: ChatMessage[];
	personality?: PersonalityValues | null;
	storeOverviewSummary: string;
}) => {
	return generateShoppingAssistantReply(
		message,
		history,
		getStoreOverviewPrompt(storeOverviewSummary),
		personality,
	);
};

export default generateStoreOverviewReply;
