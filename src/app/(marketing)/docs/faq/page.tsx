import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "FAQ — DocQuery",
  description:
    "Answers to common questions about file support, citation accuracy, and how confidence scoring works.",
  alternates: { canonical: `${baseUrl}/docs/faq` },
};

const faqs = [
  {
    question: "Does DocQuery work with scanned PDFs?",
    answer:
      "Not yet — DocQuery needs a text layer to index a document. Scanned/image-only PDFs are flagged as failed on upload rather than silently indexed empty.",
  },
  {
    question: "How is this different from a summarizer?",
    answer:
      "DocQuery traces every answer to the exact sentence it came from, and says so plainly when it can't find a confident answer in your documents.",
  },
  {
    question: "What file types are supported?",
    answer: "PDF, DOCX, and TXT at launch.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <nav className="mb-6 text-sm text-graphite">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <span>Docs</span>
          <span className="mx-2">/</span>
          <span className="text-ink">FAQ</span>
        </nav>
        <h1 className="font-display text-3xl font-semibold text-ink">FAQ</h1>
        <div className="mt-8 space-y-8">
          {faqs.map((faq) => (
            <section key={faq.question}>
              <h2 className="text-lg font-semibold text-ink">{faq.question}</h2>
              <p className="mt-2 text-graphite">{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
