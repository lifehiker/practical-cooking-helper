import * as cheerio from "cheerio";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

import type { ExtractedRecipe } from "@/lib/types";

function ensureArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => ensureArray(item));
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|•/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    const maybeText = (value as Record<string, unknown>).text;
    return ensureArray(maybeText);
  }

  return [];
}

function parseRecipeSchema(html: string, url: string): ExtractedRecipe | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]')
    .map((_, element) => $(element).text())
    .get();

  for (const script of scripts) {
    try {
      const data = JSON.parse(script) as unknown;
      const items = Array.isArray(data)
        ? data
        : "@graph" in (data as Record<string, unknown>)
          ? (((data as Record<string, unknown>)["@graph"] as unknown[]) ?? [])
          : [data];

      for (const item of items) {
        if (!item || typeof item !== "object") {
          continue;
        }

        const entry = item as Record<string, unknown>;
        const type = entry["@type"];
        const types = Array.isArray(type) ? type : [type];

        if (!types.includes("Recipe")) {
          continue;
        }

        const steps = ensureArray(entry.recipeInstructions);
        const ingredients = ensureArray(entry.recipeIngredient);
        const image = Array.isArray(entry.image)
          ? String(entry.image[0] ?? "")
          : typeof entry.image === "string"
            ? entry.image
            : typeof entry.image === "object" && entry.image
              ? String((entry.image as Record<string, unknown>).url ?? "")
              : "";

        return {
          title: String(entry.name ?? "Untitled Recipe"),
          sourceUrl: url,
          image: image || undefined,
          servings: entry.recipeYield ? ensureArray(entry.recipeYield).join(", ") : undefined,
          cookTime: String(entry.totalTime ?? entry.cookTime ?? entry.prepTime ?? "").replace(/^PT/i, ""),
          ingredients,
          steps,
          notes: ensureArray(entry.description).slice(0, 2),
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractWithReadability(html: string, url: string): ExtractedRecipe {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  const $ = cheerio.load(html);
  const ingredientTexts = $('[class*="ingredient"], [id*="ingredient"], li')
    .map((_, element) => $(element).text().trim())
    .get()
    .filter((item) => item.length > 3);
  const instructionTexts = $('[class*="instruction"], [class*="direction"], [id*="instruction"], ol li, p')
    .map((_, element) => $(element).text().trim())
    .get()
    .filter((item) => item.length > 20);

  return {
    title: article?.title?.trim() || $("title").text().trim() || "Clean Recipe View",
    sourceUrl: url,
    image: $('meta[property="og:image"]').attr("content") || undefined,
    servings: $('meta[itemprop="recipeYield"]').attr("content") || undefined,
    cookTime:
      $('meta[itemprop="totalTime"]').attr("content") ||
      $('[class*="time"]').first().text().trim() ||
      undefined,
    ingredients: Array.from(new Set(ingredientTexts)).slice(0, 20),
    steps: Array.from(new Set(instructionTexts)).slice(0, 12),
    notes: article?.excerpt ? [article.excerpt] : undefined,
  };
}

export async function extractRecipeFromUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; FridgeMealBot/1.0; +https://fridgemeal.local)",
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch that recipe page.");
  }

  const html = await response.text();
  const schemaRecipe = parseRecipeSchema(html, url);
  const parsed = schemaRecipe ?? extractWithReadability(html, url);

  if (!parsed.ingredients.length || !parsed.steps.length) {
    throw new Error("This page did not expose enough recipe data to build a clean view.");
  }

  return {
    ...parsed,
    ingredients: parsed.ingredients.slice(0, 25),
    steps: parsed.steps.slice(0, 15),
  };
}
