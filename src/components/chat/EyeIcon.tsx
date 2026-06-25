import styles from "./EyeIcon.module.css";

interface EyeIconProps {
	isHovered?: boolean;
}

export function EyeIcon({ isHovered = false }: EyeIconProps) {
	return (
		<svg
			className={`${styles.eyeIcon} ${isHovered ? styles.hovered : ""}`}
			width="62"
			height="62"
			viewBox="0 0 64 64"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path
				className={styles.eyeShape}
				d="M6 32C14 18 24 12 32 12s18 6 26 20c-8 14-18 20-26 20S14 46 6 32Z"
			/>
			<g className={styles.eyeGaze}>
				<circle className={styles.eyePupilGlow} cx="32" cy="32" r="12" />
				<circle className={styles.eyePupil} cx="32" cy="32" r="10" />
			</g>
			<circle className={styles.eyeSparkle} cx="38" cy="29" r="3" />
			<path
				className={styles.eyeClosedLine}
				d="M11 32C19 38 27 41 32 41s13-3 21-9"
			/>
		</svg>
	);
}
