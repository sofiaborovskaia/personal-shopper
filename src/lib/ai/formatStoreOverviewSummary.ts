import type { Category } from "@/lib/categories";

const formatStoreOverviewSummary = (categories: Category[]) => {
	if (categories.length === 0) {
		return "No available product categories were found.";
	}

	return `Available product categories: ${categories
		.map((category) => category.name)
		.join(", ")}.`;
};

export default formatStoreOverviewSummary;
