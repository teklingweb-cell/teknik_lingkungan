import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import type { Penelitian } from '@/lib/types';
import { resolvePenelitian } from '@/lib/content';
import { contributorsOf } from '@/lib/utils';
import { FileTextIcon } from '@/components/icons';
import { pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { scholarlyArticleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolvePenelitian<Penelitian>(slug);

  // Answer a real 404 for an unknown segment rather than a 200 page that
  // merely says "not found" — the same reason as in berita/[slug].
  if (!found) notFound();

  const item = found.row;

  return pageMetadata({
    title: item.title,
    description:
      item.abstract?.trim() ||
      `Penelitian ${item.category} oleh ${item.author} (${item.year}) — Program Studi Teknik Lingkungan Universitas Tanjungpura.`,
    path: `/penelitian/${found.slug}`,
    // Penelitian rows carry no cover image, so these share the site card.
    type: 'article',
    authors: [item.author],
    section: item.category,
  });
}

/** 'Aktif' | 'Selesai' | 'Sedang berjalan' -> the CSS modifier class. */
function statusClassOf(status: string | null): string {
  const s = (status || '').toLowerCase();
  if (s === 'selesai') return 'selesai';
  if (s === 'sedang berjalan') return 'wip';
  return 'aktif';
}

/**
 * Keyword chips come from an optional comma-separated `keywords` column, with
 * the category always present as the first chip. When the column is absent —
 * which is the case in the documented schema — there is only the category, and
 * the block is hidden entirely.
 */
function deriveKeywords(item: Penelitian): string[] {
  const raw = item.keywords?.trim();
  if (!raw) return [item.category];

  const chips = raw.split(',').map((k) => k.trim()).filter(Boolean);
  if (!chips.some((c) => c.toLowerCase() === item.category.toLowerCase())) {
    chips.unshift(item.category);
  }
  return chips;
}

const metaIcon = (children: React.ReactNode) => (
  <span className="icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </span>
);

export default async function PenelitianDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await resolvePenelitian<Penelitian>(slug);
  if (!found) notFound();

  // Old /penelitian/3 links move to the slug permanently.
  if (found.shouldRedirect) permanentRedirect(`/penelitian/${found.slug}`);

  const item = found.row;

  const statusLabel = item.status || 'Aktif';
  const statusClass = statusClassOf(item.status);
  // `?? ''` for the same reason as slugify's guard: the schema says NOT NULL,
  // but a row that slipped through must not take the page down.
  const fullTitle = item.title ?? '';
  const shortTitle = fullTitle.length > 50 ? `${fullTitle.substring(0, 50)}…` : fullTitle;
  const keywords = deriveKeywords(item);
  const showKeywords = keywords.length > 1;

  // The lead is whoever is named first; everyone after is a contributor.
  const people = contributorsOf(item);
  const lead = people[0] ?? item.author ?? '–';
  const others = people.slice(1);

  const doiUrl = item.doi?.trim()
    ? `https://doi.org/${item.doi.trim().replace(/^https?:\/\/doi\.org\//i, '')}`
    : null;
  const publicationUrl = item.publication_url?.trim() || doiUrl;

  return (
    <>
      <JsonLd
        data={[
          scholarlyArticleJsonLd({
            headline: item.title,
            description: item.abstract,
            path: `/penelitian/${found.slug}`,
            year: item.year,
            authors: people,
            keywords,
          }),
          breadcrumbJsonLd([
            { name: 'Penelitian', path: '/penelitian' },
            { name: item.title, path: `/penelitian/${found.slug}` },
          ]),
        ]}
      />
      <div className="detail-hero">
        <div className="container" style={{ position: 'relative' }}>
          <Link href="/penelitian" className="detail-back">
            ← ke Daftar Penelitian
          </Link>
          <div className="detail-hero-inner">
            <div className="detail-tag-row">
              <span className="detail-tag">{item.category}</span>
              <span className={`detail-status ${statusClass}`}>{statusLabel}</span>
            </div>
            <h1 className="detail-title">{item.title}</h1>
            <div className="detail-meta-row">
              <div className="detail-meta-item">
                {metaIcon(
                  <>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                )}
                <span>
                  {lead}
                  {others.length > 0 && ` +${others.length} kontributor`}
                </span>
              </div>
              <div className="detail-meta-item">
                {metaIcon(
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </>
                )}
                <span>{item.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(26,46,30,0.06)' }}>
        <div className="container" style={{ padding: '12px 24px' }}>
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span>›</span>
            <Link href="/penelitian">Penelitian</Link>
            <span>›</span>
            <span>{shortTitle}</span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <div className="detail-abstract fade-up">
            <div className="detail-section-label">Abstrak</div>
            {item.abstract ? (
              <p className="detail-abstract-text">{item.abstract}</p>
            ) : (
              <p className="detail-abstract-text empty">
                Abstrak belum ditambahkan untuk penelitian ini. Administrator dapat menambahkannya
                melalui panel admin.
              </p>
            )}
          </div>

          <div className="fade-up">
            <div className="detail-pub-card">
              <div className="detail-pub-card-label">
                {/* Aligned inline so detail.css stays untouched. */}
                <FileTextIcon size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                Publikasi &amp; Karya
              </div>
              {publicationUrl ? (
                <>
                  <div className="detail-pub-card-title">
                    Akses full text atau data pendukung penelitian ini
                  </div>
                  <a
                    href={publicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-pub-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Buka Publikasi / DOI
                  </a>
                </>
              ) : (
                <>
                  <div className="detail-pub-card-title">Link publikasi</div>
                  <p className="detail-pub-unavailable">
                    Link publikasi belum tersedia untuk penelitian ini.
                  </p>
                </>
              )}
            </div>
          </div>

          {showKeywords && (
            <div className="detail-keywords fade-up">
              <div className="detail-section-label">Kata Kunci</div>
              <div className="keyword-chips">
                {keywords.map((k) => (
                  <span key={k} className="keyword-chip">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card fade-up">
            <div className="sidebar-card-title">Informasi Penelitian</div>
            <div className="sidebar-row stacked">
              <span className="sidebar-row-label">Peneliti Utama</span>
              <span className="person-chip lead">{lead}</span>
            </div>
            {others.length > 0 && (
              <div className="sidebar-row stacked">
                <span className="sidebar-row-label">
                  Kontributor <span className="person-count">{others.length}</span>
                </span>
                {/* One chip each: a plain string of names wrapped into an
                    unreadable block once there were more than two. */}
                <div className="person-chips">
                  {others.map((name) => (
                    <span key={name} className="person-chip">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="sidebar-row">
              <span className="sidebar-row-label">Tahun</span>
              <span className="sidebar-row-value">{item.year}</span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">Kategori</span>
              <span className="sidebar-row-value">{item.category}</span>
            </div>
            {item.journal?.trim() && (
              <div className="sidebar-row stacked">
                <span className="sidebar-row-label">Dipublikasikan di</span>
                <span className="sidebar-row-value">{item.journal}</span>
              </div>
            )}
            {item.doi?.trim() && (
              <div className="sidebar-row stacked">
                <span className="sidebar-row-label">DOI</span>
                <a
                  className="sidebar-row-value doi"
                  href={doiUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.doi}
                </a>
              </div>
            )}
            <div className="sidebar-row">
              <span className="sidebar-row-label">Status</span>
              <span className={`sidebar-row-value ${statusClass}`}>{statusLabel}</span>
            </div>
          </div>

          {publicationUrl && (
            <div
              className="sidebar-card fade-up"
              style={{ textAlign: 'center', background: 'var(--navy)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: 'rgba(78,140,90,0.2)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gold-light)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  color: 'rgba(242,245,239,0.8)',
                  marginBottom: 14,
                }}
              >
                Publikasi tersedia
              </div>
              <a
                href={publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-pub-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Buka Link →
              </a>
            </div>
          )}

          <div
            className="sidebar-card fade-up"
            style={{ background: 'rgba(78,140,90,0.06)', borderColor: 'rgba(78,140,90,0.15)' }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--forest)',
                lineHeight: 1.6,
              }}
            >
              <strong>Tertarik berkolaborasi?</strong>
              <br />
              Hubungi prodi melalui halaman{' '}
              <Link
                href="/kontak"
                style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}
              >
                Kontak
              </Link>{' '}
              untuk informasi lebih lanjut tentang peluang riset bersama.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
