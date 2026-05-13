"use client";

import { useState } from "react";
import { Clock, Bookmark, BookmarkCheck, ChevronDown } from "lucide-react";
import type { MealIdea } from "@/lib/types";

interface Props {
  idea: MealIdea;
  onSave?: (idea: MealIdea) => Promise<void>;
  isSaved?: boolean;
}

export function MealCard({ idea, onSave, isSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved ?? false);
  const [expanded, setExpanded] = useState(false);

  const confidenceColor =
    idea.confidence >= 90
      ? "bg-green-100 text-green-800"
      : idea.confidence >= 75
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-600";

  async function handleSave() {
    if (!onSave || saved) return;
    setSaving(true);
    try {
      await onSave(idea);
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`rounded-xl border p-5 transition-all ${idea.includesMustUse ? "border-orange-200 bg-orange-50/30" : "border-gray-200 bg-white"}`}>
      {idea.includesMustUse && (
        <span className="inline-block text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full mb-2">
          Uses must-have ingredients ★
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{idea.title}</h3>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${confidenceColor}`}>
          {idea.confidence}%
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{idea.description}</p>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> {idea.cookTime}
        </span>
        {idea.missingOptionalIngredients.length > 0 && (
          <span>Optional: {idea.missingOptionalIngredients.join(", ")}</span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {onSave && (
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-700 disabled:opacity-60 transition-colors"
          >
            {saved ? (
              <><BookmarkCheck className="w-4 h-4 text-green-600" /> Saved</>
            ) : (
              <><Bookmark className="w-4 h-4" /> {saving ? "Saving…" : "Save idea"}</>
            )}
          </button>
        )}
        {idea.missingOptionalIngredients.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 ml-auto"
          >
            Details
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <p className="font-medium mb-1">Optional ingredients to enhance this meal:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {idea.missingOptionalIngredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
