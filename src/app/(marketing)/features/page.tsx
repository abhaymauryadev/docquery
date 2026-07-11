const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "Features — DocQuery",
  description:
    "Sentence-level citations, confidence scoring, and honest not found answers. See how DocQuery differs from a summarizer.",
  alternates: { canonical: `${baseUrl}/features` },
};

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Features</h1>
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-ink">Trace Rail</h2>
          <p className="mt-2 text-graphite">
            Every answer includes a visual citation rail — hover ticks to preview
            source snippets, click to jump to the exact sentence in your
            document.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Confidence badges</h2>
          <p className="mt-2 text-graphite">
            High, Medium, or Not found — computed from retrieval similarity, not
            the model&apos;s self-assessment.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Command palette</h2>
          <p className="mt-2 text-graphite">
            Press Cmd+K to jump to any workspace, document, or start a new chat.
            Full keyboard navigation throughout.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Export & analytics</h2>
          <p className="mt-2 text-graphite">
            Export conversations as Markdown with citations intact. Track docs
            indexed, queries, response times, and confidence over time.
          </p>
        </section>
      </div>
    </div>
  );
}
