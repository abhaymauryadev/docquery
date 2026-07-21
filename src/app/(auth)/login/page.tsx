"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        result.error === "EMAIL_NOT_VERIFIED"
          ? "Please verify your email before signing in."
          : "Invalid email or password.",
      );
      return;
    }

    window.location.href = "/app";
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Sign in</CardTitle>
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
            <label htmlFor="email" className="mb-1 block text-sm text-graphite">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-graphite">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-signal hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && (
            <p className="text-sm text-flag" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-graphite">
          No account?{" "}
          <Link href="/signup" className="text-signal hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
