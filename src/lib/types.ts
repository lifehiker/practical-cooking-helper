export type MealIdea = {
  title: string;
  description: string;
  cookTime: string;
  confidence: number;
  missingOptionalIngredients: string[];
  includesMustUse: boolean;
};

export type ExtractedRecipe = {
  title: string;
  image?: string;
  sourceUrl: string;
  servings?: string;
  cookTime?: string;
  ingredients: string[];
  steps: string[];
  notes?: string[];
};

export type SavedPayload = {
  mealIdea?: MealIdea;
  recipe?: ExtractedRecipe;
};
