import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getGeneralShoppingAssistantPrompt } from "@/lib/prompts/general-shopping-assistant";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

const generateGeneralReply = async ({
	message,
	history,
	personality,
}: {
	message: string;
	history: ChatMessage[];
	personality?: PersonalityValues | null;
}) => {
	return generateShoppingAssistantReply(
		message,
		history,
		getGeneralShoppingAssistantPrompt(),
		personality,
	);
};

export default generateGeneralReply;
