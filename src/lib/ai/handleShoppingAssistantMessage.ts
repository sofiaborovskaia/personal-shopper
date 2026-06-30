import checkMessageModeration from "@/lib/ai/checkMessageModeration";
import { buildShoppingAssistantContext } from "@/lib/ai/buildShoppingAssistantContext";
import classifyShoppingNeed from "@/lib/ai/classifyShoppingNeed";
import generateShoppingAssistantReply from "@/lib/ai/generateShoppingAssistantReply";
import { buildShoppingAssistantPrompt } from "@/lib/prompts/shopping-assistant-context";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";

const handleShoppingAssistantMessage = async ({
	message,
	history,
	personality,
}: {
	message: string;
	history: ChatMessage[];
	personality?: PersonalityValues | null;
}) => {
	// Moderation: if fails, return the moderation message and abort the chat response
	const moderation = await checkMessageModeration(message);
	if (!moderation.success) {
		return {
			success: false,
			message: moderation.message,
		};
	}

	// Decide what context/actions the assistant needs before answering.
	const classification = await classifyShoppingNeed({
		message,
		history: history.slice(-6),
	});
	const context = await buildShoppingAssistantContext({
		message,
		classification,
	});
	const reply = await generateShoppingAssistantReply(
		message,
		history.slice(-10),
		buildShoppingAssistantPrompt(context),
		personality,
	);

	return {
		success: true,
		message: reply,
		needs: classification.needs,
	};
};

export default handleShoppingAssistantMessage;
