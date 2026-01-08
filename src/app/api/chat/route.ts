import OpenAI from "openai";
import { searchItemsBySemantic } from "@/lib/items";

export async function POST(request: Request) {
	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const body = await request.json();
		const userMessage = body.message;
		const history = body.history || [];

		// Use semantic search to find relevant products based on the user's message
		const relevantItems = await searchItemsBySemantic({
			query: userMessage,
			onlyInStock: true,
			minQualityThreshold: 0.65, // Reject if distance > 0.65
		});

		// If no relevant items found, use a broader search
		// TODO: consider refining
		const items =
			relevantItems.length > 0
				? relevantItems
				: await searchItemsBySemantic({
						query: userMessage,
						onlyInStock: false, // This time include out-of-stock items
						minQualityThreshold: 0.7, // Slightly more permissive for fallback
				  });
		const productSummary =
			items.length > 0
				? items
						.map(
							(item) =>
								`- ${item.title}: ${item.description} (€${
									item.priceCents / 100
								}, colors: ${item.colors.join(
									", ",
								)}, materials: ${item.materials.join(", ")}, category: ${
									item.category
								}, stock: ${
									item.stock > 0 ? item.stock : "out of stock"
								}) - URL: /items/${item.slug}`,
						)
						.join("\n")
				: "No products currently match this request.";
		const systemMessage = `You are a helpful personal shopping assistant for a clothing store.

Your role:
1. I've already found the most relevant products for the customer's request using semantic search
2. Your job is to explain WHY these specific products are a good fit
3. Recommend 2-3 items from the list below that best match their needs
4. Be specific about features that address their request (e.g., "waterproof for hiking", "warm for winter", "professional for work")
5. Mention price, colors, and materials when relevant
6. If stock is low (under 20), mention "limited availability". If stock is over 20, don't mention stock at all.
7. **IMPORTANT**: When mentioning a product, create a Markdown link using the EXACT product title and the URL provided.
   Example: "I recommend the [All-Weather Field Jacket](/items/all-weather-field-jacket) because..."

${`Here are the most relevant products for this customer:\n${productSummary}`}

Be conversational, helpful, and explain the connection between what they asked for and why you're recommending these specific items.`;

		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: systemMessage,
				},
				...history,
				{
					role: "user",
					content: userMessage,
				},
			],
			temperature: 0.7,
		});

		const aiResponse = completion.choices[0].message.content;

		return Response.json({
			success: true,
			message: aiResponse,
			relevantProducts: items.length, // Debug info
		});
	} catch (error) {
		console.error("Error calling OpenAI:", error);

		return Response.json(
			{
				success: false,
				error: "Failed to get response from AI",
			},
			{ status: 500 },
		);
	}
}
