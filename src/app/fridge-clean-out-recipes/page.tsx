import Link from "next/link";
import { ChefHat, ArrowRight, Utensils } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fridge Clean Out Recipes",
  description:
    "Use up whatever's in your fridge before it goes bad. Get practical meal ideas for your exact ingredients — no account needed.",
  keywords: ["fridge clean out recipes", "use up ingredients", "what to cook with what I have", "use up fridge"],
};

export default function FridgeCleanOutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-amber-50 py-14 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Fridge Clean-Out Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            End-of-week fridge full of random stuff? Enter what you have and get 5 practical meal
            ideas that actually use it up.
          </p>
          <Link
            href="/ingredients-to-meals"
            className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            <ChefHat className="w-5 h-5" /> What can I make?
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { step: "1", title: "Add your ingredients", desc: "Type what you have. Use autocomplete for common items. Add up to 10." },
              { step: "2", title: "Mark must-use items", desc: "Tap the star on any ingredient to prioritize it in the suggestions." },
              { step: "3", title: "Get 5 meal ideas", desc: "Practical, realistic ideas with cook time and confidence score. No fluff." },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="w-8 h-8 bg-green-100 text-green-800 font-bold rounded-full flex items-center justify-center text-sm mb-3">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <Utensils className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="font-semibold text-gray-900 mb-1">Ready to clean out the fridge?</p>
            <p className="text-sm text-gray-500 mb-4">Free to use. No account needed to start.</p>
            <Link
              href="/ingredients-to-meals"
              className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 transition-colors"
            >
              Enter your ingredients <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Found a recipe you want to try?</h2>
            <p className="text-gray-600 mb-4">
              Paste any recipe blog URL into our{" "}
              <Link href="/recipe-extractor" className="text-green-700 font-medium hover:underline">
                Recipe Extractor
              </Link>{" "}
              to strip out all the ads and blog content and get just the ingredients and steps.
            </p>
            <Link href="/recipe-extractor" className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline">
              Try the recipe extractor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
