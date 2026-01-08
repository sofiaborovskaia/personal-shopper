"use client";

import { useState, useRef, useEffect } from "react";
import { renderMarkdown } from "./FloatingChatWidget.utils";
import styles from "./FloatingChatWidget.module.css";

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
};

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
						<h3>AI Shopping Assistant</h3>
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
							<p>
								Ask me anything about our products and I&apos;ll help you find
								what you&apos;re looking for.
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
										? renderMarkdown(message.content)
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
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 24 24"
					fill="white"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
				</svg>
				<span className={styles.buttonText}>Ask me!</span>
			</button>
		</>
	);
}
