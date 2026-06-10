import openai from "@/lib/ai/openai";

const checkMessageModeration = async (
	message: string,
): Promise<{ success: boolean; message?: string }> => {
	try {
		const moderation = await openai.moderations.create({
			input: message,
		});

		const flagged = moderation.results[0].flagged;
		if (flagged) {
			return {
				success: false,
				message:
					"Your message was flagged by our content moderation system. Please rephrase your question.",
			};
		}
	} catch (error) {
		console.error("Error checking moderation:", error);
		return {
			success: false,
			message: "Failed to check message moderation",
		};
	}
	return { success: true };
};

export default checkMessageModeration;
