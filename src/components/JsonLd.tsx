/**
 * Emits a JSON-LD block.
 *
 * Server-rendered into the markup rather than injected on the client, so it is
 * present in the HTML Googlebot receives on the first pass. The payload is
 * built by src/lib/jsonld.ts from our own data — never from user input — and
 * `<` is escaped so a stray character in a berita title cannot close the
 * script tag early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
