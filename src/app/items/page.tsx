import { getItems } from "@/lib/items";
import styles from "./styles.module.css";

type ProductData = {
	title: string;
	price_cents?: number;
	variants: Array<{ price_cents: number }>;
};

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All products</h1>
			<div className={styles.grid}>
				{items.map((item) => {
					const data = item.data as ProductData;
					return (
						<div key={item.id} className={styles.card}>
							<h2>{data.title}</h2>
							<p className={styles.value}>
								€
								{(data.price_cents
									? data.price_cents / 100
									: data.variants[0].price_cents / 100
								).toFixed(2)}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
