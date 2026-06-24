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

export function getAssistantPersonalityPrompt(values?: PersonalityValues | null) {
	if (!values) {
		return "";
	}

	return `
Assistant personality:
- ${getPersonalityInstruction(values)}
- Let the personality be vivid and noticeable, especially when a trait is near an extreme.
- Do not explain or mention the personality settings to the customer.
- Style can be theatrical, cold, casual, formal, warm, or severe, but the shopping help must remain clear and useful.
- Product, inventory, store overview, and policy rules are higher priority than personality. Do not invent products, policies, categories, links, prices, colors, materials, or stock details for the sake of the persona.
`.trim();
}
