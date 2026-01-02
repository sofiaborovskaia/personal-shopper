import { getItems } from "@/lib/items";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

type ProductData = {
	title: string;
	slug: string;
	price_cents?: number;
	variants: Array<{ price_cents: number }>;
};

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All products</h1>
			<div className={styles.grid}>
				{items.map((item, index) => {
					const data = item.data as ProductData;
					// Deterministically select image based on index (cycles through 1-3)
					const imageNumber = (index % 3) + 1;

					return (
						<Link
							key={item.id}
							href={`/items/${data.slug}`}
							className={styles.card}
						>
							<div className={styles.imageContainer}>
								<Image
									src={`/productPictures/${imageNumber}.jpg`}
									alt={data.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className={styles.image}
								/>
							</div>
							<div className={styles.cardContent}>
								<h2>{data.title}</h2>
								<p className={styles.value}>
									€
									{(data.price_cents
										? data.price_cents / 100
										: data.variants[0].price_cents / 100
									).toFixed(2)}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
