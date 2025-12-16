import prisma from "@/lib/prisma";
import type { Item } from "@prisma/client";

export async function getItems(): Promise<Item[]> {
	const items = await prisma.item.findMany();
	return items;
}

export async function getItemById(id: string): Promise<Item | null> {
	const item = await prisma.item.findUnique({
		where: { id },
	});
	return item;
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
	// Since slug is stored in the JSON data field, we need to search through items
	const items = await prisma.item.findMany();
	const item = items.find((item) => {
		const data = item.data as { slug?: string };
		return data.slug === slug;
	});
	return item || null;
}
