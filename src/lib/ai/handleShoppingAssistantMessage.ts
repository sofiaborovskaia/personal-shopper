import checkMessageModeration from "@/lib/ai/checkMessageModeration";
import classifyShoppingNeed from "@/lib/ai/classifyShoppingNeed";
import generatePolicyReply from "@/lib/ai/generatePolicyReply";
import generateProductReply from "@/lib/ai/generateProductReply";
import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
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

	// Decide what context/actions the assistant needs before answering.
	const classification = await classifyShoppingNeed({ message, history });

	if (classification.needs.includes("policy_context")) {
		const reply = await generatePolicyReply(message, history);

		return {
			success: true,
			message: reply,
			needs: classification.needs,
		};
	}

	if (classification.needs.includes("store_overview")) {
		const products = await getItems({ limit: 5, onlyInStock: true });
		const reply = await generateProductReply({
			message,
			history,
			products,
		});

		return {
			success: true,
			message: reply,
			needs: classification.needs,
		};
	}

	if (!classification.needs.includes("product_retrieval")) {
		if (
			classification.needs.includes("previous_product_context") ||
			classification.needs.includes("conversational_style_advice") ||
			classification.needs.includes("clarification")
		) {
			const reply = await generateProductReply({
				message,
				history,
				products: [],
			});

			return {
				success: true,
				message: reply,
				needs: classification.needs,
			};
		}

		return {
			success: true,
			message:
				"I can help with clothing in our store, including product recommendations, comparisons, sizing, shipping, and returns.",
			needs: classification.needs,
		};
	}

	const retrievalQuery = classification.rewrittenQuery || message;
	const products = await getRelevantProductsForMessage(retrievalQuery);
	console.log(
		"Retrieved products for message:",
		products.map((p) => p.title),
	);
	const reply = await generateProductReply({
		message,
		history,
		products,
	});

	return {
		success: true,
		message: reply,
		needs: classification.needs,
	};
};

export default handleShoppingAssistantMessage;
