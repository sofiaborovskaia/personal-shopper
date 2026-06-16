import type { Item } from "@prisma/client";

const formatProductSummary = (items: Item[]) => {
	if (items.length === 0) {
		return "No new products were retrieved for this turn. Use the conversation history to answer about previously discussed products, and do not invent new products.";
	}

	return items
		.map(
			(item) =>
				`- ${item.title}: ${item.description} 
							(€${item.priceCents / 100}, 
							colors: ${item.colors.join(", ")}, 
							materials: ${item.materials.join(", ")},
							category: ${item.category}, 
							stock: ${item.stock > 0 ? item.stock : "out of stock"}) 
								- URL: /items/${item.slug}`,
		)
		.join("\n");
};

export default formatProductSummary;
