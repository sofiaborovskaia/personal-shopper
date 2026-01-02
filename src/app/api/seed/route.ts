import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import mockProducts from "@/data/mock-products.json";

export async function GET() {
	try {
		// First, clear existing items
		await prisma.item.deleteMany({});

		// Create all items with the new structure
		const operations = mockProducts.map((item) =>
			prisma.item.create({
				data: {
					id: item.id,
					sku: item.sku,
					title: item.title,
					subtitle: item.subtitle,
					slug: item.slug,
					description: item.description,
					type: item.type,
					brand: item.brand,
					category: item.category,
					priceCents: item.price_cents,
					currency: item.currency,
					available: item.available,
					stock: item.stock,
					colors: item.colors,
					sizes: item.sizes,
					materials: item.materials,
				},
			}),
		);

		await Promise.all(operations);

		return NextResponse.json({
			message: "Seeding completed",
			count: mockProducts.length,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Seeding failed", detail: String(error) },
			{ status: 500 },
		);
	}
}
