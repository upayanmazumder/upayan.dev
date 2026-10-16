import { Red_Hat_Display, Red_Hat_Mono } from 'next/font/google';

export const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat-display',
  display: 'swap',
});

export const redHatMono = Red_Hat_Mono({
  subsets: ['latin'],
  variable: '--font-red-hat-mono',
  display: 'swap',
});

export const fontVariables = [redHatDisplay.variable, redHatMono.variable].join(' ');
