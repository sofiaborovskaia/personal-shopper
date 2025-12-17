import OpenAI from "openai";
import clothingItems from "@/data/mock-products.json";

export async function POST(request: Request) {
	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});

		const body = await request.json();
		const userMessage = body.message;
		const history = body.history || [];

		console.log("Received message:", userMessage);
		console.log("Conversation history length:", history.length);

		// Filter to only AVAILABLE products
		const availableProducts = clothingItems.filter(
			(item) => item.data.available,
		);

		// Convert products to text, now including stock status
		const productSummary = availableProducts
			.slice(0, 20) //  Limit to first 20 products to save tokens
			.map(
				(item) =>
					`- ${item.data.title}: ${item.data.description} (€${
						item.data.price_cents / 100
					}, colors: ${item.data.colors.join(", ")}, category: ${
						item.data.category
					}, stock: ${item.data.stock})`,
			)
			.join("\n"); // Create a mapping of product titles to slugs directly from data
		const productMap = availableProducts.reduce((acc, item) => {
			acc[item.data.title.toLowerCase()] = item.data.slug;
			return acc;
		}, {} as Record<string, string>);

		// Get unique categories from available products
		const availableCategories = [
			...new Set(availableProducts.map((item) => item.data.category)),
		];
		const systemMessage = `You are a helpful personal shopping assistant for a clothing store.

	CRITICAL RULES - YOU MUST FOLLOW THESE:
	1. We ONLY sell these categories: ${availableCategories.join(", ")}
	2. We DO NOT sell any other types of clothing
	3. If a customer asks for something we don't have, say: "I'm sorry, we currently only carry ${availableCategories.join(
		", ",
	)}. We don't have [requested item] in stock at the moment."
	4. NEVER make up or invent products
	5. ONLY recommend items from the exact list below
	6. However, if user asks for a general recommendation (e.g., "I need a summer outfit", "Recommend some trendy clothes"), suggest items from the list that would fit that need based on the context

	Here are ALL the products we have in stock:
	${productSummary}

	When making recommendations:
	- Check if the requested item category exists in our inventory first
	- If it doesn't exist, apologize and explain what we do have
	- Only recommend actual products from the list above
	- Suggest 2-3 specific products that match their needs
	- When mentioning a product name, use EXACTLY the product title as written in the list (e.g., "All-Weather Field Jacket")
	- Explain WHY each product fits their request
	- Mention the price and available colors
	- If stock is low (under 20), mention "limited stock"
	- Be friendly but honest about our inventory limitations`;

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
			temperature: 0.3,
		});

		const aiResponse = completion.choices[0].message.content;

		return Response.json({
			success: true,
			message: aiResponse,
			productMap,
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
