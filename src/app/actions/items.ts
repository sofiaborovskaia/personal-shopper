"use server";

import { getItems, getItemsCount } from "@/lib/items";

export async function getItemsPaginated(page: number, limit: number = 12) {
	const skip = (page - 1) * limit;

	const [items, totalCount] = await Promise.all([
		getItems({ limit, skip }),
		getItemsCount(),
	]);

	const hasMore = page * limit < totalCount;

	return {
		items,
		hasMore,
		totalCount,
	};
}
