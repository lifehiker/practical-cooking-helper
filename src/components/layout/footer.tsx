import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-green-700">
              <ChefHat className="w-5 h-5" />
              FridgeMeal
            </Link>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Use what you have. Skip the recipe blog clutter.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/ingredients-to-meals" className="hover:text-green-700">Ingredient Ideas</Link></li>
              <li><Link href="/recipe-extractor" className="hover:text-green-700">Recipe Extractor</Link></li>
              <li><Link href="/library" className="hover:text-green-700">My Library</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Recipes</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/leftover-chicken-recipes" className="hover:text-green-700">Leftover Chicken</Link></li>
              <li><Link href="/leftover-rice-recipes" className="hover:text-green-700">Leftover Rice</Link></li>
              <li><Link href="/fridge-clean-out-recipes" className="hover:text-green-700">Fridge Clean Out</Link></li>
              <li><Link href="/recipe-without-the-blog" className="hover:text-green-700">Recipe Without Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/pricing" className="hover:text-green-700">Pricing</Link></li>
              <li><Link href="/account" className="hover:text-green-700">Account</Link></li>
              <li><Link href="/sign-in" className="hover:text-green-700">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} FridgeMeal. All rights reserved.</p>
          <p>Practical cooking, no clutter.</p>
        </div>
      </div>
    </footer>
  );
}
