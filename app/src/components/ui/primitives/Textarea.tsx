"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string };

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full min-h-[88px] rounded-md border border-border bg-input text-foreground px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export default Textarea;
