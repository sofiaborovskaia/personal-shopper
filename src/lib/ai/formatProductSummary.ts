import type { Item } from "@prisma/client";

function formatPrice(item: Item) {
	if (!Number.isFinite(item.priceCents)) {
		return "price unavailable";
	}

	const amount = (item.priceCents / 100).toFixed(2);
	return item.currency === "EUR" ? `€${amount}` : `${item.currency} ${amount}`;
}

function formatAvailability(item: Item) {
	if (!item.available || item.stock <= 0) {
		return "availability: out of stock";
	}

	if (item.stock < 5) {
		return "availability: limited availability";
	}

	return null;
}

const formatProductSummary = (items: Item[]) => {
	if (items.length === 0) {
		return "No products currently match this request.";
	}

	return items
		.map((item) => {
			const facts = [
				formatPrice(item),
				`colors: ${item.colors.join(", ")}`,
				`materials: ${item.materials.join(", ")}`,
				`category: ${item.category}`,
				formatAvailability(item),
			].filter(Boolean);

			return `- ${item.title}: ${item.description} 
							(${facts.join(", ")}) 
								- URL: /items/${item.slug}`;
		})
		.join("\n");
};

export default formatProductSummary;
