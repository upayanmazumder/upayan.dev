'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  shouldShow: boolean;
  onOpen: () => void;
};

const Trigger = forwardRef<HTMLDivElement, Props>(
  ({ shouldShow, onOpen }, ref) => {
    return (
      <motion.div
        className="fixed top-1/2 right-0 transform -translate-y-1/2 h-12 z-50 cursor-pointer flex items-center justify-center transition-colors duration-300 p-0"
        animate={{ x: shouldShow ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={onOpen}
        ref={ref}
      >
        <Image
          src="/images/ui/sidebar.svg"
          alt="Sidebar"
          width={48}
          height={96}
          className="object-cover"
        />
      </motion.div>
    );
  },
);

Trigger.displayName = 'Trigger';

export default Trigger;
