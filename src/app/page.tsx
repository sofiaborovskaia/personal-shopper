import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<div className={styles.welcomeContainer}>
				<div>
					<p className={styles.title}>
						Step into a world where <i>AI meets intuition</i>. Your personal
						shopping companion is ready to guide you through curated
						collections, transforming browsing into discovery.
					</p>
					<p className={styles.subtitle}>
						Whether you're seeking the perfect product or need tailored
						recommendations, our AI assistant is here to make your experience
						seamless and enjoyable.
					</p>
				</div>
				<Link href="/items" className={styles.enterButton}>
					Enter the Store
				</Link>
			</div>
		</div>
	);
}
