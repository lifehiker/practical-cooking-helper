import Link from "next/link";
import { ChefHat, Clock, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leftover Chicken Recipes",
  description:
    "What to cook with leftover chicken? Get 5 realistic meal ideas instantly — no account needed. Try FridgeMeal's ingredient-to-meal tool.",
  keywords: ["leftover chicken recipes", "what to make with leftover chicken", "cooked chicken meal ideas"],
};

const ideas = [
  { title: "Chicken Fried Rice", time: "15 min", desc: "Classic weeknight fix. Cold rice + leftover chicken + egg + soy sauce in a hot wok." },
  { title: "Chicken Quesadillas", time: "10 min", desc: "Shredded chicken + cheese + flour tortilla. Serve with salsa or sour cream." },
  { title: "Chicken Soup", time: "25 min", desc: "Broth, carrots, celery, and noodles. The easiest leftover meal that feels like effort." },
  { title: "Chicken Caesar Wrap", time: "5 min", desc: "Romaine, parmesan, caesar dressing, and chicken in a large tortilla." },
  { title: "Chicken Pasta Bake", time: "30 min", desc: "Cooked pasta + chicken + tomato sauce or cream sauce + cheese on top. Bake until bubbly." },
];

export default function LeftoverChickenPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-green-50 py-14 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Leftover Chicken Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Got leftover cooked chicken in the fridge? Here are 5 practical ideas — and you can
            generate personalized suggestions with your exact ingredients.
          </p>
          <Link
            href="/ingredients-to-meals"
            className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            <ChefHat className="w-5 h-5" /> Get your own meal ideas
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">5 realistic leftover chicken ideas</h2>
          <div className="space-y-4">
            {ideas.map((idea, i) => (
              <div key={idea.title} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                <span className="text-2xl font-extrabold text-green-100 w-8 shrink-0">{i + 1}</span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {idea.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{idea.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-green-50 rounded-2xl p-6 text-center">
            <p className="font-semibold text-gray-900 mb-2">Have other ingredients too?</p>
            <p className="text-sm text-gray-600 mb-4">
              Enter everything you have and get ideas tailored to your exact fridge.
            </p>
            <Link
              href="/ingredients-to-meals"
              className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 transition-colors"
            >
              Try the ingredient tool <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found a good chicken recipe online?
            </h2>
            <p className="text-gray-600 mb-4">
              Paste any recipe URL into our{" "}
              <Link href="/recipe-extractor" className="text-green-700 font-medium hover:underline">
                Recipe Extractor
              </Link>{" "}
              to get a clean view with just the ingredients and steps — no blog preamble, no ads.
            </p>
            <Link
              href="/recipe-extractor"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
            >
              Try the recipe extractor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
