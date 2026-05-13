"use client";

import { useState, useCallback } from "react";
import { Clock, Users, ExternalLink, Check, Moon } from "lucide-react";
import type { ExtractedRecipe } from "@/lib/types";

interface Props {
  recipe: ExtractedRecipe;
  onSave?: () => Promise<void>;
  isSaved?: boolean;
}

export function CleanRecipeCard({ recipe, onSave, isSaved }: Props) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved ?? false);

  // Determine wake lock support at render time (safe in client component)
  const wakeLockSupported = typeof navigator !== "undefined" && "wakeLock" in navigator;

  const releaseWakeLock = useCallback(() => {
    setWakeLockActive(false);
  }, []);

  async function toggleWakeLock() {
    if (!wakeLockSupported) return;
    if (wakeLockActive) {
      releaseWakeLock();
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (navigator as any).wakeLock.request("screen");
        setWakeLockActive(true);
      } catch {
        // User denied or not supported
      }
    }
  }

  function toggleIngredient(i: number) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  function toggleStep(i: number) {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  async function handleSave() {
    if (!onSave || saved) return;
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  const sourceDomain = (() => {
    try { return new URL(recipe.sourceUrl).hostname.replace("www.", ""); }
    catch { return recipe.sourceUrl; }
  })();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-1">{recipe.title}</h1>
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {sourceDomain}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          {recipe.cookTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-600" />
              {recipe.cookTime}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-green-600" />
              {recipe.servings}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                saved
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"
              } disabled:opacity-60`}
            >
              {saved ? "✓ Saved to library" : saving ? "Saving…" : "Save to library"}
            </button>
          )}
          {wakeLockSupported && (
            <button
              onClick={toggleWakeLock}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                wakeLockActive
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700"
              }`}
            >
              <Moon className="w-4 h-4" />
              {wakeLockActive ? "Screen awake (on)" : "Keep screen awake"}
            </button>
          )}
        </div>
      </div>

      {/* Recipe image */}
      {recipe.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}

      <div className="grid md:grid-cols-5 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Ingredients */}
        <div className="md:col-span-2 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center justify-between">
            Ingredients
            <span className="text-xs font-normal text-gray-400 normal-case tracking-normal">
              {checkedIngredients.size}/{recipe.ingredients.length} checked
            </span>
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                onClick={() => toggleIngredient(i)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checkedIngredients.has(i)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 group-hover:border-green-400"
                  }`}
                >
                  {checkedIngredients.has(i) && <Check className="w-3 h-3" />}
                </span>
                <span
                  className={`text-sm leading-relaxed transition-colors ${
                    checkedIngredients.has(i) ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {ing}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-3 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
            Instructions
          </h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                onClick={() => toggleStep(i)}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    checkedSteps.has(i)
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-400 group-hover:border-green-400"
                  }`}
                >
                  {checkedSteps.has(i) ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                <p
                  className={`text-sm leading-relaxed flex-1 transition-colors ${
                    checkedSteps.has(i) ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {recipe.notes && recipe.notes.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Notes</h3>
              {recipe.notes.map((note, i) => (
                <p key={i} className="text-sm text-amber-700 leading-relaxed">{note}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
