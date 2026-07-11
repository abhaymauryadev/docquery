import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-6xl font-semibold text-graphite/30">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="mt-2 text-graphite">
        This page doesn&apos;t exist or may have been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
