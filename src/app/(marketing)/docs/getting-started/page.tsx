import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "Getting Started — DocQuery Docs",
  description:
    "Set up a workspace, upload your first document, and ask your first question in under two minutes.",
  alternates: { canonical: `${baseUrl}/docs/getting-started` },
};

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <nav className="mb-6 text-sm text-graphite">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span>Docs</span>
        <span className="mx-2">/</span>
        <span className="text-ink">Getting Started</span>
      </nav>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Getting Started
      </h1>
      <ol className="mt-8 list-decimal space-y-6 pl-6 text-graphite">
        <li>
          <strong className="text-ink">Create an account</strong> — sign up with
          email or continue with Google/GitHub.
        </li>
        <li>
          <strong className="text-ink">Create a workspace</strong> — a folder
          for related documents like a project or case file.
        </li>
        <li>
          <strong className="text-ink">Upload documents</strong> — PDF, DOCX, or
          TXT. Wait for the status to show Ready.
        </li>
        <li>
          <strong className="text-ink">Ask a question</strong> — get a streamed
          answer with citations you can click through to the source sentence.
        </li>
      </ol>
      <p className="mt-8">
        <Link href="/signup" className="text-signal hover:underline">
          Get started now →
        </Link>
      </p>
    </div>
  );
}
