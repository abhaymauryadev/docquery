import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-signal">
            Document QA built for teams
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Ask your documents. Get sentence-level answers.
          </h1>
          <p className="mt-6 text-lg leading-8 text-graphite">
            Upload PDFs, DOCX, or text files and ask questions in plain language.
            DocQuery retrieves answers from your documents and shows exactly where each answer came from.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">Create account</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/app">Use product</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-graphite/10 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-graphite/10 bg-paper p-6">
              <h2 className="text-lg font-semibold text-ink">Upload documents</h2>
              <p className="mt-3 text-sm leading-6 text-graphite">
                Add files from your computer, then organize them into workspaces so every answer stays relevant and private.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-graphite/10 bg-paper p-6">
              <h2 className="text-lg font-semibold text-ink">Ask any question</h2>
              <p className="mt-3 text-sm leading-6 text-graphite">
                Query your documents naturally and get direct answers with exact citations down to the sentence.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-graphite/10 bg-paper p-6">
              <h2 className="text-lg font-semibold text-ink">Review results</h2>
              <p className="mt-3 text-sm leading-6 text-graphite">
                Click through citations, see confidence levels, and refine the answer until it matches your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
