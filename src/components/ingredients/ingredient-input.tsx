"use client";

import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";
import { COMMON_INGREDIENTS, PANTRY_BASICS } from "@/lib/constants";

interface Props {
  ingredients: string[];
  mustUse: string[];
  assumeBasics: boolean;
  onChange: (ingredients: string[], mustUse: string[], assumeBasics: boolean) => void;
  disabled?: boolean;
}

export function IngredientInput({ ingredients, mustUse, assumeBasics, onChange, disabled }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive suggestions directly — no useEffect needed
  const trimmed = inputValue.trim().toLowerCase();
  const suggestions = trimmed
    ? COMMON_INGREDIENTS.filter(
        (ing) => ing.toLowerCase().includes(trimmed) && !ingredients.includes(ing)
      ).slice(0, 6)
    : [];

  function addIngredient(value: string) {
    const clean = value.trim().toLowerCase();
    if (!clean || ingredients.includes(clean) || ingredients.length >= 10) return;
    onChange([...ingredients, clean], mustUse, assumeBasics);
    setInputValue("");
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  }

  function removeIngredient(ing: string) {
    const newIngredients = ingredients.filter((i) => i !== ing);
    const newMustUse = mustUse.filter((i) => i !== ing);
    onChange(newIngredients, newMustUse, assumeBasics);
  }

  function toggleMustUse(ing: string) {
    const newMustUse = mustUse.includes(ing)
      ? mustUse.filter((i) => i !== ing)
      : [...mustUse, ing];
    onChange(ingredients, newMustUse, assumeBasics);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        addIngredient(suggestions[activeSuggestion]);
      } else {
        addIngredient(inputValue);
      }
    } else if (e.key === "Escape") {
      setInputValue("");
    } else if (e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addIngredient(inputValue);
    }
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setActiveSuggestion(-1); }}
            onKeyDown={handleKeyDown}
            placeholder={ingredients.length >= 10 ? "10 ingredients max" : "Add an ingredient…"}
            disabled={disabled || ingredients.length >= 10}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => addIngredient(inputValue)}
            disabled={!inputValue.trim() || disabled || ingredients.length >= 10}
            className="px-4 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-20 left-0 right-16 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((sug, i) => (
              <li key={sug}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 ${i === activeSuggestion ? "bg-green-50 text-green-800" : "text-gray-700"}`}
                  onClick={() => addIngredient(sug)}
                >
                  {sug}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chip list */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing) => (
            <span
              key={ing}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-medium transition-colors ${
                mustUse.includes(ing)
                  ? "bg-orange-100 border-orange-300 text-orange-800"
                  : "bg-green-50 border-green-200 text-green-800"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleMustUse(ing)}
                title={mustUse.includes(ing) ? "Remove must-use" : "Mark as must-use"}
                className="font-bold text-xs"
              >
                {mustUse.includes(ing) ? "★" : "☆"}
              </button>
              {ing}
              <button
                type="button"
                onClick={() => removeIngredient(ing)}
                className="ml-0.5 hover:text-red-500 transition-colors"
                aria-label={`Remove ${ing}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {ingredients.length > 0 && mustUse.length === 0 && (
        <p className="text-xs text-gray-400">Tap ☆ on any ingredient to mark it as must-use (prioritized in suggestions).</p>
      )}

      {/* Pantry toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => onChange(ingredients, mustUse, !assumeBasics)}
          className={`relative w-10 h-5 rounded-full transition-colors ${assumeBasics ? "bg-green-600" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${assumeBasics ? "translate-x-5" : ""}`}
          />
        </div>
        <span className="text-sm text-gray-700">
          Assume pantry basics
          <span className="text-gray-400 ml-1 font-normal">
            ({PANTRY_BASICS.join(", ")})
          </span>
        </span>
      </label>
    </div>
  );
}
