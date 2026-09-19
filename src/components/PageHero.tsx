import Link from 'next/link';
import Image from 'next/image';
import { Fragment } from 'react';
import JsonLd from './JsonLd';
import { absoluteUrl } from '@/lib/seo';

export type Crumb = { label: string; href?: string };

/** The banner every inner page opens with. */
export default function PageHero({
  tag,
  title,
  subtitle,
  breadcrumb,
}: {
  tag: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Omit the leading "Beranda" crumb — it is always prepended. */
  breadcrumb?: Crumb[];
  bgImage?: string;
}) {
  const crumbs: Crumb[] = breadcrumb ? [{ label: 'Beranda', href: '/' }, ...breadcrumb] : [];

  /**
   * The same trail, as structured data. Emitted here rather than page by page
   * so a page cannot show a breadcrumb without declaring one — Google renders
   * this in place of the bare URL in a result. The final crumb has no `item`,
   * which is what the spec asks for on the page you are already on.
   */
  const breadcrumbLd =
    crumbs.length > 1
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: crumbs.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: absoluteUrl(c.href) } : {}),
          })),
        }
      : null;

  return (
    <div className={`page-hero ${bgImage ? 'has-bg-image' : ''}`}>
      {breadcrumbLd && <JsonLd data={breadcrumbLd} />}
      {bgImage && (
        <>
          <Image src={bgImage} alt="" fill priority style={{ objectFit: 'cover', objectPosition: 'center 30%', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 46, 30, 0.75)', zIndex: 0 }} />
        </>
      )}
      <div className="page-hero-glow" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="page-hero-tag">{tag}</div>
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
        {crumbs.length > 0 && (
          <div className="breadcrumb">
            {crumbs.map((c, i) => (
              <Fragment key={`${c.label}-${i}`}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
                {i < crumbs.length - 1 && <span>›</span>}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
