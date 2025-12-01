"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";

type Props = HTMLAttributes<HTMLElement> & {
	className?: string;
	block?: boolean;
	language?: string;
};

const Code = forwardRef<HTMLElement, Props>(
	({ className = "", block = false, language, children, ...props }, ref) => {
		if (block) {
			const codeString =
				typeof children === "string" ? children : String(children);

			return (
				<motion.div
					initial={{ opacity: 0, y: -2 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className="overflow-hidden rounded-md border border-border"
				>
					<SyntaxHighlighter
						language={language || "javascript"}
						style={vscDarkPlus as any}
						customStyle={{
							margin: 0,
							padding: "1rem",
							background: "var(--color-muted)",
							fontSize: "0.875rem",
							borderRadius: 0,
						}}
						codeTagProps={{
							style: {
								fontFamily: "var(--font-mono), monospace",
								color: "var(--color-foreground)",
							},
						}}
						{...props}
					>
						{codeString}
					</SyntaxHighlighter>
				</motion.div>
			);
		}

		return (
			<motion.span
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.15, ease: "easeOut" }}
				style={{ display: "inline-block" }}
			>
				<code
					ref={ref as any}
					className={clsx(
						"inline-block rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground",
						className
					)}
					{...props}
				>
					{children}
				</code>
			</motion.span>
		);
	}
);

Code.displayName = "Code";

export default Code;
