"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

type PersonalityKey =
	| "casualFormal"
	| "playfulSerious"
	| "warmDistant"
	| "enthusiasticNeutral"
	| "conciseDetailed"
	| "spontaneousStructured";

type PersonalityValues = Record<PersonalityKey, number>;

type PersonalitySlider = {
	key: PersonalityKey;
	leftLabel: string;
	rightLabel: string;
	ariaLabel: string;
};

const defaultPersonality: PersonalityValues = {
	casualFormal: 35,
	playfulSerious: 40,
	warmDistant: 25,
	enthusiasticNeutral: 35,
	conciseDetailed: 40,
	spontaneousStructured: 45,
};

const sliders: PersonalitySlider[] = [
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

function getLeaning(
	value: number,
	left: string,
	right: string,
	softLeft: string,
	softRight: string,
) {
	if (value <= 25) return left;
	if (value < 50) return softLeft;
	if (value <= 65) return softRight;
	return right;
}

function getPersonalityInstruction(values: PersonalityValues) {
	const warmth = getLeaning(
		values.warmDistant,
		"warm",
		"reserved",
		"warm",
		"balanced",
	);
	const formality = getLeaning(
		values.casualFormal,
		"casual",
		"formal",
		"fairly casual",
		"polished",
	);
	const playfulness = getLeaning(
		values.playfulSerious,
		"playful",
		"serious",
		"lightly playful",
		"focused",
	);
	const detail =
		values.conciseDetailed < 50
			? "Keep answers concise unless the user asks for more detail."
			: "Offer a little extra context when it helps the user decide.";
	const structure =
		values.spontaneousStructured < 50
			? "Make recommendations feel natural and easygoing."
			: "Organize suggestions clearly so they are easy to compare.";

	return `Respond in a ${warmth}, ${formality}, ${playfulness} style. ${detail} ${structure}`;
}

function getPreviewMessage(values: PersonalityValues) {
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

export default function PersonalityBuilderPage() {
	const [values, setValues] = useState<PersonalityValues>(defaultPersonality);
	const [appliedInstruction, setAppliedInstruction] = useState("");

	const instruction = useMemo(
		() => getPersonalityInstruction(values),
		[values],
	);
	const previewMessage = useMemo(() => getPreviewMessage(values), [values]);

	const updateValue = (key: PersonalityKey, value: number) => {
		setValues((current) => ({
			...current,
			[key]: value,
		}));
	};

	const resetPersonality = () => {
		setValues(defaultPersonality);
		setAppliedInstruction("");
	};

	return (
		<div className={styles.page}>
			<div className={styles.backgroundGlow} aria-hidden="true">
				<span className={styles.glowPink} />
				<span className={styles.glowCyan} />
				<span className={styles.glowOrange} />
			</div>

			<section className={styles.panel} aria-labelledby="personality-title">
				<div className={styles.introColumn}>
					<Link href="/items" className={styles.backLink}>
						Back to store
					</Link>

					<div>
						<p className={styles.eyebrow}>AI style companion</p>
						<h1 id="personality-title" className={styles.title}>
							Build your shopping assistant
						</h1>
						<p className={styles.intro}>
							Adjust how your AI style companion talks, helps, and recommends
							products.
						</p>
					</div>

					<div className={styles.previewCard} aria-live="polite">
						<div className={styles.previewHeader}>
							<span className={styles.avatar} aria-hidden="true">
								AI
							</span>
							<div>
								<p>Assistant message</p>
							</div>
						</div>
						<p className={styles.previewMessage}>{previewMessage}</p>
					</div>

					{appliedInstruction && (
						<p className={styles.appliedMessage} role="status">
							Personality applied for this session: {appliedInstruction}
						</p>
					)}
				</div>

				<div className={styles.controlsColumn}>
					<div className={styles.controlsHeader}>
						<h2>Tone controls</h2>
						<p>Slide each trait toward the voice you want to hear.</p>
					</div>

					<div className={styles.sliderList}>
						{sliders.map((slider) => (
							<div className={styles.sliderGroup} key={slider.key}>
								<div className={styles.sliderLabels}>
									<label htmlFor={slider.key}>{slider.leftLabel}</label>
									<span>{slider.rightLabel}</span>
								</div>
								<input
									id={slider.key}
									type="range"
									min="0"
									max="100"
									value={values[slider.key]}
									aria-label={slider.ariaLabel}
									onChange={(event) =>
										updateValue(slider.key, Number(event.target.value))
									}
									className={styles.slider}
								/>
							</div>
						))}
					</div>

					<div className={styles.actions}>
						<button
							type="button"
							className="neonButton"
							onClick={() => setAppliedInstruction(instruction)}
						>
							Apply personality
						</button>
						<button
							type="button"
							className="ghostButton"
							onClick={resetPersonality}
						>
							Reset
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
