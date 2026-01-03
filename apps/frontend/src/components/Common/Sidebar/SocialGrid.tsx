'use client';

import React from 'react';
import Link from 'next/link';
import {
  BsGithub,
  BsLinkedin,
  BsInstagram,
  BsFacebook,
  BsDiscord,
  BsKanban,
  BsCode,
  BsMortarboard,
  BsAward,
} from 'react-icons/bs';
import { SiLeetcode, SiKaggle, SiGravatar } from 'react-icons/si';
import { socialLinks } from '@/data';

const socialIcons: Record<string, React.ElementType> = {
  Github: BsGithub,
  LinkedIn: BsLinkedin,
  Instagram: BsInstagram,
  Facebook: BsFacebook,
  Discord: BsDiscord,
  Leetcode: SiLeetcode,
  Kaggle: SiKaggle,
  Gravatar: SiGravatar,
  'IIT-Madras': BsMortarboard,
  'Microsoft Learn': BsCode,
  Devfolio: BsKanban,
};

export default function SocialGrid() {
  return (
    <div className="grid grid-cols-5 gap-3 pb-[env(safe-area-inset-bottom)]">
      {socialLinks
        .filter((item) =>
          ['LinkedIn', 'Github', 'Discord', 'Instagram', 'Facebook'].includes(
            item.name,
          ),
        )
        .map((item, index) => {
          const Icon = socialIcons[item.name] || BsAward;
          return (
            <Link
              key={item.name ?? index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-full bg-white/6 text-[#eee] text-sm whitespace-nowrap transition-transform duration-200 hover:bg-white/12 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            >
              <Icon className="text-[1.2rem]" />
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          );
        })}
    </div>
  );
}
