import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendVerificationEmail(
  email: string,
  verifyUrl: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`Verify email: ${verifyUrl}`);
    return;
  }

  const from = process.env.EMAIL_FROM ?? "DocQuery <onboarding@resend.dev>";

  const { error } = await getResend().emails.send({
    from,
    to: email,
    subject: "Verify your DocQuery account",
    html: `<p>Welcome to DocQuery. Confirm your email address to get started:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`Reset password: ${resetUrl}`);
    return;
  }

  const from = process.env.EMAIL_FROM ?? "DocQuery <onboarding@resend.dev>";

  const { error } = await getResend().emails.send({
    from,
    to: email,
    subject: "Reset your DocQuery password",
    html: `<p>Someone requested a password reset for this account. If this was you, choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
}
