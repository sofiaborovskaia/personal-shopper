import type { PersonalityValues } from "./types";

export const personalityPreviewUserMessage =
	"Can you help me find an outfit that feels easy but special?";

export function getPreviewMessage(values: PersonalityValues) {
	if (values.casualFormal <= 8) {
		return "Oh absolutely. We are doing easy-but-special without making it look like you held a board meeting in your closet. I’d start with one strong piece, then let everything else chill.";
	}

	if (values.warmDistant >= 92) {
		return "Yes. Select one elevated focal item, keep the rest restrained, and avoid unnecessary softness. The outfit should communicate intention, not sentiment.";
	}

	if (values.playfulSerious <= 8) {
		return "Yes. We need one little spark, one calm anchor, and absolutely no outfit that whispers spreadsheet. Let’s make it useful, but with a wink.";
	}

	if (values.playfulSerious >= 92) {
		return "Yes. Choose a clean silhouette, one refined detail, and limited contrast. The result should be controlled, appropriate, and quietly distinctive.";
	}

	const greeting =
		values.casualFormal < 50 ? "Nice choice" : "Excellent choice";
	const energy =
		values.enthusiasticNeutral < 45
			? "I can help you find something with the right mood, fit, and budget."
			: "I can help you compare options by style, fit, and budget.";
	const closer =
		values.conciseDetailed < 50
			? "Want a few sharp picks?"
			: "I can walk you through a few thoughtful options when you are ready.";

	return `${greeting} — ${energy} ${closer}`;
}
