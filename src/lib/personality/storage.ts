import { getPersonalityInstruction } from "@/lib/prompts/personality";
import { PERSONALITY_STORAGE_KEY } from "./config";
import { getPreviewMessage } from "./preview";
import { normalizePersonalityValues } from "./values";
import type { PersonalityValues, SavedPersonality } from "./types";

export function createSavedPersonality(
	values: PersonalityValues,
	previewMessage = getPreviewMessage(values),
): SavedPersonality {
	return {
		values,
		instruction: getPersonalityInstruction(values),
		previewMessage,
		updatedAt: new Date().toISOString(),
	};
}

export function readSavedPersonality(): SavedPersonality | null {
	if (typeof window === "undefined") {
		return null;
	}

	const rawValue = window.localStorage.getItem(PERSONALITY_STORAGE_KEY);
	if (!rawValue) {
		return null;
	}

	try {
		const parsed = JSON.parse(rawValue) as Partial<SavedPersonality>;
		const values = normalizePersonalityValues(parsed.values);

		if (!values) {
			return null;
		}

		return {
			values,
			instruction: getPersonalityInstruction(values),
			previewMessage:
				typeof parsed.previewMessage === "string" &&
				parsed.previewMessage.trim()
					? parsed.previewMessage.trim()
					: getPreviewMessage(values),
			updatedAt:
				typeof parsed.updatedAt === "string"
					? parsed.updatedAt
					: new Date().toISOString(),
		};
	} catch (error) {
		console.error("Error reading saved assistant personality:", error);
		return null;
	}
}

export function savePersonality(
	values: PersonalityValues,
	previewMessage?: string,
) {
	if (typeof window === "undefined") {
		return null;
	}

	const savedPersonality = createSavedPersonality(values, previewMessage);
	window.localStorage.setItem(
		PERSONALITY_STORAGE_KEY,
		JSON.stringify(savedPersonality),
	);

	return savedPersonality;
}

export function clearSavedPersonality() {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(PERSONALITY_STORAGE_KEY);
}
