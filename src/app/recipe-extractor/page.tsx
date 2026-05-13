"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, Link2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CleanRecipeCard } from "@/components/recipes/clean-recipe-card";
import type { ExtractedRecipe } from "@/lib/types";
import Link from "next/link";

export default function RecipeExtractorPage() {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState<ExtractedRecipe | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please paste a recipe URL.");
      return;
    }
    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }),
      });
      const data = await res.json() as { recipe?: ExtractedRecipe; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not extract that recipe.");
        return;
      }
      setRecipe(data.recipe ?? null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!recipe) return;
    const res = await fetch("/api/library/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "EXTRACTED_RECIPE",
        title: recipe.title,
        sourceUrl: recipe.sourceUrl,
        imageUrl: recipe.image,
        data: recipe,
      }),
    });
    if (!res.ok) {
      const d = await res.json() as { error?: string };
      throw new Error(d.error ?? "Could not save.");
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Extractor</h1>
            <p className="text-gray-500">
              Paste any recipe URL for a clean view — just ingredients, steps, cook time, and servings.
              No ads, no life stories.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <label htmlFor="recipe-url" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="recipe-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.seriouseats.com/some-recipe"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="flex items-center gap-2 bg-green-700 text-white font-semibold px-5 py-3 rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                {loading ? "Extracting…" : "Extract"}
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p>{error}</p>
                  <p className="mt-1 text-red-500">Try a different recipe link, or check that the URL is correct.</p>
                </div>
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400">
              Works with most recipe sites. {!session && "2 free extracts per day · "}
              <Link href="/sign-in" className="text-green-700 hover:underline">
                {session ? "" : "Sign in for history and saving"}
              </Link>
            </p>
          </form>

          {/* Loading skeleton */}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-6" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          )}

          {/* Recipe result */}
          {recipe && !loading && (
            <CleanRecipeCard
              recipe={recipe}
              onSave={session ? handleSave : undefined}
            />
          )}

          {/* Empty hint */}
          {!recipe && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Paste a recipe URL above to get started.</p>
              <p className="text-xs mt-1">Try any URL from AllRecipes, Serious Eats, NYT Cooking, etc.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
