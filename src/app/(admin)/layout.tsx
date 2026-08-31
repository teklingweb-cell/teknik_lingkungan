import type { Metadata, Viewport } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin Panel',
  icons: { icon: '/logo-untan.png', apple: '/logo-untan.png' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * Second root layout. The admin panel has its own design system that collides
 * with the public one on bare selectors (body, table, input, h1), so it gets a
 * separate <html>/<body> tree — Next then never ships both stylesheets together.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
