import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { generateMealIdeas } from "@/lib/suggestions";
import { assertUsageAllowed, recordUsage } from "@/lib/usage";

const requestSchema = z.object({
  ingredients: z.array(z.string()).min(1).max(10),
  mustUse: z.array(z.string()).max(10).default([]),
  assumeBasics: z.boolean().default(true),
});

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const { identifier, userId } = await assertUsageAllowed("SUGGESTION");
    const ideas = await generateMealIdeas(payload);

    await db.ingredientSearch.create({
      data: {
        identifier,
        userId,
        ingredientsJson: JSON.stringify(payload.ingredients),
        mustUseJson: JSON.stringify(payload.mustUse),
        assumeBasics: payload.assumeBasics,
      },
    });

    await recordUsage("SUGGESTION", { ingredients: payload.ingredients.length });

    return NextResponse.json({ ideas });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not generate meal ideas.",
      },
      { status: 400 },
    );
  }
}
