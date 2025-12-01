"use client";

import { useState } from "react";

export default function TestAI() {
	const [message, setMessage] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const testConnection = async () => {
		setLoading(true);
		setResponse("");

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});

			const data = await res.json();

			if (data.success) {
				setResponse(data.message);
			} else {
				setResponse("Error: " + data.error);
			}
		} catch (error) {
			setResponse("Failed to connect to API: " + error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
			<h1>🧪 Test OpenAI Connection</h1>

			<div style={{ marginTop: "20px" }}>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type a test message... (e.g., 'Hello, can you help me find a dress?')"
					style={{
						width: "100%",
						minHeight: "100px",
						padding: "10px",
						fontSize: "16px",
						borderRadius: "8px",
						border: "1px solid #ccc",
					}}
				/>
			</div>

			<button
				onClick={testConnection}
				disabled={loading || !message}
				style={{
					marginTop: "10px",
					padding: "12px 24px",
					fontSize: "16px",
					backgroundColor: loading ? "#ccc" : "#0070f3",
					color: "white",
					border: "none",
					borderRadius: "8px",
					cursor: loading ? "not-allowed" : "pointer",
				}}
			>
				{loading ? "Testing..." : "Test Connection"}
			</button>

			{response && (
				<div
					style={{
						marginTop: "20px",
						padding: "20px",
						borderRadius: "8px",
						whiteSpace: "pre-wrap",
					}}
				>
					<p>{response}</p>
				</div>
			)}
		</div>
	);
}
