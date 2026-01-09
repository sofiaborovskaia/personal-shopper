import type { Metadata } from "next";
import "./globals.css";
import LayoutContent from "./LayoutContent";
import { bentonSans, frogSerif } from "./fonts";

export const metadata: Metadata = {
	title: "Personal shopper",
	description: "Your personal shopping assistant powered by AI",
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
