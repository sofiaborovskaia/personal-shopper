import { personalityKeys } from "./config";
import type { PersonalityKey, PersonalityValues } from "./types";

function normalizePersonalityValue(value: unknown) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return null;
	}

	return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizePersonalityValues(
	value: unknown,
): PersonalityValues | null {
	if (!value || typeof value !== "object") {
		return null;
	}

	const candidate = value as Partial<Record<PersonalityKey, unknown>>;
	const normalized = {} as PersonalityValues;

	for (const key of personalityKeys) {
		const traitValue = normalizePersonalityValue(candidate[key]);

		if (traitValue === null) {
			return null;
		}

		normalized[key] = traitValue;
	}

	return normalized;
}
