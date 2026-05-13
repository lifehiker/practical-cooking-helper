"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, Utensils } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { IngredientInput } from "@/components/ingredients/ingredient-input";
import { MealCard } from "@/components/suggestions/meal-card";
import type { MealIdea } from "@/lib/types";
import Link from "next/link";

export default function IngredientsToMealsPage() {
  const { data: session } = useSession();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [mustUse, setMustUse] = useState<string[]>([]);
  const [assumeBasics, setAssumeBasics] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ideas, setIdeas] = useState<MealIdea[] | null>(null);

  function handleChange(newIngredients: string[], newMustUse: string[], newAssumeBasics: boolean) {
    setIngredients(newIngredients);
    setMustUse(newMustUse);
    setAssumeBasics(newAssumeBasics);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }
    setLoading(true);
    setError("");
    setIdeas(null);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, mustUse, assumeBasics }),
      });
      const data = await res.json() as { ideas?: MealIdea[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setIdeas(data.ideas ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveMealIdea(idea: MealIdea) {
    const res = await fetch("/api/library/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "MEAL_IDEA", title: idea.title, data: idea }),
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">What can I make?</h1>
            <p className="text-gray-500">
              Add ingredients from your fridge. Get 5 practical meal ideas in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <IngredientInput
              ingredients={ingredients}
              mustUse={mustUse}
              assumeBasics={assumeBasics}
              onChange={handleChange}
              disabled={loading}
            />

            {error && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {ingredients.length}/10 ingredients
                {!session && " · 3 free runs per day"}
              </p>
              <button
                type="submit"
                disabled={loading || ingredients.length === 0}
                className="flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Getting ideas…</>
                ) : (
                  <><Utensils className="w-4 h-4" /> Get meal ideas</>
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {ideas && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {ideas.length} meal ideas for you
                </h2>
                {!session && (
                  <Link href="/sign-in" className="text-sm text-green-700 font-medium hover:underline">
                    Sign in to save →
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <MealCard
                    key={idea.title}
                    idea={idea}
                    onSave={session ? handleSaveMealIdea : undefined}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                <p className="font-medium mb-1">These are suggestions, not recipes.</p>
                <p className="text-green-700">
                  Each idea is based on common cooking methods for your ingredients.
                  Use the{" "}
                  <Link href="/recipe-extractor" className="font-semibold underline">
                    Recipe Extractor
                  </Link>{" "}
                  if you want a specific clean recipe view.
                </p>
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!ideas && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Add ingredients above and click &quot;Get meal ideas&quot; to start.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
