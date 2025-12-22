export interface ProductData {
	id: string;
	sku: string;
	title: string;
	subtitle: string;
	slug: string;
	description: string;
	type: string;
	brand: string;
	category: string;
	category_hierarchy: string[];
	price_cents: number;
	currency: string;
	available: boolean;
	stock: number;
	available_sizes: string[];
	colors: string[];
	materials: string[];
	options: Array<{
		key: string;
		name: string;
		values: string[];
	}>;
}

export interface ProductItem {
	id: string;
	data: ProductData;
	createdAt: Date;
	updatedAt: Date;
}
