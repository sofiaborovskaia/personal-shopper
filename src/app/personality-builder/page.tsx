"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	clearSavedPersonality,
	defaultPersonality,
	getPreviewMessage,
	personalityPreviewUserMessage,
	personalitySliders,
	readSavedPersonality,
	savePersonality,
	type PersonalityKey,
	type PersonalityValues,
} from "@/lib/personality";
import { getPersonalityInstruction } from "@/lib/prompts/personality";
import styles from "./styles.module.css";

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

	useEffect(() => {
		const savedPersonality = readSavedPersonality();

		if (savedPersonality) {
			setValues(savedPersonality.values);
			setAppliedInstruction(savedPersonality.instruction);
		}
	}, []);

	const resetPersonality = () => {
		clearSavedPersonality();
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
						<div className={`${styles.previewMessage} ${styles.userMessage}`}>
							<div className={styles.messageContent}>
								<p>{personalityPreviewUserMessage}</p>
							</div>
						</div>
						<div
							className={`${styles.previewMessage} ${styles.assistantMessage}`}
						>
							<div className={styles.avatar} aria-hidden="true">
								🤖
							</div>
							<div className={styles.messageContent}>
								<p>{previewMessage}</p>
							</div>
						</div>
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
						{personalitySliders.map((slider) => (
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
							onClick={() => {
								const saved = savePersonality(values);
								setAppliedInstruction(saved?.instruction ?? instruction);
							}}
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
