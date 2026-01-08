import { getItemBySlug } from "@/lib/items";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const item = await getItemBySlug(slug);

	if (!item) {
		notFound();
	}

	const price = item.priceCents / 100;
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
						alt={item.title}
						width={300}
						height={400}
						className={styles.image}
						style={{
							objectFit: "cover",
						}}
						priority
					/>
				</div>

				<div className={styles.productDetails}>
					<div className={styles.header}>
						<h1 className={styles.title}>{item.title}</h1>
						{item.subtitle && (
							<p className={styles.subtitle}>{item.subtitle}</p>
						)}
					</div>

					<div className={styles.priceSection}>
						<span className={styles.price}>€{price.toFixed(2)}</span>
					</div>

					<div className={styles.sizeSelector}>
						<label htmlFor="size">Size:</label>
						<select id="size">
							{item.sizes.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>

					<div className={styles.colorSelector}>
						<label>Color:</label>
						<div className={styles.colorSwatches}>
							{item.colors.map((color) => (
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

					<button className="solidButton">Add to Cart</button>

					{item.description && (
						<div className={styles.description}>
							<p>{item.description}</p>
						</div>
					)}

					{item.brand && (
						<div className={styles.detail}>
							<span className={styles.label}>Brand:</span>
							<span>{item.brand}</span>
						</div>
					)}

					{item.materials && item.materials.length > 0 && (
						<div className={styles.detail}>
							<span className={styles.label}>Materials:</span>
							<span>{item.materials.join(", ")}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
