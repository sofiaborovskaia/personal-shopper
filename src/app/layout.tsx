import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import styles from "./layout.module.css";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";

const bentonSans = localFont({
	src: [
		{
			path: "../../public/fonts/BentonSansF-ExtraLight.woff2",
			weight: "200",
			style: "normal",
		},
		{
			path: "../../public/fonts/BentonSansF-Book.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/BentonSansF-BookItalic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../public/fonts/BentonSansF-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/BentonSansF-Bold.woff2",
			weight: "700",
			style: "bold",
		},
		{
			path: "../../public/fonts/BentonSansF-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
	],
	variable: "--font-benton-sans",
	display: "swap",
});

const frogSerif = localFont({
	src: [
		{
			path: "../../public/fonts/frogSerif-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/frogSerif-Italic.woff2",
			weight: "400",
			style: "italic",
		},
	],
	variable: "--font-frog-serif",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Personal shopper",
	description: "Your personal shopping assistant for clothing",
	icons: {
		icon: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${bentonSans.variable} ${frogSerif.variable}`}>
				<main className={styles.main}>{children}</main>
				<FloatingChatWidget />
				<footer className={styles.footer}>
					<Image src="/frog-logo.png" alt="Frog logo" width={60} height={60} />
					<span>© 2026 frog. All rights reserved.</span>
				</footer>
			</body>
		</html>
	);
}
