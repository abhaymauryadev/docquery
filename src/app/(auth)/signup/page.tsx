"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { signupAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError({});

    const formData = new FormData(e.currentTarget);
    const result = await signupAction(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error as Record<string, string[]>);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardTitle className="font-display text-2xl">
            Check your email
          </CardTitle>
          <p className="mt-4 text-graphite">
            We sent a verification link. Click it to activate your account,
            then sign in.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/login">Go to sign in</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Create account</CardTitle>
        </CardHeader>
        <div className="mb-4 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => signIn("google", { callbackUrl: "/app" })}
          >
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => signIn("github", { callbackUrl: "/app" })}
          >
            GitHub
          </Button>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-graphite/15" />
          <span className="text-xs text-graphite">or</span>
          <div className="h-px flex-1 bg-graphite/15" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-graphite">
              Name
            </label>
            <Input
              id="name"
              name="name"
              required
              error={error.name?.[0]}
            />
          </div>
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
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-graphite"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              error={error.password?.[0]}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-graphite">
          Already have an account?{" "}
          <Link href="/login" className="text-signal hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
