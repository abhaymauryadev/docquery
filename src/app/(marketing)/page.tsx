import Link from "next/link";
import {
  FileText,
  Gauge,
  ListChecks,
  Lock,
  Ruler,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

const features = [
  {
    icon: ListChecks,
    title: "Sentence-level citations",
    description: "Jump to the exact line — every time.",
  },
  {
    icon: Gauge,
    title: "Calibrated confidence",
    description: "Know when to trust and when to check.",
  },
  {
    icon: TriangleAlert,
    title: "Honest “not found”",
    description: "No invented answers, ever.",
  },
  {
    icon: Ruler,
    title: "The Trace Rail",
    description: "Every source, one hover away.",
  },
  {
    icon: FileText,
    title: "Any document",
    description: "PDF, DOCX, CSV, XLSX, and more.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description: "Your files never train shared models.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="grid grid-cols-1 items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_400px] lg:gap-14 lg:px-12 lg:py-24">
        <div>
          <div className="mb-6.5 inline-flex h-7 items-center gap-2 rounded-full border border-border px-3 font-mono text-[11px] tracking-[0.06em] text-graphite">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-verified" />
            SENTENCE-LEVEL CITATIONS
          </div>
          <h1 className="mb-6 max-w-2xl font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[60px]">
            Ask your documents.
            <br />
            Get the exact sentence back.
          </h1>
          <p className="mb-9 max-w-130 text-lg leading-relaxed text-graphite sm:text-[19px]">
            DocQuery answers from your own files and shows you the precise
            sentence it came from — with a confidence score. When your
            documents don&apos;t support an answer, it says so instead of
            guessing.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button size="lg" asChild>
              <Link href="/signup">Start free</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/features">See how it works</Link>
            </Button>
          </div>
          <div className="mt-5 font-mono text-xs text-faint">
            No credit card · 500 pages free
          </div>
        </div>

        <div className="flex h-95 flex-col justify-between rounded-(--radius-card) border border-border bg-card p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-faint">
              acme-msa-2026.pdf
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/12 px-2.5 py-1 text-xs font-semibold text-verified">
              <span className="h-1.5 w-1.5 rounded-full bg-verified" />
              High confidence
            </span>
          </div>
          <div className="space-y-2.5 rounded-[10px] border border-hair bg-paper p-3.5">
            <div className="text-xs text-faint">
              What&apos;s the termination notice period?
            </div>
            <div className="text-sm leading-relaxed text-ink">
              Either party may terminate this agreement with
              <span className="font-semibold text-signal"> 60 days</span>{" "}
              written notice
              <sup className="font-mono text-[9px] text-signal">[1]</sup>.
            </div>
          </div>
          <div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-skel">
              <div className="h-full w-[94%] animate-grow rounded-full bg-verified" />
            </div>
            <div className="font-mono text-[11px] text-faint">
              0.94 · §12.3 · p.14
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-7 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-12 lg:pb-24">
        <div className="rounded-(--radius-card) border border-border bg-card p-7 shadow-sm">
          <div className="mb-3 font-mono text-[11px] tracking-[0.12em] text-signal">
            01 · PRECISION
          </div>
          <h3 className="mb-2 text-xl font-semibold text-ink">
            Precision citations
          </h3>
          <p className="mb-5.5 text-[15px] leading-relaxed text-graphite">
            Every claim links to the exact sentence in your source — not just
            the document.
          </p>
          <div className="flex gap-3 rounded-[10px] border border-hair bg-paper p-3.5">
            <div className="relative w-0.5 flex-none rounded-full bg-signal">
              <span className="absolute -left-0.5 top-2 h-1.5 w-1.5 animate-pulse-soft rounded-full bg-signal" />
              <span className="absolute -left-0.5 top-6.5 h-1.5 w-1.5 animate-pulse-soft rounded-full bg-signal [animation-delay:0.4s]" />
            </div>
            <div className="text-[13px] leading-relaxed text-ink">
              The revised policy takes effect Q3
              <sup className="font-mono text-[9px] text-signal">[1]</sup> and
              applies to all field teams
              <sup className="font-mono text-[9px] text-signal">[2]</sup>.
            </div>
          </div>
        </div>

        <div className="rounded-(--radius-card) border border-border bg-card p-7 shadow-sm">
          <div className="mb-3 font-mono text-[11px] tracking-[0.12em] text-signal">
            02 · CONFIDENCE
          </div>
          <h3 className="mb-2 text-xl font-semibold text-ink">
            Confidence scoring
          </h3>
          <p className="mb-5.5 text-[15px] leading-relaxed text-graphite">
            A calibrated score on every answer, so you know when to trust it
            and when to check.
          </p>
          <div className="rounded-[10px] border border-hair bg-paper p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-verified">
                <span className="h-1.5 w-1.5 rounded-full bg-verified" />
                High confidence
              </span>
              <span className="font-mono text-sm text-ink">0.94</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-skel">
              <div className="h-full w-[94%] animate-grow rounded-full bg-verified" />
            </div>
          </div>
        </div>

        <div className="rounded-(--radius-card) border border-border bg-card p-7 shadow-sm">
          <div className="mb-3 font-mono text-[11px] tracking-[0.12em] text-signal">
            03 · HONESTY
          </div>
          <h3 className="mb-2 text-xl font-semibold text-ink">
            Honest answers
          </h3>
          <p className="mb-5.5 text-[15px] leading-relaxed text-graphite">
            If the documents don&apos;t support a confident answer, DocQuery
            tells you — no invention.
          </p>
          <div className="rounded-[10px] border border-flag/28 bg-flag/8 p-3.5">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-flag">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-flag" />
              Not found in your documents
            </div>
            <div className="text-[13px] leading-relaxed text-graphite">
              Nothing in the indexed sources addresses 2025 headcount. Try
              rephrasing or add a source.
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-hair px-6 py-16 lg:px-12 lg:py-18">
        <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-signal">
          FEATURES
        </div>
        <h2 className="mb-10 max-w-155 font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
          Everything you need to read with precision
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="flex h-10.5 w-10.5 flex-none animate-float items-center justify-center rounded-[11px] bg-signal-tint text-signal">
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <div className="mb-1 text-base font-semibold text-ink">
                  {f.title}
                </div>
                <div className="text-sm leading-relaxed text-graphite">
                  {f.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-18 lg:px-12">
        <TestimonialCarousel />
      </section>

      <section className="border-t border-hair px-6 py-18 lg:px-12">
        <div className="mx-auto max-w-205">
          <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-signal">
            FAQ
          </div>
          <h2 className="mb-8 font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
            Questions, answered
          </h2>
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
