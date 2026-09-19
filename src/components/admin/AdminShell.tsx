'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type NavItem = { href: string; label: string; icon: React.ReactNode; match?: string[] };

const NAV: NavItem[] = [
  {
    href: '/admin',
    label: 'Berita',
    match: ['/admin', '/admin/add'],
      icon: <path d="M4 6h16M4 10h16M4 14h10" />,
  },
  {
    href: '/admin/dosen',
    label: 'Dosen',
    match: ['/admin/dosen', '/admin/dosen-form'],
    icon: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
  },
  {
    href: '/admin/posters', label: 'Poster Beranda', match: ['/admin/posters', '/admin/poster-form'],
    icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1.5" /><path d="m4 18 5-5 3 3 3-4 5 6" /></>,
  },
  {
    href: '/admin/staff',
    label: 'Staf',
    match: ['/admin/staff', '/admin/staff-form'],
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),
  },
  {
    href: '/admin/alumni',
    label: 'Alumni',
    match: ['/admin/alumni', '/admin/alumni-form'],
    icon: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  },
  {
    href: '/admin/struktur',
    label: 'Struktur Organisasi',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="8" y="16" width="8" height="5" rx="1" />
        <path d="M6.5 8v4h11V8" />
        <path d="M12 12v4" />
      </>
    ),
  },
  {
    href: '/admin/pencapaian',
    label: 'Pencapaian',
    match: ['/admin/pencapaian', '/admin/pencapaian-form'],
    icon: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
  },
  {
    href: '/admin/kalender-akademik',
    label: 'Kalender Akademik',
    match: ['/admin/kalender-akademik', '/admin/kalender-akademik-form'],
    icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  },
  {
    href: '/admin/kurikulum',
    label: 'Kurikulum',
    match: ['/admin/kurikulum', '/admin/kurikulum-form'],
    icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
  },
  {
    href: '/admin/mata-kuliah',
    label: 'Mata Kuliah',
    match: ['/admin/mata-kuliah', '/admin/mata-kuliah-form'],
    icon: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  },
  {
    href: '/admin/mitra-kategori',
    label: 'Kategori Mitra',
    match: ['/admin/mitra-kategori', '/admin/mitra-kategori-form'],
    icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v8M8 12h8" /></>,
  },
  {
    href: '/admin/mitra',
    label: 'Mitra',
    match: ['/admin/mitra', '/admin/mitra-form'],
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

function Icon({ children, size = 15 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

/**
 * Sidebar + topbar chrome shared by every admin screen.
 * `title` and `actions` fill the topbar; `children` is the page content.
 */
export default function AdminShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: NavItem) =>
    item.match ? item.match.includes(pathname) : pathname === item.href;

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    // refresh() lets the middleware see the cleared cookie and redirect.
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">U</div>
          <div>
            <div className="logo-text">Universitas</div>
            <div className="logo-sub">Admin Panel</div>
          </div>
        </div>

        <div className="nav-section">Konten</div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            className={`nav-item${isActive(item) ? ' active' : ''}`}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon>{item.icon}</Icon>
            {item.label}
          </Link>
        ))}

        <div className="sidebar-footer">
          {/* Plain <a>: a hard navigation keeps the public stylesheet from
              loading on top of the admin one. */}
          <a className="back-link" href="/">
            <Icon size={14}>
              <>
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </>
            </Icon>
            Lihat Situs
          </a>
          <button className="logout-btn" onClick={handleLogout}>
            <Icon size={14}>
              <>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </>
            </Icon>
            Keluar
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="mob-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
          >
            <Icon size={20}>
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            </Icon>
          </button>
          <div className="topbar-title">{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{actions}</div>
        </header>

        <div className="content">{children}</div>
      </div>
    </>
  );
}
