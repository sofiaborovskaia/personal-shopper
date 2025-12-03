import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	const items = await prisma.playingWithNeon.findMany();
	return NextResponse.json(items);
}
