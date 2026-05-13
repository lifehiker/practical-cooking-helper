import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getStripe } from "@/lib/billing";
import { env } from "@/lib/env";

export async function POST() {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing portal is not configured." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Please upgrade first." },
      { status: 400 },
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${env.baseUrl}/account`,
  });

  return NextResponse.json({ url: session.url });
}
