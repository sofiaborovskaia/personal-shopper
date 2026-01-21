import prisma from "@/lib/prisma";
import type { Item } from "@prisma/client";
import OpenAI from "openai";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ItemWithDistance = Item & { distance: number };

export interface GetItemsOptions {
	limit?: number;
	onlyInStock?: boolean;
}

export interface SemanticSearchOptions {
	query: string;
	limit?: number;
	onlyInStock?: boolean;
	minQualityThreshold?: number; // Reject results above this distance
}

// ============================================================================
// Get Items
// ============================================================================

export async function getItems(options?: GetItemsOptions): Promise<Item[]> {
	const { limit, onlyInStock } = options || {};

	const items = await prisma.item.findMany({
		where: onlyInStock ? { available: true } : undefined,
		take: limit,
		orderBy: { category: "asc" },
	});
	return items;
}

// ============================================================================
// Get Item by ID
// ============================================================================

export async function getItemById(id: string): Promise<Item | null> {
	const item = await prisma.item.findUnique({
		where: { id },
	});
	return item;
}

// ============================================================================
// Get Item by Slug
// ============================================================================

export async function getItemBySlug(slug: string): Promise<Item | null> {
	const item = await prisma.item.findUnique({
		where: { slug },
	});
	return item;
}

// ============================================================================
// Semantic Search
// ============================================================================

export async function searchItemsBySemantic(
	options: SemanticSearchOptions,
): Promise<ItemWithDistance[]> {
	const {
		query,
		limit = 5,
		onlyInStock = false,
		minQualityThreshold,
	} = options;

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
	// Lower distance = more similar (0 = identical, 2 = opposite)
	// Return top-K most similar items regardless of absolute distance
	let items: ItemWithDistance[];

	if (onlyInStock) {
		items = await prisma.$queryRaw<ItemWithDistance[]>`
			SELECT *, (embedding <=> ${vectorString}::vector) as distance
			FROM "Item"
			WHERE "available" = true
			ORDER BY embedding <=> ${vectorString}::vector
			LIMIT ${limit}
		`;
	} else {
		items = await prisma.$queryRaw<ItemWithDistance[]>`
			SELECT *, (embedding <=> ${vectorString}::vector) as distance
			FROM "Item"
			ORDER BY embedding <=> ${vectorString}::vector
			LIMIT ${limit}
		`;
	}

	// Optional quality filtering: reject results that are too dissimilar
	if (minQualityThreshold !== undefined) {
		items = items.filter((item) => item.distance < minQualityThreshold);
	}

	return items;
}
