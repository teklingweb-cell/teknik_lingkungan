import './article.css';

/** Exists so page, loading and not-found all share the article stylesheet. */
export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
