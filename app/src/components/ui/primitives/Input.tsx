"use client";

import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { className?: string };

const Input = forwardRef<HTMLInputElement, Props>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-md border border-border bg-input text-foreground px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
