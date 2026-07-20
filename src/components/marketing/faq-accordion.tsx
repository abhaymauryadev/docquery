"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How precise are the citations?",
    a: "Every claim links to the exact sentence in your source document — not just the file or the page — so you can verify a fact in a single click.",
  },
  {
    q: "What happens when the answer isn't in my documents?",
    a: "DocQuery tells you plainly instead of guessing. You get a calm “not found” notice with the confidence score and a suggestion to rephrase or add a source.",
  },
  {
    q: "Which file types can I upload?",
    a: "PDF, DOCX, TXT, CSV, and XLSX, up to 100 MB each. Files are indexed sentence by sentence as they process.",
  },
  {
    q: "Is my data private?",
    a: "Your documents stay in your workspace and are never used to train shared models. You can delete everything at any time from Settings.",
  },
  {
    q: "What is the Trace Rail?",
    a: "A thin ruler beside every answer with one tick per citation. Hover a tick to preview the exact source sentence without leaving the chat.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="border-t border-hair">
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.q} className="border-b border-hair">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-5 px-1 py-5 text-left"
            >
              <span className="text-[17px] font-semibold text-ink">
                {f.q}
              </span>
              <span className="w-5.5 flex-none text-center font-mono text-xl leading-none text-signal">
                {open ? "–" : "+"}
              </span>
            </button>
            {open ? (
              <div className="max-w-180 px-1 pb-5.5 text-[15px] leading-relaxed text-graphite">
                {f.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
