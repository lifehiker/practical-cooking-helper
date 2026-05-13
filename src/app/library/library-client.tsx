"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, ExternalLink, Search, Utensils, Link2, Trash2, BookOpen } from "lucide-react";
import type { SavedItem } from "@prisma/client";
import type { MealIdea, ExtractedRecipe } from "@/lib/types";

interface Props {
  items: SavedItem[];
  filter: string;
  q: string;
  isPro: boolean;
}

export function LibraryClient({ items, filter, q }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const [activeFilter, setActiveFilter] = useState(filter);
  const [deleting, setDeleting] = useState<string | null>(null);

  function applyFilter(f: string) {
    setActiveFilter(f);
    router.push(`/library?filter=${f}${search ? `&q=${encodeURIComponent(search)}` : ""}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/library?filter=${activeFilter}${search ? `&q=${encodeURIComponent(search)}` : ""}`);
  }

  async function deleteItem(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/library/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved items…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Search
          </button>
        </form>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "recipes", "ideas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => applyFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "all" ? "All" : f === "recipes" ? "Recipes" : "Meal Ideas"}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-500">Nothing saved yet.</p>
          <p className="text-sm mt-1">
            Save meal ideas from{" "}
            <Link href="/ingredients-to-meals" className="text-green-700 hover:underline">
              Ingredient Ideas
            </Link>{" "}
            or recipes from the{" "}
            <Link href="/recipe-extractor" className="text-green-700 hover:underline">
              Recipe Extractor
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const isRecipe = item.type === "EXTRACTED_RECIPE";
            const data = JSON.parse(item.payloadJson) as MealIdea | ExtractedRecipe;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isRecipe ? (
                      <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <Utensils className="w-4 h-4 text-green-600 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-gray-400">
                      {isRecipe ? "Extracted Recipe" : "Meal Idea"}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={deleting === item.id}
                    className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 leading-snug">{item.title}</h3>

                {item.summary && (
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
                )}

                <div className="flex items-center gap-3 mt-auto text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {isRecipe
                      ? (data as ExtractedRecipe).cookTime ?? "–"
                      : (data as MealIdea).cookTime}
                  </span>
                  {isRecipe && (data as ExtractedRecipe).sourceUrl && (
                    <a
                      href={(data as ExtractedRecipe).sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-green-700"
                    >
                      <ExternalLink className="w-3 h-3" /> Source
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
