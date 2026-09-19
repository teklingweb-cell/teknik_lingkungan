export type NavChild = { href: string; label: string };
export type NavItem = { href: string; label: string; children?: NavChild[] };

/** Single source of truth for the navbar, the mobile drawer, and the footer. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Beranda' },
  {
    href: '/profile',
    label: 'Tentang Prodi',
    children: [
      { href: '/profile', label: 'Profil' },
      { href: '/sejarah', label: 'Sejarah' },
      { href: '/visi-misi', label: 'Visi & Misi' },
      { href: '/struktur', label: 'Struktur Organisasi' },
      { href: '/advisory-board', label: 'Advisory Board' },
      { href: '/fasilitas', label: 'Fasilitas' },
    ],
  },
  {
    href: '/akademik',
    label: 'Akademik',
    children: [
      { href: '/akademik#pencapaian', label: 'Pencapaian' },
      { href: '/akademik#kalender', label: 'Kalender Akademik' },
      { href: '/akademik#kurikulum', label: 'Kurikulum' },
      { href: '/akademik#mata-kuliah', label: 'Mata Kuliah' },
    ],
  },
  {
    href: '/staf',
    label: 'Komunitas',
    children: [
      { href: '/staf', label: 'Alumni' },
      { href: '/mitra', label: 'Mitra' },
    ],
  },
  { href: '/berita', label: 'Berita' },
  { href: '/kontak', label: 'Kontak' },
];
