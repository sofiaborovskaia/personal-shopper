import prisma from "@/lib/prisma";

export type Item = {
	id: number;
	name: string;
	value: number;
};

export async function getItems(): Promise<Item[]> {
	const items = await prisma.playingWithNeon.findMany();
	return items;
}

export async function getItemById(id: number): Promise<Item | null> {
	const item = await prisma.playingWithNeon.findUnique({
		where: { id },
	});
	return item;
}
