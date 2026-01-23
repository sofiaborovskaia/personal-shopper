"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Item } from "@prisma/client";
import { getItemsPaginated } from "@/app/actions/items";
import styles from "./styles.module.css";

interface ItemsListProps {
	initialItems: Item[];
	hasMore: boolean;
	totalCount: number;
	category?: string;
}

export default function ItemsList({
	initialItems,
	hasMore: initialHasMore,
	totalCount,
	category,
}: ItemsListProps) {
	const [items, setItems] = useState<Item[]>(initialItems);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(initialHasMore);
	const [loading, setLoading] = useState(false);

	const loadMore = async () => {
		setLoading(true);
		const nextPage = page + 1;

		const result = await getItemsPaginated(nextPage, undefined, category);

		setItems([...items, ...result.items]);
		setPage(nextPage);
		setHasMore(result.hasMore);
		setLoading(false);
	};

	return (
		<>
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

			{hasMore && (
				<div className={styles.loadMoreContainer}>
					<button onClick={loadMore} disabled={loading} className="neonButton">
						{loading ? "Loading..." : "Load More"}
					</button>
					<p className={styles.itemsCount}>
						Showing {items.length} of {totalCount} products
					</p>
				</div>
			)}
		</>
	);
}
