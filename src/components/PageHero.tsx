import Link from 'next/link';
import { Fragment } from 'react';

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
}) {
  const crumbs: Crumb[] = breadcrumb ? [{ label: 'Beranda', href: '/' }, ...breadcrumb] : [];

  return (
    <div className="page-hero">
      <div className="page-hero-glow" />
      <div className="container" style={{ position: 'relative' }}>
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
