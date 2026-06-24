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

export type SavedPersonality = {
	values: PersonalityValues;
	instruction: string;
	updatedAt: string;
};
