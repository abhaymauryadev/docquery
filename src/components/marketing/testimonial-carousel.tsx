"use client";

import { useState } from "react";

const testimonials = [
  {
    quote:
      "The citation opens to the exact sentence. I stopped second-guessing whether the answer was really in the file.",
    name: "Renata Klein",
    role: "Litigation partner",
    initials: "RK",
    avatarBg: "bg-signal-tint",
    avatarColor: "text-signal",
  },
  {
    quote:
      "The honest ‘not found’ is the feature. It tells me when the documents are silent instead of inventing something plausible.",
    name: "Theo Marsh",
    role: "Research lead",
    initials: "TM",
    avatarBg: "bg-verified/15",
    avatarColor: "text-verified",
  },
  {
    quote:
      "The confidence score changed how my team reviews. High answers move fast; flagged ones get a human read.",
    name: "Amara Wolff",
    role: "Compliance director",
    initials: "AW",
    avatarBg: "bg-steady/15",
    avatarColor: "text-steady",
  },
  {
    quote:
      "Onboarding a new matter used to mean days of reading. Now I ask and verify in an afternoon, source by source.",
    name: "Daniel Osei",
    role: "Knowledge manager",
    initials: "DO",
    avatarBg: "bg-signal-tint",
    avatarColor: "text-signal",
  },
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-signal">
            TESTIMONIALS
          </div>
          <h2 className="max-w-155 font-display text-4xl font-medium leading-tight tracking-tight text-ink">
            Trusted by careful readers
          </h2>
        </div>
        <div className="flex flex-none gap-2">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-card text-lg text-ink"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-card text-lg text-ink"
          >
            ›
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-400 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.name} className="w-full flex-none px-0.5">
              <div className="rounded-(--radius-card) border border-border bg-card p-10 px-11 shadow-sm">
                <p className="mb-6.5 max-w-205 font-display text-[26px] leading-snug text-ink">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${t.avatarBg} ${t.avatarColor}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-ink">
                      {t.name}
                    </div>
                    <div className="text-[13px] text-faint">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-signal" : "w-2 bg-border-strong"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
