import type { ExtractedRecipe, MealIdea } from "@/lib/types";

export const ingredientPageSeeds = {
  "chicken-rice-onion": {
    title: "Chicken, Rice, and Onion Meal Ideas",
    intro:
      "These are fast, realistic ideas for a very common leftover trio: cooked chicken, rice, and onion.",
    ingredients: ["chicken", "rice", "onion"],
    mustUse: ["chicken"],
  },
  "eggs-spinach-cheese": {
    title: "Eggs, Spinach, and Cheese Meal Ideas",
    intro:
      "A fridge-clean-out classic. These combinations turn three staples into quick breakfasts, lunches, or light dinners.",
    ingredients: ["eggs", "spinach", "cheese"],
    mustUse: ["spinach"],
  },
} as const;

export const faqItems = [
  {
    question: "How does the recipe extractor work?",
    answer:
      "It first looks for recipe schema on the page, then falls back to readability and ingredient-step heuristics when structured data is missing.",
  },
  {
    question: "Can I use it without creating an account?",
    answer:
      "Yes. You can run the two main tools without signing in. An account is only needed for saved items, synced history, and plan management.",
  },
  {
    question: "What happens if a page blocks extraction?",
    answer:
      "The app shows a graceful error state and keeps the input intact so you can retry or paste a different recipe link.",
  },
];

export const demoRecipe: ExtractedRecipe = {
  title: "Weeknight Lemon Garlic Chicken Pasta",
  sourceUrl: "https://example.com/weeknight-lemon-garlic-chicken-pasta",
  servings: "4 servings",
  cookTime: "30 minutes",
  ingredients: [
    "8 ounces pasta",
    "2 cups cooked chicken, shredded",
    "3 cloves garlic, minced",
    "1 lemon",
    "2 tablespoons butter",
    "1 cup spinach",
    "1/2 cup grated parmesan",
  ],
  steps: [
    "Cook the pasta in salted water until just tender.",
    "Melt the butter, add garlic, then stir in the chicken and spinach.",
    "Add pasta, lemon zest, lemon juice, and a splash of pasta water.",
    "Toss with parmesan and season to taste before serving.",
  ],
  notes: ["Works well with leftover roast chicken or turkey."],
};

export const demoMealIdeas: MealIdea[] = [
  {
    title: "Crispy Chicken Fried Rice",
    description: "Use cold rice and leftover chicken for a fast skillet dinner with onion and pantry basics.",
    cookTime: "15 minutes",
    confidence: 96,
    missingOptionalIngredients: ["soy sauce", "frozen peas"],
    includesMustUse: true,
  },
  {
    title: "Cheesy Chicken Rice Bake",
    description: "Turn leftovers into a comforting casserole with onion, broth, and a little cheese on top.",
    cookTime: "30 minutes",
    confidence: 88,
    missingOptionalIngredients: ["cheddar", "broth"],
    includesMustUse: true,
  },
];
