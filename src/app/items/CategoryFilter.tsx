"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import type { Category } from "@/lib/categories";

interface CategoryFilterProps {
	categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
	const searchParams = useSearchParams();
	const selectedCategory = searchParams.get("category");

	return (
		<nav className={styles.categoryFilter}>
			<Link
				href="/items"
				className={`${styles.categoryTab} ${
					!selectedCategory ? styles.categoryTabActive : ""
				}`}
			>
				All
			</Link>
			{categories.map((category) => (
				<Link
					key={category.slug}
					href={`/items?category=${category.slug}`}
					className={`${styles.categoryTab} ${
						selectedCategory === category.slug ? styles.categoryTabActive : ""
					}`}
				>
					{category.name}
				</Link>
			))}
		</nav>
	);
}
