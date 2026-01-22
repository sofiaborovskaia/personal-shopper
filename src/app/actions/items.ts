"use server";

import { getItems, getItemsCount } from "@/lib/items";

export async function getItemsPaginated(
	page: number,
	limit: number = 12,
	category?: string,
) {
	const skip = (page - 1) * limit;

	const [items, totalCount] = await Promise.all([
		getItems({ limit, skip, category }),
		getItemsCount({ category }),
	]);

	const hasMore = page * limit < totalCount;

	return {
		items,
		hasMore,
		totalCount,
	};
}
