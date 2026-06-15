import checkMessageModeration from "@/lib/ai/checkMessageModeration";
import classifyShoppingIntent from "@/lib/ai/classifyShoppingIntent";
import generatePolicyReply from "@/lib/ai/generatePolicyReply";
import generateProductReply from "@/lib/ai/generateProductReply";
import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
import shouldRetrieveProducts from "@/lib/ai/shouldRetrieveProducts";
import { getItems } from "@/lib/items";
import type { ChatMessage } from "@/types/chat";

const handleShoppingAssistantMessage = async ({
	message,
	history,
}: {
	message: string;
	history: ChatMessage[];
}) => {
	// Moderation: if fails, return the moderation message and abort the chat response
	const moderation = await checkMessageModeration(message);
	if (!moderation.success) {
		return {
			success: false,
			message: moderation.message,
		};
	}

	// Classify the user's intent
	const classification = await classifyShoppingIntent({ message, history });

	if (classification.intent === "policy_question") {
		const reply = await generatePolicyReply(message, history);

		return {
			success: true,
			message: reply,
			intent: classification.intent,
		};
	}

	if (classification.intent === "store_overview") {
		const products = await getItems({ limit: 5, onlyInStock: true });
		const reply = await generateProductReply({
			message,
			history,
			products,
		});

		return {
			success: true,
			message: reply,
			intent: classification.intent,
		};
	}

	if (!shouldRetrieveProducts(classification)) {
		return {
			success: true,
			message:
				"I can help with clothing in our store, including product recommendations, comparisons, sizing, shipping, and returns.",
			intent: classification.intent,
		};
	}

	const retrievalQuery = classification.rewrittenQuery || message;
	const products = await getRelevantProductsForMessage(retrievalQuery);
	const reply = await generateProductReply({
		message,
		history,
		products,
	});

	return {
		success: true,
		message: reply,
		intent: classification.intent,
	};
};

export default handleShoppingAssistantMessage;
