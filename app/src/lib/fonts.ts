import {
  Bricolage_Grotesque,
  Montserrat,
  Montserrat_Alternates,
  Red_Hat_Display,
  Red_Hat_Mono,
} from 'next/font/google';

/** Hero name only: a tight, high-contrast grotesque that holds up at 90px+. */
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat-alternates',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

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

export const fontVariables = [
  bricolage.variable,
  montserratAlternates.variable,
  montserrat.variable,
  redHatDisplay.variable,
  redHatMono.variable,
].join(' ');
