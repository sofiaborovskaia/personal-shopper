import type { Item } from "@prisma/client";

const formatProductSummary = (items: Item[]) => {
	if (items.length === 0) {
		return "No products available or match this request.";
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
