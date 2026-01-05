'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsList } from 'react-icons/bs';
import NavMenu from './NavMenu';
import SocialGrid from './SocialGrid';

export default function Panel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.aside
        className="fixed top-0 right-0 w-screen h-screen bg-[#0e0e0e] z-50 p-6 flex flex-col justify-between gap-6 overflow-y-auto"
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        exit={{ x: '100vw' }}
        transition={{ type: 'tween', ease: [0.42, 0, 0.58, 1], duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <BsList
            className="text-[2.5rem] text-white cursor-pointer"
            onClick={onClose}
          />

          <div className="flex items-center gap-4">
            <Image
              src="/upayan-transparent/upayan-transparent.avif"
              alt="Upayan Mazumder"
              width={48}
              height={48}
              className="rounded-full object-cover border border-white/10"
            />
            <span className="text-lg text-[antiquewhite] font-semibold tracking-tight">
              Upayan Mazumder
            </span>
          </div>
        </div>

        <NavMenu onClose={onClose} />

        <SocialGrid />
      </motion.aside>
    </>
  );
}
