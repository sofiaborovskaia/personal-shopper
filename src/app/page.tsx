import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<div className={styles.welcomeContainer}>
				<h1>🛍 Welcome to our store!</h1>
				<p>
					Remember, you can always ask our AI assistant if you need help finding
					the perfect item. Just click the &quot;Ask me!&quot; button at the
					bottom right corner.
				</p>
				<Link href="/items" className={styles.enterButton}>
					Enter the store
				</Link>
			</div>
		</div>
	);
}
