import { NextRequest, NextResponse } from "next/server";
import { searchItemsBySemantic } from "@/lib/items";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get("q");

		if (!query) {
			return NextResponse.json(
				{ error: "Query parameter 'q' is required" },
				{ status: 400 },
			);
		}

		const limit = parseInt(searchParams.get("limit") || "5");
		const onlyInStock = searchParams.get("inStock") === "true";

		const items = await searchItemsBySemantic({
			query,
			limit,
			onlyInStock,
		});

		return NextResponse.json({
			query,
			results: items.length,
			items,
		});
	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Failed to perform search" },
			{ status: 500 },
		);
	}
}
