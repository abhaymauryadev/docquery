const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "Pricing — DocQuery",
  description: "Simple, transparent pricing for individuals and teams.",
  alternates: { canonical: `${baseUrl}/pricing` },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Pricing</h1>
      <p className="mt-4 text-graphite">
        DocQuery is free during early access. Upload, ask, and cite — no credit
        card required.
      </p>
      <div className="mt-12 rounded-[var(--radius-card)] border border-graphite/10 bg-white p-8 dark:bg-surface-1">
        <p className="font-mono text-4xl font-semibold text-ink">$0</p>
        <p className="mt-2 text-graphite">per month, early access</p>
        <ul className="mt-6 space-y-2 text-left text-sm text-graphite">
          <li>Unlimited workspaces</li>
          <li>PDF, DOCX, and TXT support</li>
          <li>Sentence-level citations</li>
          <li>Markdown export</li>
        </ul>
      </div>
    </div>
  );
}
