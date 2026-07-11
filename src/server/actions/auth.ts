"use server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validators";
import { randomBytes } from "crypto";

export async function signupAction(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: { email: ["An account with this email already exists."] } };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.verificationToken.create({
    data: {
      identifier: parsed.data.email,
      token,
      expires,
    },
  });

  // In production, send verification email. For dev, log the link.
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Verify email: ${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}&email=${encodeURIComponent(parsed.data.email)}`,
    );
  }

  return { success: true };
}

export async function verifyEmailAction(token: string, email: string) {
  const record = await db.verificationToken.findFirst({
    where: { identifier: email, token },
  });

  if (!record || record.expires < new Date()) {
    return { error: "Invalid or expired verification link." };
  }

  await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: {
      identifier_token: { identifier: email, token },
    },
  });

  return { success: true };
}
