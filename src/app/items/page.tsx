import { getItems } from "@/lib/items";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

export default async function ItemsPage() {
	const items = await getItems();

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All products</h1>
			<div className={styles.grid}>
				{items.map((item, index) => {
					// Deterministically select image based on index (cycles through 1-3)
					const imageNumber = (index % 3) + 1;

					return (
						<Link
							key={item.id}
							href={`/items/${item.slug}`}
							className={styles.card}
						>
							<div className={styles.imageContainer}>
								<Image
									src={`/productPictures/${imageNumber}.jpg`}
									alt={item.title}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className={styles.image}
								/>
							</div>
							<div className={styles.cardContent}>
								<h2>{item.title}</h2>
								<p className={styles.value}>
									€{(item.priceCents / 100).toFixed(2)}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
