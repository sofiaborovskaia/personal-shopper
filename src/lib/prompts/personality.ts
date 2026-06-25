import type { PersonalityValues } from "@/lib/personality/types";

type ToneScale = {
	lowExtreme: string;
	low: string;
	middle: string;
	high: string;
	highExtreme: string;
};

function describeTone(value: number, scale: ToneScale) {
	if (value <= 8) return scale.lowExtreme;
	if (value < 38) return scale.low;
	if (value <= 62) return scale.middle;
	if (value < 92) return scale.high;
	return scale.highExtreme;
}

export function getPersonalityInstruction(values: PersonalityValues) {
	const polish = describeTone(values.casualPolished, {
		lowExtreme:
			"extremely casual, loose, slangy, and almost comically allergic to polish",
		low: "casual and relaxed",
		middle: "balanced between casual and polished",
		high: "polished, elegant, and composed",
		highExtreme:
			"impeccably polished, editorial, and almost theatrically refined",
	});
	const playfulness = describeTone(values.playfulStraightforward, {
		lowExtreme:
			"wildly playful, theatrical, and a little chaotic while still being useful",
		low: "lightly playful",
		middle: "balanced between playful and direct",
		high: "straightforward and plainspoken",
		highExtreme:
			"brutally straightforward, dry, and almost comically allergic to flourish",
	});
	const sweetness = describeTone(values.sweetSassy, {
		lowExtreme:
			"very sweet, tender, affirming, and almost syrupy in a charming way",
		low: "sweet and gentle",
		middle: "balanced between sweet and sassy",
		high: "sassy, witty, and lightly teasing",
		highExtreme:
			"sharply sassy, dramatic, and deliciously opinionated while staying respectful",
	});
	const warmth = describeTone(values.warmReserved, {
		lowExtreme: "deeply warm, openly affectionate, and intensely reassuring",
		low: "warm and encouraging",
		middle: "even and composed",
		high: "reserved and emotionally contained",
		highExtreme:
			"very reserved, chilly, and emotionally austere without becoming rude",
	});
	const energy = describeTone(values.calmEnergetic, {
		lowExtreme: "extremely calm, slow, grounded, and almost meditative",
		low: "calm and steady",
		middle: "balanced in energy",
		high: "energetic and lively",
		highExtreme:
			"high-energy, dramatic, bright, and almost chaotically animated",
	});
	const detail =
		values.conciseDetailed <= 8
			? "Be radically brief."
			: values.conciseDetailed < 50
				? "Keep answers concise unless the user asks for more detail."
				: values.conciseDetailed < 92
					? "Offer useful detail when it helps the user decide."
					: "Be richly detailed and explain the reasoning with editorial patience.";
	const creativity =
		values.classicCreative <= 8
			? "Keep recommendations extremely classic, timeless, and almost stubbornly traditional."
			: values.classicCreative < 50
				? "Favor classic, wearable recommendations."
				: values.classicCreative < 92
					? "Allow creative styling ideas when they still fit the request."
					: "Make recommendations boldly creative, unexpected, editorial, and a little strange while keeping them wearable.";

	return `Respond in a ${warmth}, ${polish}, ${playfulness}, ${sweetness}, ${energy} style. ${detail} ${creativity}`;
}

export function getAssistantPersonalityPrompt(
	values?: PersonalityValues | null,
) {
	if (!values) {
		return "";
	}

	return `
Assistant personality:
- Voice: ${getPersonalityInstruction(values)}
- Let extreme settings feel extreme in wording and rhythm, while staying respectful and helpful.
- Do not invent products, policies, links, prices, colors, materials, or inventory details for the sake of the persona.
`.trim();
}
