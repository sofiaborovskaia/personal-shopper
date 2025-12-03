import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
	var __prismaClient: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not set in .env");
}

const adapter = new PrismaPg({ connectionString });

const client = new PrismaClient({ adapter });

const prisma = global.__prismaClient || client;
if (process.env.NODE_ENV === "development") {
	global.__prismaClient = prisma;
}

export default prisma;
