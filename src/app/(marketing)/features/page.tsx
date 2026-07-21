import { Ruler, Gauge, Command as CommandIcon, BarChart3 } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "Features — DocQuery",
  description:
    "Sentence-level citations, confidence scoring, and honest not found answers. See how DocQuery differs from a summarizer.",
  alternates: { canonical: `${baseUrl}/features` },
};

const sections = [
  {
    num: "01",
    tag: "TRACE RAIL",
    icon: Ruler,
    title: "The Trace Rail",
    description:
      "Every answer includes a visual citation rail — hover ticks to preview source snippets, click to jump to the exact sentence in your document.",
    demo: (
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
    ),
  },
  {
    num: "02",
    tag: "CONFIDENCE",
    icon: Gauge,
    title: "Confidence badges",
    description:
      "High, Medium, or Not found — computed from retrieval similarity, not the model's self-assessment.",
    demo: (
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
    ),
  },
  {
    num: "03",
    tag: "COMMAND PALETTE",
    icon: CommandIcon,
    title: "Command palette",
    description:
      "Press Cmd+K to jump to any workspace, document, or start a new chat. Full keyboard navigation throughout.",
    demo: (
      <div className="rounded-[10px] border border-hair bg-paper p-3.5">
        <div className="flex items-center gap-2 rounded-[8px] border border-border bg-card px-3 py-2">
          <span className="font-mono text-xs text-faint">
            Jump to workspace, document, or new chat…
          </span>
          <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-graphite">
            ⌘K
          </kbd>
        </div>
      </div>
    ),
  },
  {
    num: "04",
    tag: "EXPORT & ANALYTICS",
    icon: BarChart3,
    title: "Export & analytics",
    description:
      "Export conversations as Markdown with citations intact. Track docs indexed, queries, response times, and confidence over time.",
    demo: (
      <div className="flex items-end gap-1.5 rounded-[10px] border border-hair bg-paper p-3.5">
        {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
          <div
            key={i}
            className="w-full rounded-t-sm bg-signal/70"
            style={{ height: `${h * 0.4}px` }}
          />
        ))}
      </div>
    ),
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="px-6 py-16 lg:px-12 lg:py-20">
        <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-signal">
          HOW IT WORKS
        </div>
        <h1 className="mb-5 max-w-155 font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
          Built to answer with evidence, not confidence alone
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-graphite">
          DocQuery differs from a summarizer at every step — from how it cites
          sources to how it tells you when it doesn&apos;t know.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 border-t border-hair px-6 py-16 sm:grid-cols-2 lg:px-12 lg:py-20">
        {sections.map((s) => (
          <div
            key={s.num}
            className="rounded-(--radius-card) border border-border bg-card p-7 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-signal">
              <s.icon className="h-3.5 w-3.5" />
              {s.num} · {s.tag}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-ink">{s.title}</h2>
            <p className="mb-5.5 text-[15px] leading-relaxed text-graphite">
              {s.description}
            </p>
            {s.demo}
          </div>
        ))}
      </section>
    </div>
  );
}
