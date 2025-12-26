import { getItemBySlug } from "@/lib/items";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

type ProductData = {
	title: string;
	subtitle?: string;
	description?: string;
	brand?: string;
	price_cents?: number;
	variants: Array<{ price_cents: number }>;
	available_sizes?: string[];
	colors?: string[];
	materials?: string[];
	stock?: number;
};

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const item = await getItemBySlug(slug);

	if (!item) {
		notFound();
	}

	const data = item.data as ProductData;
	const price = data.price_cents
		? data.price_cents / 100
		: data.variants[0].price_cents / 100;

	// Randomly select one of the three generic images
	const imageNumber = Math.floor(Math.random() * 3) + 1;
	const imageSrc = `/productPictures/${imageNumber}.jpg`;

	return (
		<div className={styles.container}>
			<Link href="/items" className={styles.backButton}>
				← Back to products
			</Link>

			<div className={styles.productWrapper}>
				<div className={styles.productImage}>
					<Image
						src={imageSrc}
						alt={data.title}
						width={600}
						height={800}
						className={styles.image}
						style={{
							width: "100%",
							height: "auto",
							objectFit: "cover",
						}}
						priority
					/>
				</div>

				<div className={styles.productDetails}>
					<div className={styles.header}>
						<h1 className={styles.title}>{data.title}</h1>
						{data.subtitle && (
							<p className={styles.subtitle}>{data.subtitle}</p>
						)}
					</div>

					<div className={styles.priceSection}>
						<span className={styles.price}>€{price.toFixed(2)}</span>
					</div>

					{data.available_sizes && data.available_sizes.length > 0 && (
						<div className={styles.sizeSelector}>
							<label htmlFor="size">Size:</label>
							<select id="size">
								{data.available_sizes.map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
						</div>
					)}

					{data.colors && data.colors.length > 0 && (
						<div className={styles.colorSelector}>
							<label>Color:</label>
							<div className={styles.colorSwatches}>
								{data.colors.map((color) => (
									<button
										key={color}
										className={styles.colorSwatch}
										title={color}
									>
										{color}
									</button>
								))}
							</div>
						</div>
					)}

					<button className={styles.buyButton}>Buy Now</button>

					{data.description && (
						<div className={styles.description}>
							<p>{data.description}</p>
						</div>
					)}

					{data.brand && (
						<div className={styles.detail}>
							<span className={styles.label}>Brand:</span>
							<span>{data.brand}</span>
						</div>
					)}

					{data.materials && data.materials.length > 0 && (
						<div className={styles.detail}>
							<span className={styles.label}>Materials:</span>
							<span>{data.materials.join(", ")}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
