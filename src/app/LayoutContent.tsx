"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";
import styles from "./layout.module.css";

export default function LayoutContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	return (
		<>
			<main className={styles.main}>{children}</main>
			{!isHomePage && <FloatingChatWidget />}
			{!isHomePage && (
				<footer className={styles.footer}>
					<Image src="/frog-logo.png" alt="Frog logo" width={47} height={30} />
					<span>© 2026 frog. All rights reserved.</span>
				</footer>
			)}
		</>
	);
}
