import type { Metadata, Viewport } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';

const SITE_URL = 'https://tl.ft.untan.ac.id';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Program Studi Teknik Lingkungan – Menjaga Bumi, Membangun Masa Depan',
    template: '%s – Prodi Teknik Lingkungan Untan',
  },
  description:
    'Program Studi Teknik Lingkungan Universitas Tanjungpura – Menjaga Bumi, Membangun Masa Depan. Informasi akademik, penelitian, fasilitas, dan komunitas.',
  icons: {
    icon: '/logo-untan.png',
    apple: '/logo-untan.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Program Studi Teknik Lingkungan – Universitas Tanjungpura',
    description:
      'Menjaga Bumi, Membangun Masa Depan. Prodi Teknik Lingkungan Untan – unggul dalam riset dan pengabdian lingkungan hidup.',
    images: [`${SITE_URL}/banner.png`],
  },
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
        <Navbar />
        {children}
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
