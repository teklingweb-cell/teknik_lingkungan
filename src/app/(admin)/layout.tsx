import type { Metadata, Viewport } from 'next';
import './admin.css';
import { inter } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Admin Panel',
  icons: { icon: '/icon-32.png', apple: '/apple-icon.png' },
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
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
