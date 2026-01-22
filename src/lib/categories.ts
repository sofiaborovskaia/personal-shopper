import prisma from "@/lib/prisma";

export type Category = {
	slug: string;
	name: string;
};

function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export async function getCategories(): Promise<Category[]> {
	const rawCategories = await prisma.item.findMany({
		where: { available: true },
		select: { category: true },
		distinct: ["category"],
	});

	// Normalize: lowercase for slug, capitalize for display
	const categories = rawCategories
		.map((c) => ({
			slug: c.category.toLowerCase().trim(),
			name: capitalize(c.category.trim()),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	return categories;
}
