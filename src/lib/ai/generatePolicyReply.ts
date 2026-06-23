import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import {
	appendPersonalityToPrompt,
	type PersonalityValues,
} from "@/lib/personality-builder";
import { getPolicyPrompt } from "@/lib/prompts/store-policy";
import type { ChatMessage } from "@/types/chat";

const generatePolicyReply = async (
	message: string,
	history: ChatMessage[],
	personality?: PersonalityValues | null,
) => {
	return generateShoppingAssistantReply(
		message,
		history,
		appendPersonalityToPrompt(getPolicyPrompt(), personality),
	);
};

export default generatePolicyReply;
