type Props = {
  data: Record<string, unknown>[];
};

/**
 * Writes structured data into the page for search engines. The less-than
 * sign is escaped so text in the data can't close the script tag.
 *
 * Args:
 *   data: The schema.org records for this page.
 *
 * Returns:
 *   A script tag holding the records as one JSON-LD graph.
 */
export default function JsonLd({ data }: Props) {
  const graph = { "@context": "https://schema.org", "@graph": data };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
