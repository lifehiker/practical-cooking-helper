import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/billing";
import { env } from "@/lib/env";
import { db } from "@/lib/db";

function planFromPriceId(priceId: string | null): string {
  if (!priceId) return "FREE";
  if (priceId === env.stripePriceYearly) return "PRO_YEARLY";
  if (priceId === env.stripePriceMonthly) return "PRO_MONTHLY";
  return "PRO_MONTHLY";
}

function getPeriodEnd(sub: Stripe.Subscription): Date | undefined {
  const item = sub.items?.data[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000);
  }
  return undefined;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      const user = await db.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = sub.items.data[0]?.price.id ?? null;
        const plan = planFromPriceId(priceId);
        const periodEnd = getPeriodEnd(sub);

        await db.user.update({ where: { id: user.id }, data: { plan } });

        await db.subscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status: sub.status,
            plan,
            currentPeriodEnd: periodEnd,
          },
          update: {
            status: sub.status,
            plan,
            currentPeriodEnd: periodEnd,
          },
        });

        const { sendBillingEmail } = await import("@/lib/email");
        await sendBillingEmail(
          user.email,
          `Thanks for upgrading to FridgeMeal Pro! Your ${plan === "PRO_YEARLY" ? "annual" : "monthly"} subscription is active.`,
        );
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const priceId = sub.items?.data[0]?.price?.id ?? null;
      const isActive = sub.status === "active" || sub.status === "trialing";
      const plan = isActive ? planFromPriceId(priceId) : "FREE";
      const periodEnd = getPeriodEnd(sub);

      const user = await db.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        await db.user.update({ where: { id: user.id }, data: { plan } });
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status,
            plan,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
          },
        });
      }
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
  }

  return NextResponse.json({ received: true });
}
