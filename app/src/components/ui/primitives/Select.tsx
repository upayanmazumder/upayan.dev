"use client";

import { forwardRef, SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };
type Props = SelectHTMLAttributes<HTMLSelectElement> & { options?: Option[]; className?: string };

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className = "", options, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full rounded-md border border-border bg-input text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      {...props}
    >
      {options
        ? options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))
        : children}
    </select>
  )
);

Select.displayName = "Select";

export default Select;
