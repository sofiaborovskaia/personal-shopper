import OpenAI from "openai";
import clothingItems from "@/data/mock-products.json";

export async function POST(request: Request) {
	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const body = await request.json();
		const userMessage = body.message;

		console.log("Received message:", userMessage);

		// Filter to only AVAILABLE products
		// In a real app, you'd do smarter filtering based on the user's message
		const availableProducts = clothingItems.filter((item) => item.available);

		// Convert products to text, now including stock status
		const productSummary = availableProducts
			.slice(0, 20) //  Limit to first 20 products to save tokens
			.map(
				(item) =>
					`- ${item.title}: ${item.description} (€${
						item.price_cents / 100
					}, colors: ${item.colors.join(", ")}, category: ${
						item.category
					}, stock: ${item.stock})`,
			)
			.join("\n");

		console.log(
			`Sending ${availableProducts.slice(0, 20).length} products to AI`,
		);

		// 🎯 Updated system message
		const systemMessage = `You are a helpful personal shopping assistant. 

Your job is to recommend products from the available inventory based on what the customer needs.

Here are the products currently in stock that you can recommend:
${productSummary}

When making recommendations:
- ONLY recommend products from the list above
- Suggest 2-3 specific products that match their needs
- Explain WHY each product fits their request
- Mention the price, available colors, and stock level
- If stock is low (under 20), mention "limited stock"
- Be friendly and enthusiastic!`;
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: systemMessage,
				},
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
