import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutContent from "./LayoutContent";

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
				<LayoutContent>{children}</LayoutContent>
			</body>
		</html>
	);
}
