import { redirect } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, BarChart3, LogOut } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ManageBillingButton } from "./manage-billing-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/account");

  const isPro = user.plan !== "FREE";
  const savedCount = await db.savedItem.count({ where: { userId: user.id } });
  const suggestionCount = await db.usageEvent.count({
    where: { userId: user.id, action: "SUGGESTION" },
  });
  const extractCount = await db.usageEvent.count({
    where: { userId: user.id, action: "EXTRACTION" },
  });

  const recentSearches = await db.ingredientSearch.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentExtracts = await db.recipeExtract.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.name ?? "Your Account"}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${isPro ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                {isPro ? "✦ Pro" : "Free"}
              </span>
              {!isPro && (
                <Link href="/pricing" className="text-sm text-green-700 font-medium hover:underline">
                  Upgrade to Pro →
                </Link>
              )}
            </div>
          </div>

          {/* Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Billing
            </h2>
            {isPro ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">You&apos;re on the <strong>Pro plan</strong>. Enjoy unlimited access.</p>
                <ManageBillingButton />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">You&apos;re on the <strong>Free plan</strong>.</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 3 meal suggestions/day</li>
                  <li>• 2 recipe extractions/day</li>
                  <li>• Up to 5 saved items</li>
                </ul>
                <Link
                  href="/pricing"
                  className="inline-block bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Upgrade to Pro – $29/year
                </Link>
              </div>
            )}
          </div>

          {/* Usage stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Usage Stats
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Saved Items", value: savedCount, max: isPro ? undefined : 5 },
                { label: "Suggestion Runs", value: suggestionCount },
                { label: "Recipe Extracts", value: extractCount },
              ].map(({ label, value, max }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  {max !== undefined && (
                    <div className="text-xs text-gray-400">{`max ${max}`}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent history */}
          {(recentSearches.length > 0 || recentExtracts.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Ingredient Searches
                  </h3>
                  <ul className="space-y-1.5">
                    {recentSearches.map((s: { id: string; ingredientsJson: string; createdAt: Date }) => {
                      const ings = JSON.parse(s.ingredientsJson) as string[];
                      return (
                        <li key={s.id} className="text-sm text-gray-600 flex items-center justify-between">
                          <span>{ings.slice(0, 3).join(", ")}{ings.length > 3 ? ` +${ings.length - 3}` : ""}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {recentExtracts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Recipe Extracts
                  </h3>
                  <ul className="space-y-1.5">
                    {recentExtracts.map((r) => (
                      <li key={r.id} className="text-sm text-gray-600 flex items-center justify-between">
                        <span className="truncate max-w-[200px]">{r.title ?? r.url}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sign out */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
