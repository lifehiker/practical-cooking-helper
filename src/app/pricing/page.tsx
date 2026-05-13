import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/session";
import { PricingClient } from "./pricing-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | FridgeMeal",
  description: "Free or Pro – get unlimited meal suggestions and recipe extractions with FridgeMeal Pro.",
};

const freeFeatures = [
  "3 leftover suggestion runs per day",
  "2 recipe URL extractions per day",
  "Save up to 5 items",
  "Basic search history",
  "No account required to start",
];

const proFeatures = [
  "Unlimited leftover suggestion runs",
  "Unlimited recipe extractions",
  "Unlimited saved recipes and meal ideas",
  "Full history access",
  "Priority extraction speed",
  "Early access to new features",
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPro = user && user.plan !== "FREE";

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, honest pricing</h1>
            <p className="text-lg text-gray-500">
              Free forever for casual use. Pro for heavy kitchen utility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free plan */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Free</h2>
              <div className="text-4xl font-extrabold text-gray-900 mb-1">$0</div>
              <p className="text-sm text-gray-500 mb-6">Always free. No credit card.</p>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {!user ? (
                <Link
                  href="/sign-in"
                  className="block w-full text-center bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Get started free
                </Link>
              ) : (
                <div className="text-center text-sm text-gray-400 py-3">
                  {isPro ? "Your previous plan" : "Your current plan"}
                </div>
              )}
            </div>

            {/* Pro plan */}
            <div className="bg-green-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                  Most popular
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" /> Pro
              </h2>
              <div className="mb-1">
                <span className="text-4xl font-extrabold">$2.42</span>
                <span className="text-green-200 ml-1">/month</span>
              </div>
              <div className="text-sm text-green-200 mb-1">$29/year · best value</div>
              <div className="text-sm text-green-300 mb-6">or $4.99/month billed monthly</div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-green-50">
                    <Check className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isPro ? (
                <Link
                  href="/account"
                  className="block w-full text-center bg-white text-green-800 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  Manage subscription →
                </Link>
              ) : (
                <PricingClient userId={user?.id} />
              )}
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-gray-400">
            <p>Secure checkout via Stripe. Cancel anytime. No hidden fees.</p>
            <p className="mt-1">Questions? <a href="mailto:hello@fridgemeal.app" className="text-green-700 hover:underline">hello@fridgemeal.app</a></p>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Billing questions</h2>
            <div className="space-y-3">
              {[
                { q: "Can I cancel anytime?", a: "Yes. Cancel from your account page at any time. You keep Pro access until the end of your billing period." },
                { q: "What payment methods do you accept?", a: "All major credit and debit cards via Stripe. No PayPal or crypto." },
                { q: "Is there a free trial?", a: "The free tier is effectively a permanent trial. You can use both tools for free within daily limits." },
                { q: "Do you offer refunds?", a: "Yes — contact us within 14 days of any charge and we'll refund it, no questions asked." },
              ].map((item) => (
                <details key={item.q} className="bg-white rounded-xl border border-gray-200">
                  <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 list-none flex justify-between">
                    {item.q}
                    <span className="text-gray-400">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
