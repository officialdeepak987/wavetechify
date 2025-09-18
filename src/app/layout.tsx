
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Roboto, Roboto_Slab } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/app-layout';


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-roboto-slab',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wavetechify.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Affordable Website Development & IT Services in India, Dubai, UAE | Wavetechify.in',
  description: 'Get affordable web development & IT services in Dubai, India, and Singapore. Trusted by 100+ clients. Contact us today for custom software, web design, and digital solutions.',
  keywords: ['affordable website development', 'IT services India', 'web development company UAE', 'website design Dubai', 'custom software solutions Singapore', 'professional IT services', 'digital solutions for business', 'best IT company India', 'IT support Middle East', 'web solutions for startups', 'website services with low cost', 'IT outsourcing India', 'business website development UAE', 'international IT services provider'],
  authors: [{ name: 'Wavetechify.in' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Affordable Website Development & IT Services in India, Dubai, UAE | Wavetechify.in',
    description: 'Reliable IT services, affordable website design & custom software solutions for businesses in India, UAE, Saudi Arabia, Qatar & worldwide.',
    images: [{ url: `${siteUrl}/og-image.jpg` }],
    siteName: 'Wavetechify.in',
  },
  twitter: {
    card: 'summary_large_image',
    url: siteUrl,
    title: 'Affordable Website Development & IT Services in India, Dubai, UAE | Wavetechify.in',
    description: 'Reliable IT services, affordable website design & custom software solutions for businesses in India, UAE, Saudi Arabia, Qatar & worldwide.',
    images: [{ url: `${siteUrl}/og-image.jpg` }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Wavetechify.in",
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={cn("font-body antialiased", roboto.variable, robotoSlab.variable)}>
          <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
