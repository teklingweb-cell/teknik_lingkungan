'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '@/lib/nav';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever navigation happens.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Match the top-level item as well as any of its dropdown children, so
  // "Tentang Prodi" stays lit while you're on /sejarah.
  const isActive = (item: { href: string; children?: { href: string }[] }) => {
    if (pathname === item.href) return true;
    return item.children?.some((c) => c.href === pathname) ?? false;
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-untan.png"
              alt="Logo Universitas Tanjungpura"
              className="nav-logo-img"
            />
            <div className="nav-logo-text">
              <div className="nav-logo-name">Teknik Lingkungan</div>
              <div className="nav-logo-sub">Program Studi</div>
            </div>
          </Link>

          <ul className="nav-links">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.label} className={item.children ? 'has-dropdown' : undefined}>
                  <Link href={item.href} className={active ? 'active' : undefined}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="dropdown">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  {active && <span className="active-bar" />}
                </li>
              );
            })}
          </ul>

          <div className="nav-right">
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={(e) => {
          // Clicking the backdrop (not the drawer itself) dismisses the menu.
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div className="mobile-drawer">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label}>
                <div className="mobile-group-title">{item.label}</div>
                <div className="mobile-sub">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
}
