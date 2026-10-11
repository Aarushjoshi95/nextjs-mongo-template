// Server component: renders a JSON-LD <script> block. Pass the output of jsonLd().
export default function JsonLd({ data }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
}
