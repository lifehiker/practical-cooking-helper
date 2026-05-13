import Link from "next/link";
import { Link2, CheckCircle, ArrowRight, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Without the Blog | FridgeMeal",
  description:
    "Get a clean recipe view from any URL — just ingredients, steps, cook time, and servings. No ads, no life story, no pop-ups.",
  keywords: [
    "recipe without the blog",
    "just the recipe no story",
    "recipe extractor app",
    "clean recipe view",
    "recipe without ads",
    "recipe reader no blog",
    "just ingredients and steps",
  ],
};

export default function RecipeWithoutBlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-blue-50 py-14 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Just the Recipe. No Blog.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Paste any recipe URL. Get a clean view with just the title, ingredients, steps, and
            cook time — no ads, no pop-ups, no stories about grandma&apos;s kitchen.
          </p>
          <Link
            href="/recipe-extractor"
            className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl hover:bg-blue-800 transition-colors"
          >
            <Link2 className="w-5 h-5" /> Paste a recipe URL
          </Link>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-14">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you get instead</h2>
              <ul className="space-y-3">
                {[
                  "Recipe title and source link",
                  "Cook time and servings",
                  "Checkable ingredient list",
                  "Numbered step-by-step instructions",
                  "Notes from the recipe (if any)",
                  "Keep-screen-awake mode for cooking",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you don&apos;t get</h2>
              <ul className="space-y-3">
                {[
                  "5,000-word life story introduction",
                  "Autoplaying video ads",
                  "Email newsletter pop-ups",
                  "15 photos of the dish from every angle",
                  "Inline shopping affiliate links",
                  "SEO-stuffed question blocks",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Try it now — free</h3>
            <p className="text-sm text-gray-500 mb-4">No account needed. 2 free extracts per day.</p>
            <Link
              href="/recipe-extractor"
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
            >
              Open recipe extractor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {[
                { q: "How do I extract a recipe from a URL?", a: "Paste any recipe URL into the input box and click Extract. FridgeMeal fetches the page, finds the recipe data, and presents a clean view in seconds." },
                { q: "Which recipe sites does it work with?", a: "It works with most major recipe sites that use Recipe structured data, including AllRecipes, Serious Eats, NYT Cooking, Food Network, and hundreds more." },
                { q: "What if a site blocks extraction?", a: "Some sites block automated fetches. FridgeMeal shows a clear error message if it can't extract — you can try a different URL or use the site directly." },
                { q: "Can I save extracted recipes?", a: "Yes. Sign in to save recipes to your personal library and access them anytime." },
              ].map((item) => (
                <details key={item.q} className="bg-white rounded-xl border border-gray-200">
                  <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 list-none flex justify-between">
                    {item.q} <span className="text-gray-400">▾</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
