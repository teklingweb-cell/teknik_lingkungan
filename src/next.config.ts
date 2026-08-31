import type { NextConfig } from 'next';

/**
 * Security headers ported from the old vercel.json.
 * Difference from the static site: the Supabase SDK is bundled now instead of
 * loaded from jsdelivr, so that CDN is gone from script-src / connect-src.
 * 'unsafe-inline' stays in script-src because Next inlines its hydration payload.
 */
const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' is development-only: webpack's HMR runtime evaluates
      // strings. Production bundles contain no eval, so it never ships.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      // Font kini di-host sendiri lewat next/font, jadi izin ke domain Google
      // Fonts dicabut — tidak ada lagi yang memuat dari sana.
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: https:",
      // ws: lets the dev-server hot-reload socket connect.
      `connect-src 'self' https://*.supabase.co${isDev ? ' ws://localhost:*' : ''}`,
      'frame-src https://maps.google.com https://www.google.com',
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async redirects() {
    // Old .html URLs kept alive so existing links and search results don't 404.
    const pages = [
      'index', 'berita', 'berita-detail', 'penelitian', 'penelitian-detail',
      'pencapaian', 'staf', 'struktur', 'mitra', 'fasilitas', 'profile',
      'sejarah', 'visi-misi', 'kontak',
    ];
    return pages.map((p) => ({
      source: `/${p}.html`,
      destination: p === 'index' ? '/' : `/${p}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
