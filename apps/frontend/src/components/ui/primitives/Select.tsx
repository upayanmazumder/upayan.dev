'use client';

import { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { motion } from 'framer-motion';

type Option = { value: string; label: string };
type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Option[];
  className?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className = '', options, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isFocused ? 1.005 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        whileTap={{ scale: 0.995 }}
      >
        <select
          ref={ref}
          className={`w-full rounded-md border border-border bg-input text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {options
            ? options.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  className="bg-popover text-popover-foreground py-2 px-3 hover:bg-accent hover:text-accent-foreground"
                >
                  {o.label}
                </option>
              ))
            : children}
        </select>
      </motion.div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
