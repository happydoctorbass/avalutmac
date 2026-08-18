import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_SC } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const notoSansSC = Noto_Sans_SC({ 
  weight: ['400', '500', '700', '900'], 
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admiral Casino — Live Auction',
  description: 'Панель питбосса и экран гостя',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
