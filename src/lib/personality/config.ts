import type { PersonalityKey, PersonalitySlider, PersonalityValues } from "./types";

export const PERSONALITY_STORAGE_KEY = "shoppingAssistantPersonality";

export const defaultPersonality: PersonalityValues = {
	casualPolished: 35,
	playfulStraightforward: 40,
	sweetSassy: 45,
	warmReserved: 25,
	calmEnergetic: 45,
	conciseDetailed: 40,
	classicCreative: 45,
};

export const personalitySliders: PersonalitySlider[] = [
	{
		key: "casualPolished",
		leftLabel: "Casual",
		rightLabel: "Polished",
		ariaLabel: "Casual to polished tone",
	},
	{
		key: "playfulStraightforward",
		leftLabel: "Playful",
		rightLabel: "Straightforward",
		ariaLabel: "Playful to straightforward tone",
	},
	{
		key: "sweetSassy",
		leftLabel: "Sweet",
		rightLabel: "Sassy",
		ariaLabel: "Sweet to sassy tone",
	},
	{
		key: "warmReserved",
		leftLabel: "Warm",
		rightLabel: "Reserved",
		ariaLabel: "Warm to reserved tone",
	},
	{
		key: "calmEnergetic",
		leftLabel: "Calm",
		rightLabel: "Energetic",
		ariaLabel: "Calm to energetic tone",
	},
	{
		key: "conciseDetailed",
		leftLabel: "Concise",
		rightLabel: "Detailed",
		ariaLabel: "Concise to detailed answers",
	},
	{
		key: "classicCreative",
		leftLabel: "Classic",
		rightLabel: "Creative",
		ariaLabel: "Classic to creative recommendations",
	},
];

export const personalityKeys: PersonalityKey[] = [
	"casualPolished",
	"playfulStraightforward",
	"sweetSassy",
	"warmReserved",
	"calmEnergetic",
	"conciseDetailed",
	"classicCreative",
];
