import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "My Library | FridgeMeal",
  description: "Your saved recipes and meal ideas.",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?callbackUrl=/library");
  }

  const params = await searchParams;
  const filter = params.filter ?? "all";
  const q = params.q ?? "";

  const typeFilter =
    filter === "recipes"
      ? { type: "EXTRACTED_RECIPE" }
      : filter === "ideas"
        ? { type: "MEAL_IDEA" }
        : {};

  const where = {
    userId: user.id,
    ...typeFilter,
    ...(q ? { title: { contains: q } } : {}),
  };

  const items = await db.savedItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalCount = await db.savedItem.count({ where: { userId: user.id } });
  const isPro = user.plan !== "FREE";

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-green-700" /> My Library
              </h1>
              <p className="text-gray-500">
                {totalCount} saved item{totalCount !== 1 ? "s" : ""}
                {!isPro && ` · ${Math.max(0, 5 - totalCount)} of 5 free slots remaining`}
              </p>
            </div>
            {!isPro && (
              <Link
                href="/pricing"
                className="text-sm bg-green-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Upgrade for unlimited →
              </Link>
            )}
          </div>

          <LibraryClient items={items} filter={filter} q={q} isPro={isPro} />
        </div>
      </main>
      <Footer />
    </>
  );
}
