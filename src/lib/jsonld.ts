import { SITE, absoluteUrl } from './seo';

/**
 * Structured data builders.
 *
 * Search engines match a query like "tekling untan" to an entity, not to a
 * string. Declaring the prodi as a CollegeOrDepartment — with its nicknames as
 * alternateName and Untan as the parent organisation — is what lets Google
 * connect the abbreviation people actually type to this site, and is what
 * feeds the knowledge panel and the sitelinks under the result.
 */

type Json = Record<string, unknown>;

/** The prodi itself. Emitted once, from the site layout. */
export function organizationJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrDepartment',
    '@id': `${SITE.url}/#organization`,
    name: 'Program Studi Teknik Lingkungan Universitas Tanjungpura',
    // The abbreviations people search for. "Tekling" appears nowhere in the
    // page copy, so without this there is nothing for that query to match.
    alternateName: [
      'Teknik Lingkungan Untan',
      'Tekling Untan',
      'Tekling',
      'TL Untan',
      'Prodi Teknik Lingkungan Untan',
    ],
    url: SITE.url,
    logo: absoluteUrl('/logo-untan.png'),
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    email: 'tl.ft@untan.ac.id',
    // No `telephone`: the number in the footer, (0561) 123-4567, is the
    // template's placeholder. Publishing a made-up number as structured data
    // would be worse than publishing none — add it here once it is the real
    // one, in +62-561-XXXXXXX form.
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Universitas Tanjungpura',
      alternateName: ['Untan', 'UNTAN'],
      url: 'https://untan.ac.id',
    },
    address: {
      '@type': 'PostalAddress',
      // Untan's campus address. Add the building/room once confirmed.
      streetAddress: 'Jl. Prof. Dr. H. Hadari Nawawi',
      addressLocality: 'Pontianak',
      addressRegion: 'Kalimantan Barat',
      postalCode: '78124',
      addressCountry: 'ID',
    },
  };
}

/** The site as a whole, so Google can attach a name to the domain. */
export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: ['Teknik Lingkungan Untan', 'Tekling Untan'],
    inLanguage: 'id-ID',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

/**
 * Breadcrumbs. Google renders these in place of the raw URL in a result, which
 * is what turns "tekniklingkungan.com › berita › 12" into a readable line.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Beranda', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function articleJsonLd(input: {
  headline?: string | null;
  description?: string | null;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  author?: string | null;
  section?: string | null;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    // Guarded for the same reason as slugify: a row with no title must not
    // take the page down.
    headline: (input.headline || 'Tanpa judul').slice(0, 110),
    description: input.description ?? undefined,
    image: [absoluteUrl(input.image || SITE.ogImage)],
    datePublished: input.datePublished ?? undefined,
    dateModified: input.datePublished ?? undefined,
    articleSection: input.section ?? undefined,
    inLanguage: 'id-ID',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    author: input.author
      ? { '@type': 'Person', name: input.author }
      : { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function scholarlyArticleJsonLd(input: {
  headline?: string | null;
  description?: string | null;
  path: string;
  year?: number | string | null;
  /** Every credited researcher, lead first. */
  authors?: string[];
  keywords?: string[];
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: (input.headline || 'Tanpa judul').slice(0, 110),
    description: input.description ?? undefined,
    inLanguage: 'id-ID',
    datePublished: input.year ? String(input.year) : undefined,
    keywords: input.keywords?.length ? input.keywords.join(', ') : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    // A list, so co-authors are credited rather than folded into one name.
    author: input.authors?.length
      ? input.authors.map((name) => ({ '@type': 'Person', name }))
      : undefined,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}
