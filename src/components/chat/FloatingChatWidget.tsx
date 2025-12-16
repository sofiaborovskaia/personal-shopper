"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./FloatingChatWidget.module.css";

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	productMap?: Record<string, string>;
};

// Function to convert product names to links
function convertProductNamesToLinks(
	text: string,
	productMap?: Record<string, string>,
): React.ReactNode {
	if (!productMap) return text;

	const parts: React.ReactNode[] = [];
	let lastIndex = 0;

	// Sort product names by length (longest first) to match longer names before shorter ones
	const sortedProducts = Object.keys(productMap).sort(
		(a, b) => b.length - a.length,
	);

	// Create a regex pattern that matches any product name (case-insensitive)
	const pattern = new RegExp(
		`(${sortedProducts
			.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
			.join("|")})`,
		"gi",
	);

	const matches = Array.from(text.matchAll(pattern));

	matches.forEach((match, index) => {
		const matchedText = match[0];
		const matchIndex = match.index!;

		// Add text before the match
		if (matchIndex > lastIndex) {
			parts.push(text.substring(lastIndex, matchIndex));
		}

		// Add the link
		const slug = productMap[matchedText.toLowerCase()];
		if (slug) {
			parts.push(
				<Link
					key={`link-${index}`}
					href={`/items/${slug}`}
					style={{
						color: "var(--foreground)",
						textDecoration: "underline",
						fontWeight: "500",
					}}
				>
					{matchedText}
				</Link>,
			);
		} else {
			parts.push(matchedText);
		}

		lastIndex = matchIndex + matchedText.length;
	});

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	return parts.length > 0 ? parts : text;
}

export default function FloatingChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || loading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: userMessage.content,
					history: messages.map((msg) => ({
						role: msg.role,
						content: msg.content,
					})),
				}),
			});

			const data = await res.json();

			if (data.success) {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: data.message,
					timestamp: new Date(),
					productMap: data.productMap,
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				const errorMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: "Sorry, I encountered an error. Please try again.",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch (error) {
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content:
					"Failed to connect. Please check your connection and try again.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* Chat Window */}
			<div
				className={`${styles.chatWindow} ${
					isOpen ? styles.chatWindowOpen : ""
				}`}
			>
				<div className={styles.chatHeader}>
					<div>
						<h3>Shopping Assistant</h3>
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className={styles.closeButton}
						aria-label="Close chat"
					>
						✕
					</button>
				</div>

				<div className={styles.messagesContainer}>
					{messages.length === 0 && (
						<div className={styles.emptyState}>
							<div className={styles.avatarLarge}>💬</div>
							<h4>Hi!</h4>
							<p>
								Ask me anything about our products and I&apos;ll help you find
								what you&apos;re looking for!
							</p>
						</div>
					)}

					{messages.map((message) => (
						<div
							key={message.id}
							className={`${styles.message} ${
								message.role === "user"
									? styles.userMessage
									: styles.assistantMessage
							}`}
						>
							{message.role === "assistant" && (
								<div className={styles.avatar}>🤖</div>
							)}
							<div className={styles.messageContent}>
								<div className={styles.messageText}>
									{message.role === "assistant"
										? convertProductNamesToLinks(
												message.content,
												message.productMap,
										  )
										: message.content}
								</div>
							</div>
						</div>
					))}

					{loading && (
						<div className={`${styles.message} ${styles.assistantMessage}`}>
							<div className={styles.avatar}>🤖</div>
							<div className={styles.messageContent}>
								<div className={styles.loadingDots}>
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSubmit} className={styles.inputForm}>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type your message..."
						className={styles.input}
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading || !input.trim()}
						className={styles.sendButton}
						aria-label="Send message"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</button>
				</form>
			</div>

			{/* Floating Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${styles.floatingButton} ${
					isOpen ? styles.floatingButtonHidden : ""
				}`}
				aria-label="Open chat"
			>
				{/* 💬 */}
				Ask me!
				{messages.length > 0 && (
					<span className={styles.badge}>{messages.length}</span>
				)}
			</button>
		</>
	);
}
