import { Resend } from "resend";

import { env, hasResend } from "@/lib/env";

let resendClient: Resend | null = null;

function getResend() {
  if (!hasResend()) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey!);
  }

  return resendClient;
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const resend = getResend();

  if (!resend) {
    console.info("Welcome email skipped because Resend credentials are not configured.", { email });
    return;
  }

  await resend.emails.send({
    from: env.resendFromEmail,
    to: email,
    subject: "Welcome to FridgeMeal",
    html: `<p>Hi ${name ?? "there"},</p><p>Your kitchen utility is ready. Use ingredients-to-meals or the recipe extractor anytime.</p>`,
  });
}

export async function sendBillingEmail(email: string, message: string) {
  const resend = getResend();

  if (!resend) {
    console.info("Billing email skipped because Resend credentials are not configured.", { email });
    return;
  }

  await resend.emails.send({
    from: env.resendFromEmail,
    to: email,
    subject: "Your FridgeMeal billing update",
    html: `<p>${message}</p>`,
  });
}
