'use client';

import Link from 'next/link';
import * as Icons from 'react-icons/bs';
import { motion, type Variants } from 'framer-motion';
import { navLinks } from '@/data';

const navVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function NavMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.nav
      className="w-full"
      aria-label="Primary navigation"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={navVariants}
    >
      <ul className="list-none p-0 m-0 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center max-w-180 w-full">
        {navLinks.map((item) => {
          const Icon = Icons[item.icon as keyof typeof Icons] || Icons.BsCode;
          return (
            <motion.li
              key={item.href}
              className="w-full max-w-65 flex justify-center origin-center rounded-[6px] overflow-hidden"
              variants={navItemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-4 text-[1.2rem] text-[#eee] py-8 px-3 rounded-md bg-white/5 transition duration-300 w-full justify-center text-center no-underline hover:bg-white/10 hover:shadow-2xl text-2xl"
                onClick={onClose}
              >
                <Icon />
                <span className="font-montserrat-alternates">{item.label}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
