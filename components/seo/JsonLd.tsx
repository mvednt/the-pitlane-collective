import type { JsonLdObject } from "@/lib/seo/jsonld";

/**
 * Renders one or more JSON-LD blocks. `<` is escaped to `<` so the payload
 * can never break out of the <script> element or inject markup.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
