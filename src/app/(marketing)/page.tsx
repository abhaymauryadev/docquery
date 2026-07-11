import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileSearch, Target, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Ask your documents.
          <br />
          Get sentence-level answers.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite">
          DocQuery answers only from your documents and shows you exactly where —
          down to the sentence. No hallucinated guesses.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Upload your first document</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/docs/getting-started">See how it works</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-graphite/10 bg-white py-24 dark:bg-surface-1">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-signal/10">
              <Target className="h-6 w-6 text-signal" />
            </div>
            <h2 className="text-lg font-semibold text-ink">
              Sentence-level citations
            </h2>
            <p className="mt-2 text-sm text-graphite">
              Click any citation to jump to the exact highlighted sentence — not
              just the page.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-verified/10">
              <Shield className="h-6 w-6 text-verified" />
            </div>
            <h2 className="text-lg font-semibold text-ink">
              Honest confidence scoring
            </h2>
            <p className="mt-2 text-sm text-graphite">
              Every answer shows High, Medium, or Not found — derived from
              retrieval, not model self-report.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-steady/10">
              <FileSearch className="h-6 w-6 text-steady" />
            </div>
            <h2 className="text-lg font-semibold text-ink">
              Workspace-scoped search
            </h2>
            <p className="mt-2 text-sm text-graphite">
              Organize documents into workspaces. Answers never leak across
              folders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
