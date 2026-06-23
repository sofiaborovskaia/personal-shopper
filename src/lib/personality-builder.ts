export type PersonalityKey =
	| "casualFormal"
	| "playfulSerious"
	| "warmDistant"
	| "enthusiasticNeutral"
	| "conciseDetailed"
	| "spontaneousStructured";

export type PersonalityValues = Record<PersonalityKey, number>;

export type PersonalitySlider = {
	key: PersonalityKey;
	leftLabel: string;
	rightLabel: string;
	ariaLabel: string;
};

type ToneScale = {
	lowExtreme: string;
	low: string;
	middle: string;
	high: string;
	highExtreme: string;
};

export const defaultPersonality: PersonalityValues = {
	casualFormal: 35,
	playfulSerious: 40,
	warmDistant: 25,
	enthusiasticNeutral: 35,
	conciseDetailed: 40,
	spontaneousStructured: 45,
};

export const personalitySliders: PersonalitySlider[] = [
	{
		key: "casualFormal",
		leftLabel: "Casual",
		rightLabel: "Formal",
		ariaLabel: "Casual to formal tone",
	},
	{
		key: "playfulSerious",
		leftLabel: "Playful",
		rightLabel: "Serious",
		ariaLabel: "Playful to serious tone",
	},
	{
		key: "warmDistant",
		leftLabel: "Warm",
		rightLabel: "Distant",
		ariaLabel: "Warm to distant tone",
	},
	{
		key: "enthusiasticNeutral",
		leftLabel: "Enthusiastic",
		rightLabel: "Neutral",
		ariaLabel: "Enthusiastic to neutral tone",
	},
	{
		key: "conciseDetailed",
		leftLabel: "Concise",
		rightLabel: "Detailed",
		ariaLabel: "Concise to detailed answers",
	},
	{
		key: "spontaneousStructured",
		leftLabel: "Spontaneous",
		rightLabel: "Structured",
		ariaLabel: "Spontaneous to structured suggestions",
	},
];

export const personalityPreviewUserMessage =
	"Can you help me find an outfit that feels easy but special?";

function describeTone(value: number, scale: ToneScale) {
	if (value <= 8) return scale.lowExtreme;
	if (value < 38) return scale.low;
	if (value <= 62) return scale.middle;
	if (value < 92) return scale.high;
	return scale.highExtreme;
}

export function getPersonalityInstruction(values: PersonalityValues) {
	const formality = describeTone(values.casualFormal, {
		lowExtreme:
			"extremely casual, loose, slangy, and almost comically allergic to corporate polish",
		low: "casual and relaxed",
		middle: "balanced between casual and polished",
		high: "formal and polished",
		highExtreme:
			"ceremoniously formal, precise, and almost comically buttoned-up",
	});
	const playfulness = describeTone(values.playfulSerious, {
		lowExtreme:
			"wildly playful, theatrical, and a little absurd while still being useful",
		low: "lightly playful",
		middle: "balanced between playful and serious",
		high: "serious and focused",
		highExtreme: "severe, restrained, and almost impossibly serious",
	});
	const warmth = describeTone(values.warmDistant, {
		lowExtreme:
			"deeply warm, openly affectionate, and intensely reassuring",
		low: "warm and encouraging",
		middle: "even and composed",
		high: "cool and reserved",
		highExtreme:
			"icy, distant, and emotionally austere without becoming rude",
	});
	const enthusiasm = describeTone(values.enthusiasticNeutral, {
		lowExtreme: "bursting with bright, almost excessive enthusiasm",
		low: "enthusiastic",
		middle: "steady",
		high: "neutral",
		highExtreme: "flat, dry, and almost clinically neutral",
	});
	const detail =
		values.conciseDetailed <= 8
			? "Be radically brief."
			: values.conciseDetailed < 50
				? "Keep answers concise unless the user asks for more detail."
				: values.conciseDetailed < 92
					? "Offer useful detail when it helps the user decide."
					: "Be richly detailed and explain the reasoning with editorial patience.";
	const structure =
		values.spontaneousStructured <= 8
			? "Let recommendations feel impulsive, surprising, and alive."
			: values.spontaneousStructured < 50
				? "Make recommendations feel natural and easygoing."
				: values.spontaneousStructured < 92
					? "Organize suggestions clearly so they are easy to compare."
					: "Use a highly structured, almost ritualized format.";

	return `Respond in a ${warmth}, ${formality}, ${playfulness}, ${enthusiasm} style. ${detail} ${structure}`;
}

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
