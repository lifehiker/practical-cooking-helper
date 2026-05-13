import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { getStripe } from "@/lib/billing";
import { env } from "@/lib/env";

const requestSchema = z.object({
  billingPeriod: z.enum(["monthly", "yearly"]).default("yearly"),
});

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payment processing is not configured. Please contact support." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
  }

  const { billingPeriod } = requestSchema.parse(await request.json());
  const priceId =
    billingPeriod === "yearly" ? env.stripePriceYearly : env.stripePriceMonthly;

  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price IDs are not configured." },
      { status: 503 },
    );
  }

  // Ensure customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
    const { db } = await import("@/lib/db");
    await db.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.baseUrl}/account?upgraded=1`,
    cancel_url: `${env.baseUrl}/pricing`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
