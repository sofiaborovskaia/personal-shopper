import { config } from "dotenv";

// Load both .env files
config({ path: ".env" });
config({ path: ".env.local" });

async function generateEmbeddings() {
	// Dynamic imports after env is loaded
	const { default: OpenAI } = await import("openai");
	const { default: prisma } = await import("../src/lib/prisma");

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	console.log("🚀 Starting embedding generation...\n");

	// Get all items
	const items = await prisma.item.findMany();
	console.log(`📦 Found ${items.length} items to process\n`);

	let successCount = 0;
	let errorCount = 0;

	for (const item of items) {
		try {
			// Create a rich text description combining multiple fields
			// This gives the embedding more context about the product
			const textToEmbed = `
${item.title}
${item.subtitle}
${item.description}
Category: ${item.category}
Brand: ${item.brand}
Type: ${item.type}
Materials: ${item.materials.join(", ")}
Colors: ${item.colors.join(", ")}
			`.trim();

			console.log(`⚙️  Processing: ${item.title}...`);

			// Generate embedding using OpenAI
			const embeddingResponse = await openai.embeddings.create({
				model: "text-embedding-3-small",
				input: textToEmbed,
			});

			const embedding = embeddingResponse.data[0].embedding;

			// Update the item with the embedding
			// We use raw SQL because Prisma doesn't fully support vector types yet
			// Convert the array to a properly formatted vector string for pgvector
			const vectorString = `[${embedding.join(",")}]`;

			// Use executeRaw with Prisma.sql for safe parameter binding
			await prisma.$executeRaw`
				UPDATE "Item" 
				SET embedding = ${vectorString}::vector 
				WHERE id = ${item.id}
			`;

			successCount++;
			console.log(`   ✅ Success (${successCount}/${items.length})\n`);
		} catch (error) {
			errorCount++;
			console.error(`   ❌ Error processing ${item.title}:`, error);
			console.log();
		}
	}

	console.log("\n🎉 Embedding generation complete!");
	console.log(`✅ Successful: ${successCount}`);
	console.log(`❌ Failed: ${errorCount}`);
}

generateEmbeddings().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
