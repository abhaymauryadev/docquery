"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      return;
    }

    verifyEmailAction(token, email).then((result) => {
      setStatus(result.success ? "success" : "error");
    });
  }, [searchParams]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md text-center">
        {status === "loading" && (
          <p className="text-graphite">Verifying your email…</p>
        )}
        {status === "success" && (
          <>
            <CardTitle className="font-display text-2xl">
              Email verified
            </CardTitle>
            <p className="mt-4 text-graphite">
              Your account is ready. Sign in to get started.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <CardTitle className="font-display text-2xl text-flag">
              Verification failed
            </CardTitle>
            <p className="mt-4 text-graphite">
              This link is invalid or has expired.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/signup">Sign up again</Link>
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
