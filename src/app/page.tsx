import Link from "next/link";
import { ChefHat, Utensils, Link2, Star, Clock, Smartphone } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { demoMealIdeas, demoRecipe, faqItems } from "@/lib/demo-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Can I Cook With What I Have? | FridgeMeal",
  description:
    "Turn leftovers or fridge ingredients into 5 practical meal ideas in seconds. Paste any recipe URL for a clean, ad-free view with just the recipe.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-green-50 to-white py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                <ChefHat className="w-4 h-4" /> Kitchen utility for real cooks
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              Use what you have.
              <br />
              <span className="text-green-700">Skip the recipe blog clutter.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Type what&apos;s in your fridge for 5 realistic meal ideas, or paste any recipe link for
              a clean view with just ingredients and steps — no ads, no stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients-to-meals"
                className="bg-green-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-800 transition-colors text-lg shadow-sm"
              >
                What can I make? →
              </Link>
              <Link
                href="/recipe-extractor"
                className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors text-lg"
              >
                Clean up a recipe →
              </Link>
            </div>
          </div>
        </section>

        {/* Two tools section */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-12">
              Two tools. One kitchen problem solved.
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tool 1 */}
              <div className="rounded-2xl border border-gray-200 p-8 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Utensils className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ingredient → Meal Ideas</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Add 1–10 ingredients from your fridge. Mark must-use items. Get 5 practical meal
                  ideas with cook time, confidence score, and what you might be missing.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>✓ Autocomplete ingredient entry</li>
                  <li>✓ Pantry basics toggle (salt, oil, butter…)</li>
                  <li>✓ Must-use prioritization</li>
                  <li>✓ 3 free runs per day</li>
                </ul>
                <Link
                  href="/ingredients-to-meals"
                  className="inline-block bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Try Ingredient Ideas
                </Link>
              </div>

              {/* Tool 2 */}
              <div className="rounded-2xl border border-gray-200 p-8 hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Link2 className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recipe URL → Clean View</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Paste any recipe link. Get a distraction-free card with the title, image, servings,
                  cook time, checkable ingredients, and numbered steps — nothing else.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>✓ Works on most major recipe sites</li>
                  <li>✓ Checkable ingredients and steps</li>
                  <li>✓ Keep-screen-awake mode for cooking</li>
                  <li>✓ 2 free extracts per day</li>
                </ul>
                <Link
                  href="/recipe-extractor"
                  className="inline-block bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Try Recipe Extractor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Demo meal ideas preview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-3">
              Realistic results, instantly
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Example output for: chicken + rice + onion
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {demoMealIdeas.map((idea) => (
                <div key={idea.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                    <span className="shrink-0 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {idea.confidence}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {idea.cookTime}
                    </span>
                    {idea.missingOptionalIngredients.length > 0 && (
                      <span>Optional: {idea.missingOptionalIngredients.join(", ")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/ingredients-to-meals"
                className="inline-block text-green-700 font-medium hover:underline"
              >
                Try with your own ingredients →
              </Link>
            </div>
          </div>
        </section>

        {/* Demo recipe preview */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-3">
              Clean recipe, no noise
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Example output from pasting a recipe URL
            </p>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-xl mx-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{demoRecipe.title}</h3>
                <p className="text-sm text-gray-400 mb-4">via example.com</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-5">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {demoRecipe.cookTime}</span>
                  <span>Serves {demoRecipe.servings}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">Ingredients</h4>
                <ul className="space-y-1.5 mb-4">
                  {demoRecipe.ingredients.slice(0, 4).map((ing) => (
                    <li key={ing} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                  <li className="text-sm text-gray-400">+ {demoRecipe.ingredients.length - 4} more…</li>
                </ul>
                <p className="text-xs text-gray-400 italic">Tap any item to check it off as you cook.</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/recipe-extractor" className="text-green-700 font-medium hover:underline">
                Try the recipe extractor →
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Why section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
              Built for standing in the kitchen
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: <Smartphone className="w-6 h-6 text-green-700" />, title: "Mobile-first", desc: "Large text, big tap targets, screen-wake lock so your phone stays on while you cook." },
                { icon: <Clock className="w-6 h-6 text-green-700" />, title: "Under 30 seconds", desc: "Open the app, enter ingredients or a URL, get results. No account required to start." },
                { icon: <Star className="w-6 h-6 text-green-700" />, title: "Save your favorites", desc: "Sign in to save extracted recipes and meal ideas to a personal library. Access them anytime." },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-xl border border-gray-200 group"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 list-none">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green-700">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start cooking with what you have
            </h2>
            <p className="text-green-100 mb-8">
              Free to use. No account needed. Works on your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ingredients-to-meals"
                className="bg-white text-green-800 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors"
              >
                Enter ingredients →
              </Link>
              <Link
                href="/recipe-extractor"
                className="bg-green-800 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-900 border border-green-600 transition-colors"
              >
                Extract a recipe →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
