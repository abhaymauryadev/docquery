"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !email) return;

    setLoading(true);
    setError("");
    setFieldError({});

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirm = formData.get("confirmPassword");

    if (password !== confirm) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    const result = await resetPasswordAction(token, email, formData);
    setLoading(false);

    if (result?.error) {
      if (typeof result.error === "string") setError(result.error);
      else setFieldError(result.error as Record<string, string[]>);
      return;
    }

    setSuccess(true);
  }

  if (!token || !email) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardTitle className="font-display text-2xl text-flag">
            Invalid link
          </CardTitle>
          <p className="mt-4 text-graphite">
            This reset link is missing required information.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardTitle className="font-display text-2xl">
            Password updated
          </CardTitle>
          <p className="mt-4 text-graphite">
            Your password has been reset. Sign in with your new password.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/login">Sign in</Link>
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
            Choose a new password
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm text-graphite"
            >
              New password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              error={fieldError.password?.[0]}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm text-graphite"
            >
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-flag" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
