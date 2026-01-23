import { getItemsPaginated } from "@/app/actions/items";
import { getCategories } from "@/lib/categories";
import ItemsList from "./ItemsList";
import CategoryFilter from "./CategoryFilter";
import styles from "./styles.module.css";

interface ItemsPageProps {
	searchParams: Promise<{ category?: string }>;
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
	const params = await searchParams;
	const category = params.category;

	const [initialData, categories] = await Promise.all([
		getItemsPaginated(1, 12, category),
		getCategories(),
	]);

	return (
		<div className={styles.container}>
			<CategoryFilter categories={categories} />
			<ItemsList
				key={category || "all"}
				initialItems={initialData.items}
				hasMore={initialData.hasMore}
				totalCount={initialData.totalCount}
				category={category}
			/>
		</div>
	);
}
