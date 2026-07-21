"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError({});

    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error as Record<string, string[]>);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardTitle className="font-display text-2xl">
            Check your email
          </CardTitle>
          <p className="mt-4 text-graphite">
            If an account exists for that address, we sent a link to reset
            your password. It expires in 1 hour.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Reset your password
          </CardTitle>
          <p className="mt-2 text-sm text-graphite">
            Enter your account email and we&apos;ll send a link to choose a
            new password.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-graphite">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              error={error.email?.[0]}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-graphite">
          <Link href="/login" className="text-signal hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
