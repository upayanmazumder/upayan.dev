"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { motion } from "framer-motion";

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

const Input = forwardRef<HTMLInputElement, Props>(
	({ className = "", ...props }, ref) => {
		const [isFocused, setIsFocused] = useState(false);

		return (
			<motion.div
				initial={{ opacity: 0, y: -2 }}
				animate={{
					opacity: 1,
					y: 0,
					scale: isFocused ? 1.005 : 1,
				}}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<input
					ref={ref}
					className={`w-full rounded-md border border-border bg-input text-foreground px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
					onFocus={(e) => {
						setIsFocused(true);
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						setIsFocused(false);
						props.onBlur?.(e);
					}}
					{...props}
				/>
			</motion.div>
		);
	}
);

Input.displayName = "Input";

export default Input;
