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
