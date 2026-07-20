import Link from "next/link";
import { Button } from "@/components/ui/button";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata = {
  title: "DocQuery — Ask your documents, get sentence-level answers",
  description:
    "Upload PDFs, DOCX, or text files and get answers with exact citations — down to the sentence. No hallucinated guesses.",
  alternates: { canonical: baseUrl },
  openGraph: {
    title: "DocQuery — Ask your documents, get sentence-level answers",
    description:
      "Upload PDFs, DOCX, or text files and get answers with exact citations.",
    url: baseUrl,
    siteName: "DocQuery",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DocQuery — sentence-level document answers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocQuery — Ask your documents, get sentence-level answers",
    description:
      "Upload PDFs, DOCX, or text files and get answers with exact citations.",
    images: ["/opengraph-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DocQuery",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const productLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "#" },
  { label: "Security", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

const resourceLinks = [
  { label: "Documentation", href: "/docs/getting-started" },
  { label: "API reference", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

function LogoMark({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dash = tone === "light" ? "var(--color-paper)" : "var(--color-card)";
  return (
    <div className="relative h-5 w-5 flex-none rounded-[5px] bg-signal">
      <div
        className="absolute left-[6px] top-1 h-3 w-0.5"
        style={{ background: dash }}
      />
    </div>
  );
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-hair">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-[17px] font-bold tracking-tight text-ink">
              DocQuery
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-graphite md:flex">
            <Link href="/features" className="hover:text-ink">
              Product
            </Link>
            <Link href="/pricing" className="hover:text-ink">
              Pricing
            </Link>
            <Link href="/docs/getting-started" className="hover:text-ink">
              Docs
            </Link>
            <Link href="/login" className="font-semibold text-ink">
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Start free</Link>
            </Button>
          </nav>
          <Button variant="ghost" size="sm" className="md:hidden" asChild>
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-hair bg-card">
        <div className="mx-auto max-w-6xl px-6 pb-7 pt-14">
          <div className="mb-11 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
            <div>
              <Link href="/" className="mb-3.5 flex items-center gap-2.5">
                <LogoMark tone="dark" />
                <span className="text-[17px] font-bold text-ink">
                  DocQuery
                </span>
              </Link>
              <p className="mb-4.5 max-w-70 text-sm leading-relaxed text-graphite">
                A precision research tool for querying your own documents —
                with the exact sentence, every time.
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#"
                  aria-label="X"
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-default)] border border-border text-graphite hover:text-ink"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-default)] border border-border text-graphite hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-default)] border border-border text-graphite hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
              </div>
            </div>
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </div>
          <div className="flex flex-col items-start gap-3 border-t border-hair pt-[22px] text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono">
              DocQuery © {new Date().getFullYear()} · All rights reserved
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="h-[7px] w-[7px] rounded-full bg-verified" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-4 font-mono text-[11px] tracking-[0.12em] text-faint">
        {title.toUpperCase()}
      </div>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-graphite hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
