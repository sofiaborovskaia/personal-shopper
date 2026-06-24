import type { PersonalityKey, PersonalitySlider, PersonalityValues } from "./types";

export const PERSONALITY_STORAGE_KEY = "shoppingAssistantPersonality";

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

export const personalityKeys: PersonalityKey[] = [
	"casualFormal",
	"playfulSerious",
	"warmDistant",
	"enthusiasticNeutral",
	"conciseDetailed",
	"spontaneousStructured",
];
