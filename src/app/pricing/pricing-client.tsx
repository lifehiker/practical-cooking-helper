"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  userId?: string;
}

export function PricingClient({ userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "monthly">("yearly");

  async function handleCheckout() {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Could not start checkout. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (!userId) {
    return (
      <Link
        href="/sign-in?callbackUrl=/pricing"
        className="block w-full text-center bg-white text-green-800 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors"
      >
        Sign in to upgrade
      </Link>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["yearly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setBillingPeriod(p)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
              billingPeriod === p
                ? "bg-white text-green-800 border-white"
                : "bg-green-800 text-green-200 border-green-600 hover:bg-green-700"
            }`}
          >
            {p === "yearly" ? "Annual (save 40%)" : "Monthly"}
          </button>
        ))}
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="block w-full text-center bg-white text-green-800 font-semibold py-3 rounded-xl hover:bg-green-50 transition-colors disabled:opacity-70"
      >
        {loading ? "Redirecting…" : `Upgrade to Pro – ${billingPeriod === "yearly" ? "$29/year" : "$4.99/mo"}`}
      </button>
    </div>
  );
}
