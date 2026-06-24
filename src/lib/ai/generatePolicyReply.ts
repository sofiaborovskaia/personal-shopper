import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getPolicyPrompt } from "@/lib/prompts/store-policy";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

const generatePolicyReply = async (
	message: string,
	history: ChatMessage[],
	personality?: PersonalityValues | null,
) => {
	return generateShoppingAssistantReply(
		message,
		history,
		getPolicyPrompt(),
		personality,
	);
};

export default generatePolicyReply;
