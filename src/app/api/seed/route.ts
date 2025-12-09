import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import mockProducts from "@/data/mock-products.json";

export async function GET() {
	try {
		const operations = mockProducts.map((item) =>
			prisma.item.create({
				data: {
					id: item.id,
					data: item.data,
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
