import type { Metadata } from 'next';

/**
 * One place for everything search engines and social cards read.
 *
 * Before this, only `title` and `description` varied per page: the root layout
 * declared `openGraph`, and Next inherits a parent's openGraph block verbatim
 * into any child that does not declare its own — so every page on the site
 * shared one Open Graph title and description, and a link to /penelitian
 * previewed as if it were the home page. `pageMetadata()` builds the whole set
 * (title, description, canonical, Open Graph, Twitter) from the same inputs, so
 * a page cannot drift out of sync with its own preview card.
 */

export const SITE = {
  url: 'https://tekniklingkungan.com',
  /** Used for og:site_name and as the suffix in the title template. */
  name: 'Prodi Teknik Lingkungan Untan',
  locale: 'id_ID',

  /**
   * The home page title. Deliberately carries the four phrases people actually
   * search for — "teknik lingkungan", "teknik lingkungan untan", "teknik
   * lingkungan universitas tanjungpura" — in one natural line. Google indexes
   * the whole string even when it shortens what it displays.
   */
  defaultTitle:
    'Teknik Lingkungan Untan – Prodi Teknik Lingkungan Universitas Tanjungpura',
  titleTemplate: '%s – Prodi Teknik Lingkungan Untan',

  description:
    'Program Studi Teknik Lingkungan (Tekling) Universitas Tanjungpura Pontianak — ' +
    'terakreditasi Unggul. Informasi akademik, penelitian, laboratorium, dosen, ' +
    'pencapaian, dan berita prodi.',

  /** Shared social card, and the fallback for any page without its own image. */
  ogImage: '/og-image.png',
  ogImageAlt: 'Lambang Universitas Tanjungpura — Program Studi Teknik Lingkungan',

  /**
   * Paste the content value from Search Console's HTML-tag verification here
   * (the part after content="…") to verify the domain without touching DNS.
   * Left empty so no bogus tag is emitted.
   */
  googleSiteVerification: '',
} as const;

/** Turns a site-relative path into the absolute URL crawlers need. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export type PageMetaInput = {
  /** Page title without the brand suffix. Omit on the home page. */
  title?: string;
  description: string;
  /** Site-relative path, e.g. "/penelitian". Becomes the canonical URL. */
  path: string;
  /**
   * Social card image. Absolute or site-relative. Falls back to the site card,
   * so a berita or penelitian page without a cover still previews as the prodi
   * rather than as a bare link.
   */
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article';
  /** ISO date, article pages only. */
  publishedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  /** Set on thin or duplicate routes that should stay out of the index. */
  noindex?: boolean;
};

export function pageMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    path,
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    authors,
    section,
    tags,
    noindex,
  } = input;

  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || SITE.ogImage);
  // A page-specific card gets the page's own alt; the shared card keeps its own.
  const alt = imageAlt ?? (image ? title ?? description : SITE.ogImageAlt);
  const socialTitle = title ? `${title} — ${SITE.name}` : SITE.defaultTitle;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      title: socialTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
      ...(section ? { section } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}
