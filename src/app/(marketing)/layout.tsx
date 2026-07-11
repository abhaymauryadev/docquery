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
      <header className="border-b border-graphite/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-display text-xl font-semibold text-ink">
            DocQuery
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-graphite md:flex">
            <Link href="/features" className="hover:text-ink">
              Features
            </Link>
            <Link href="/docs/getting-started" className="hover:text-ink">
              Docs
            </Link>
            <Link href="/pricing" className="hover:text-ink">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-graphite/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-graphite md:flex-row">
          <p>© {new Date().getFullYear()} DocQuery</p>
          <div className="flex gap-6">
            <Link href="/docs/faq" className="hover:text-ink">
              FAQ
            </Link>
            <a
              href="https://github.com"
              className="hover:text-ink"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
