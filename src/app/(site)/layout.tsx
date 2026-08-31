import type { Metadata, Viewport } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/seo';
import { organizationJsonLd, websiteJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.defaultTitle,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  applicationName: SITE.name,
  // The abbreviations and full names people type. Not a ranking factor on its
  // own, but it keeps the intended vocabulary in one reviewable place.
  keywords: [
    'teknik lingkungan',
    'tekling',
    'tekling untan',
    'teknik lingkungan untan',
    'teknik lingkungan universitas tanjungpura',
    'prodi teknik lingkungan pontianak',
    'jurusan teknik lingkungan kalimantan barat',
    'fakultas teknik untan',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: SITE.url },
  icons: {
    icon: '/logo-untan.png',
    apple: '/logo-untan.png',
  },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    locale: SITE.locale,
    title: SITE.defaultTitle,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.defaultTitle,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google use full-size thumbnails and untruncated snippets, which
      // is what makes a berita result show its cover image.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(SITE.googleSiteVerification
    ? { verification: { google: SITE.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Kept as a plain <link> rather than next/font: next/font renames the
            family, and style.css refers to 'Merriweather' / 'Inter' by name. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Inter:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        />
        {/* .fade-up starts at opacity:0 and is revealed by ScrollReveal. Now
            that content is server-rendered, a visitor without JS would receive
            the markup but never see it — so reveal everything up front. */}
        <noscript>
          <style>{'.fade-up { opacity: 1 !important; transform: none !important; }'}</style>
        </noscript>
      </head>
      <body>
        {/* Identifies the prodi as an entity, with its abbreviations, so a
            search for "tekling untan" can resolve to this site. */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Navbar />
        {children}
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
