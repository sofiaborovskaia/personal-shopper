import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { getPolicyPrompt } from "@/lib/prompts/store-policy";
import type { ChatMessage } from "@/types/chat";

const generatePolicyReply = async (
	message: string,
	history: ChatMessage[],
) => {
	return generateShoppingAssistantReply(message, history, getPolicyPrompt());
};

export default generatePolicyReply;
