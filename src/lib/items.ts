import prisma from "@/lib/prisma";
import type { Item } from "@prisma/client";
import OpenAI from "openai";

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
	const item = await prisma.item.findUnique({
		where: { slug },
	});
	return item;
}

export interface SemanticSearchOptions {
	query: string;
	limit?: number;
	onlyInStock?: boolean;
}

export async function searchItemsBySemantic(
	options: SemanticSearchOptions,
): Promise<Item[]> {
	const { query, limit = 5, onlyInStock = false } = options;

	// Initialize OpenAI client
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	// Generate embedding for the search query
	const embeddingResponse = await openai.embeddings.create({
		model: "text-embedding-3-small",
		input: query,
	});

	const queryEmbedding = embeddingResponse.data[0].embedding;
	const vectorString = `[${queryEmbedding.join(",")}]`;

	// Perform vector similarity search using cosine distance operator (<=>)
	// OpenAI embeddings are normalized, so cosine distance is most appropriate
	// Lower distance = more similar (0 = identical, 2 = opposite)
	// Return top-K most similar items regardless of absolute distance
	let items: Item[];

	if (onlyInStock) {
		items = await prisma.$queryRaw<Item[]>`
			SELECT *, (embedding <=> ${vectorString}::vector) as distance
			FROM "Item"
			WHERE "inStock" = true
			ORDER BY embedding <=> ${vectorString}::vector
			LIMIT ${limit}
		`;
	} else {
		items = await prisma.$queryRaw<Item[]>`
			SELECT *, (embedding <=> ${vectorString}::vector) as distance
			FROM "Item"
			ORDER BY embedding <=> ${vectorString}::vector
			LIMIT ${limit}
		`;
	}

	return items;
}
