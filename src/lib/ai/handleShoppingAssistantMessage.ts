import checkMessageModeration from "@/lib/ai/checkMessageModeration";
import classifyShoppingNeed from "@/lib/ai/classifyShoppingNeed";
import formatStoreOverviewSummary from "@/lib/ai/formatStoreOverviewSummary";
import generateCombinedReply from "@/lib/ai/generateCombinedReply";
import generatePolicyReply from "@/lib/ai/generatePolicyReply";
import generateProductReply from "@/lib/ai/generateProductReply";
import generateStoreOverviewReply from "@/lib/ai/generateStoreOverviewReply";
import getRelevantProductsForMessage from "@/lib/ai/getRelevantProductsForMessage";
import { getCategories } from "@/lib/categories";
import type { PersonalityValues } from "@/lib/personality";
import type { ChatMessage } from "@/types/chat";
import type { Item } from "@prisma/client";

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
	const classification = await classifyShoppingNeed({ message, history });
	const needs = classification.needs;
	const needsPolicyContext = needs.includes("policy_context");
	const needsStoreOverview = needs.includes("store_overview");
	const needsProductRetrieval = needs.includes("product_retrieval");
	const needsPreviousProductContext = needs.includes(
		"previous_product_context",
	);
	const needsStyleAdvice = needs.includes("conversational_style_advice");
	const needsClarification = needs.includes("clarification");

	const needsProductGuidance =
		needsProductRetrieval ||
		needsPreviousProductContext ||
		needsStyleAdvice ||
		needsClarification;
	const needsShoppingContext = needsStoreOverview || needsProductGuidance;
	const needsMultiContextReply =
		[needsPolicyContext, needsStoreOverview, needsProductGuidance].filter(
			Boolean,
		).length > 1;

	if (needsPolicyContext && !needsShoppingContext) {
		const reply = await generatePolicyReply(message, history, personality);

		return {
			success: true,
			message: reply,
			needs: classification.needs,
		};
	}

	if (!needsShoppingContext) {
		return {
			success: true,
			message:
				"I can help with clothing in our store, including product recommendations, comparisons, sizing, shipping, and returns.",
			needs: classification.needs,
		};
	}

	let products: Item[] = [];
	if (needsProductGuidance && needsProductRetrieval) {
		products = await getRelevantProductsForMessage(
			classification.rewrittenQuery || message,
		);
	}

	const storeOverviewSummary = needsStoreOverview
		? formatStoreOverviewSummary(await getCategories())
		: undefined;

	let reply: string | null;
	if (needsMultiContextReply) {
		reply = await generateCombinedReply({
			message,
			history,
			products,
			personality,
			includeProductContext: needsProductGuidance,
			includePolicyContext: needsPolicyContext,
			storeOverviewSummary,
		});
	} else if (needsStoreOverview && storeOverviewSummary) {
		reply = await generateStoreOverviewReply({
			message,
			history,
			personality,
			storeOverviewSummary,
		});
	} else {
		reply = await generateProductReply({
			message,
			history,
			personality,
			products,
		});
	}

	return {
		success: true,
		message: reply,
		needs: classification.needs,
	};
};

export default handleShoppingAssistantMessage;
