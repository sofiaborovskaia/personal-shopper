const fs = require("fs");
const path = require("path");

// Read the original file
const originalData = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, "../src/data/mock-products.json"),
		"utf-8",
	),
);

// Transform each product
const refactoredData = originalData.map((product) => {
	const d = product.data;

	return {
		id: d.id,
		sku: d.sku,
		title: d.title,
		subtitle: d.subtitle || "",
		slug: d.slug,
		description: d.description,
		type: d.type,
		brand: d.brand,
		category: d.category,
		price_cents: d.price_cents,
		currency: d.currency,
		available: d.available,
		stock: d.stock,
		colors: d.colors || [],
		sizes: d.available_sizes || [],
		materials: d.materials || [],
	};
});

// Write the refactored file
fs.writeFileSync(
	path.join(__dirname, "../src/data/mock-products.json"),
	JSON.stringify(refactoredData, null, 2),
	"utf-8",
);

console.log(`✅ Refactored ${refactoredData.length} products successfully!`);
console.log("\nSample product structure:");
console.log(JSON.stringify(refactoredData[0], null, 2));
