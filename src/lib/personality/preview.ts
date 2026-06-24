import type { PersonalityValues } from "./types";

export const personalityPreviewUserMessage =
	"Can you help me find an outfit that feels easy but special?";

export function getPreviewMessage(values: PersonalityValues) {
	if (values.casualPolished <= 8) {
		return "Oh completely. We are making this look effortless, not like the outfit had to pass a committee vote. One strong piece, everything else gets to relax.";
	}

	if (values.calmEnergetic >= 92) {
		return "Yes. Let’s give it voltage: one sharp statement piece, a clean base, and enough momentum that the outfit enters the room slightly before you do.";
	}

	if (values.sweetSassy >= 92) {
		return "Absolutely. We’ll keep it useful, but with a little eyebrow raise. Polished enough to work, spicy enough to avoid disappearing into the wallpaper.";
	}

	if (values.warmReserved >= 92) {
		return "Yes. Choose one elevated focal item, keep the rest controlled, and avoid unnecessary sentiment. The outfit should communicate intention with minimal fuss.";
	}

	if (values.classicCreative >= 92) {
		return "Yes. Let’s keep the silhouette wearable, then bend one detail sideways: texture, color, or proportion. Familiar enough to function, strange enough to feel alive.";
	}

	const greeting =
		values.casualPolished < 50 ? "Nice choice" : "Excellent choice";
	const energy =
		values.calmEnergetic >= 55
			? "I can help you find something with presence, rhythm, and the right kind of spark."
			: "I can help you find something with the right mood, fit, and budget.";
	const closer =
		values.conciseDetailed < 50
			? "Want a few sharp picks?"
			: "I can walk you through a few thoughtful options when you are ready.";

	return `${greeting} — ${energy} ${closer}`;
}
