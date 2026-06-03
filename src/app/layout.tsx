import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { SITE, SITE_KEYWORDS } from '@/lib/constants';
import { AnimatedBackground } from '@/components/shared/animated-background';
import { JsonLd, organizationSchema } from '@/components/seo/json-ld';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE_KEYWORDS,
  openGraph: { title: SITE.name, description: SITE.description, type: 'website', siteName: SITE.name },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <JsonLd data={organizationSchema()} />
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
