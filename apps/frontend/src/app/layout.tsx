import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Sidebar } from '@/components/common';

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});
const redHatDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/Red_Hat_Display/RedHatDisplay-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Red_Hat_Display/RedHatDisplay-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-red-hat-display',
  display: 'swap',
});
const redHatMono = localFont({
  src: [
    {
      path: '../../public/fonts/Red_Hat_Mono/RedHatMono-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Red_Hat_Mono/RedHatMono-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-red-hat-mono',
  display: 'swap',
});
const montserrat = localFont({
  src: [
    {
      path: '../../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});
const montserratAlternates = localFont({
  src: [
    {
      path: '../../public/fonts/Montserrat_Alternates/MontserratAlternates-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat_Alternates/MontserratAlternates-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat_Alternates/MontserratAlternates-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat-alternates',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Upayan',
  description:
    'Passionate software developer with hands-on experience building scalable web applications and cloud-native platforms. Experienced in React, Next.js, Node.js, Python, Docker, and Kubernetes, I focus on creating clean, user-friendly solutions that deliver real impact—like Papers, serving 45k+ students, and Kargo, a Kubernetes deployment platform. I thrive in fast-paced, collaborative environments, enjoy solving complex problems, and am always exploring ways to optimize systems and improve user experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${redHatDisplay.variable} ${redHatMono.variable} ${montserrat.variable} ${montserratAlternates.variable} antialiased`}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
