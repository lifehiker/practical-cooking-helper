import Link from "next/link";
import { ChefHat, Clock, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leftover Rice Recipes",
  description:
    "What to make with leftover rice? Get practical meal ideas instantly. Use FridgeMeal's ingredient tool to generate ideas for your exact leftovers.",
  keywords: ["leftover rice recipes", "what to make with leftover rice", "cooked rice meal ideas", "leftover rice meal ideas"],
};

const ideas = [
  { title: "Fried Rice", time: "12 min", desc: "Cold day-old rice fries best. Add egg, soy sauce, sesame oil, and any veg you have." },
  { title: "Rice Bowl", time: "5 min", desc: "Reheat the rice, top with protein, pickled veggies, and a drizzle of sauce." },
  { title: "Rice Fritters", time: "15 min", desc: "Mix leftover rice with egg and cheese, pan-fry into crispy cakes." },
  { title: "Rice Soup / Congee", time: "20 min", desc: "Simmer rice with more broth until thick and creamy. Top with a soft-boiled egg and green onion." },
  { title: "Stuffed Peppers", time: "35 min", desc: "Mix rice with browned ground meat and tomato sauce, stuff into halved peppers, bake." },
];

export default function LeftoverRicePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-green-50 py-14 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Leftover Rice Recipes</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Cold rice is one of the best cooking ingredients you can have. Here are 5 fast, practical ideas.
          </p>
          <Link
            href="/ingredients-to-meals"
            className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-7 py-3 rounded-xl hover:bg-green-800 transition-colors"
          >
            <ChefHat className="w-5 h-5" /> Get personalized meal ideas
          </Link>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">5 leftover rice ideas</h2>
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
            <p className="font-semibold text-gray-900 mb-2">Have other leftovers too?</p>
            <p className="text-sm text-gray-600 mb-4">Add all your ingredients for ideas specific to your fridge.</p>
            <Link
              href="/ingredients-to-meals"
              className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-800 transition-colors"
            >
              Try the ingredient tool <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
