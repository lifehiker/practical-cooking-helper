import { z } from "zod";

import { hasAiSuggestions, env } from "@/lib/env";
import type { MealIdea } from "@/lib/types";

const mealIdeaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  cookTime: z.string().min(3),
  confidence: z.number().min(50).max(99),
  missingOptionalIngredients: z.array(z.string()).max(4),
  includesMustUse: z.boolean(),
});

const responseSchema = z.array(mealIdeaSchema).length(5);

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fallbackIdeas(ingredients: string[], mustUse: string[], assumeBasics: boolean): MealIdea[] {
  const joined = ingredients.slice(0, 3).map(titleCase).join(", ");
  const allMustUse = mustUse.every((item) => ingredients.includes(item));
  const first = titleCase(ingredients[0] ?? "Leftover");
  const second = titleCase(ingredients[1] ?? "Kitchen");
  const third = titleCase(ingredients[2] ?? "Skillet");
  const pantryText = assumeBasics ? "with pantry basics" : "with a few extras";

  return [
    {
      title: `${first} Skillet Toss`,
      description: `A fast saute built around ${joined || "your leftovers"} ${pantryText}, finished as a flexible stovetop meal.`,
      cookTime: "15 minutes",
      confidence: allMustUse ? 95 : 90,
      missingOptionalIngredients: ["lemon", "fresh herbs"],
      includesMustUse: allMustUse,
    },
    {
      title: `${second} Fried Rice Bowl`,
      description: `Best when you have cooked grains or rice. This version folds in ${ingredients.join(", ")} for a practical one-pan dinner.`,
      cookTime: "18 minutes",
      confidence: allMustUse ? 92 : 87,
      missingOptionalIngredients: ["soy sauce", "egg"],
      includesMustUse: allMustUse,
    },
    {
      title: `${third} Sheet Pan Melt`,
      description: `Roast or reheat everything together, then finish with a cheese or breadcrumb topping for an easy oven meal.`,
      cookTime: "25 minutes",
      confidence: 84,
      missingOptionalIngredients: ["cheese", "breadcrumbs"],
      includesMustUse: allMustUse,
    },
    {
      title: `${first} Soup-for-Dinner`,
      description: `Stretch the leftovers with broth, beans, or greens to make a low-effort soup that still feels like dinner.`,
      cookTime: "20 minutes",
      confidence: 82,
      missingOptionalIngredients: ["broth", "beans"],
      includesMustUse: allMustUse,
    },
    {
      title: `${first} and ${second} Breakfast Hash`,
      description: `Repurpose the ingredients into a savory hash or scramble, especially good when you need a no-waste next-day meal.`,
      cookTime: "12 minutes",
      confidence: 79,
      missingOptionalIngredients: ["eggs", "hot sauce"],
      includesMustUse: allMustUse,
    },
  ];
}

export async function generateMealIdeas(input: {
  ingredients: string[];
  mustUse: string[];
  assumeBasics: boolean;
}) {
  const normalizedIngredients = input.ingredients.map((item) => item.trim().toLowerCase()).filter(Boolean);
  const normalizedMustUse = input.mustUse.map((item) => item.trim().toLowerCase()).filter(Boolean);

  if (!hasAiSuggestions()) {
    return fallbackIdeas(normalizedIngredients, normalizedMustUse, input.assumeBasics);
  }

  const prompt = `
You are generating practical leftover cooking suggestions.
Return JSON only: an array of exactly 5 objects.
Ingredients: ${normalizedIngredients.join(", ")}
Must use: ${normalizedMustUse.join(", ") || "none"}
Assume pantry basics: ${input.assumeBasics ? "yes" : "no"}
Each object must contain:
- title
- description
- cookTime
- confidence (50-99 integer)
- missingOptionalIngredients (0-4 strings)
- includesMustUse (boolean)
Keep every idea realistic for a home cook.
`;

  const response = await fetch(`${env.openAiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openAiModel,
      messages: [
        {
          role: "system",
          content: "You generate structured leftover meal suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    return fallbackIdeas(normalizedIngredients, normalizedMustUse, input.assumeBasics);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return fallbackIdeas(normalizedIngredients, normalizedMustUse, input.assumeBasics);
  }

  try {
    const parsed = JSON.parse(content) as { ideas?: unknown } | unknown[];
    const ideas = Array.isArray(parsed) ? parsed : parsed.ideas;
    return responseSchema.parse(ideas);
  } catch {
    return fallbackIdeas(normalizedIngredients, normalizedMustUse, input.assumeBasics);
  }
}
