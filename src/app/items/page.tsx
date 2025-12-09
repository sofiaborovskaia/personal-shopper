import { getItems } from "@/lib/items";
import styles from "./styles.module.css";

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All Items</h1>
			<div className={styles.grid}>
				{items.map((item) => (
					<div key={item.id} className={styles.card}>
						<h2>{item.data.title}</h2>
						<p className={styles.value}>
							€
							{(item.data.price_cents
								? item.data.price_cents / 100
								: item.data.variants[0].price_cents / 100
							).toFixed(2)}
						</p>
						<p className={styles.id}>ID: {item.id}</p>
					</div>
				))}
			</div>
		</div>
	);
}
