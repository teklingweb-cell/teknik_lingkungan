import './article.css';

/**
 * Exists so page and not-found share the article stylesheet.
 *
 * A loading.tsx skeleton used to sit beside it and has been removed on
 * purpose: loading.tsx wraps the segment in a Suspense boundary, so the
 * response starts streaming with a 200 before the page can look the id up, and
 * notFound() then renders the "tidak ditemukan" view without being able to
 * change the status. Every unknown or deleted berita URL answered 200, which
 * Google treats as a soft 404 and keeps in the index. Measured on a production
 * build: with loading.tsx /berita/<unknown> returns 200, without it 404.
 * The skeleton only ever showed during on-demand ISR of a single article.
 */
export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
