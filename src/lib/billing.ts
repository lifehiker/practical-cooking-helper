import Stripe from "stripe";

import { env, hasStripe } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!hasStripe()) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey!);
  }

  return stripeClient;
}
