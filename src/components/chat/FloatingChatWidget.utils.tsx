import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function renderMarkdown(text: string): React.ReactNode {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				a: ({ href, children }) => {
					if (href?.startsWith("/")) {
						return (
							<Link
								href={href}
								style={{
									color: "var(--magenta-2)",
									textDecoration: "underline",
									fontWeight: "500",
								}}
							>
								{children}
							</Link>
						);
					}
					return (
						<a href={href} target="_blank" rel="noopener noreferrer">
							{children}
						</a>
					);
				},
				// Style other markdown elements
				ul: ({ children }) => (
					<ul style={{ marginLeft: "1.5rem" }}>{children}</ul>
				),
				ol: ({ children }) => (
					<ol style={{ marginLeft: "1.5rem" }}>{children}</ol>
				),
				p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
			}}
		>
			{text}
		</ReactMarkdown>
	);
}
