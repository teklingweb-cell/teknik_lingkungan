'use client';

import { usePathname } from 'next/navigation';
import FooterFull from './FooterFull';
import FooterSlim from './FooterSlim';

/** Home gets the full four-column footer; every other page gets the slim bar. */
export default function SiteFooter() {
  const pathname = usePathname();
  return pathname === '/' ? <FooterFull /> : <FooterSlim />;
}
