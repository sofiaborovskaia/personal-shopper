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
