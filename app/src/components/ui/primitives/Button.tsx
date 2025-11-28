"use client";

import { ButtonHTMLAttributes, FC } from "react";
import { motion } from "framer-motion";

type Variant = "default" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	className?: string;
};

const Button: FC<Props> = ({
	variant = "default",
	size = "md",
	className = "",
	children,
	...props
}) => {
	const base =
		"inline-flex items-center justify-center rounded-lg font-medium transition";
	const sizeCls =
		size === "sm"
			? "px-2 py-1 text-sm"
			: size === "lg"
			? "px-6 py-3 text-lg"
			: "px-4 py-2 text-sm";
	const variantCls =
		variant === "ghost"
			? "bg-transparent text-foreground hover:bg-white/5"
			: "bg-primary text-primary-foreground hover:opacity-95";

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			style={{ display: "inline-block" }}
		>
			<button
				className={`${base} ${sizeCls} ${variantCls} ${className}`}
				{...props}
			>
				{children}
			</button>
		</motion.div>
	);
};

export default Button;
