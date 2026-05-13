import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefHat, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ingredientPageSeeds } from "@/lib/demo-content";
import { MealCard } from "@/components/suggestions/meal-card";
import { generateMealIdeas } from "@/lib/suggestions";
import type { Metadata } from "next";

type ComboKey = keyof typeof ingredientPageSeeds;

export async function generateStaticParams() {
  return Object.keys(ingredientPageSeeds).map((combo) => ({ combo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ combo: string }>;
}): Promise<Metadata> {
  const { combo } = await params;
  const seed = ingredientPageSeeds[combo as ComboKey];
  if (!seed) return {};
  return {
    title: `${seed.title} | FridgeMeal`,
    description: seed.intro,
  };
}

export default async function IngredientComboPage({
  params,
}: {
  params: Promise<{ combo: string }>;
}) {
  const { combo } = await params;
  const seed = ingredientPageSeeds[combo as ComboKey];
  if (!seed) notFound();

  const ideas = await generateMealIdeas({
    ingredients: [...seed.ingredients],
    mustUse: [...seed.mustUse],
    assumeBasics: true,
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-green-50 py-14 px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{seed.title}</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">{seed.intro}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {seed.ingredients.map((ing) => (
              <span key={ing} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {ing}
              </span>
            ))}
          </div>
          <Link
            href="/ingredients-to-meals"
            className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            <ChefHat className="w-5 h-5" /> Try with your own ingredients
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meal ideas</h2>
          <div className="space-y-4">
            {ideas.map((idea) => (
              <MealCard key={idea.title} idea={idea} />
            ))}
          </div>

          <div className="mt-10 bg-green-50 rounded-2xl p-6 text-center">
            <p className="font-semibold text-gray-900 mb-2">Have different ingredients?</p>
            <p className="text-sm text-gray-500 mb-4">Generate personalized ideas for exactly what you have.</p>
            <Link
              href="/ingredients-to-meals"
              className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 transition-colors"
            >
              Try ingredient tool <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
