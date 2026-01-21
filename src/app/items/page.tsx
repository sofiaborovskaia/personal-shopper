import { getItemsPaginated } from "@/app/actions/items";
import ItemsList from "./ItemsList";
import styles from "./styles.module.css";

export default async function ItemsPage() {
	const initialData = await getItemsPaginated(1, 12);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>All products</h1>
			<ItemsList
				initialItems={initialData.items}
				hasMore={initialData.hasMore}
				totalCount={initialData.totalCount}
			/>
		</div>
	);
}
