import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { extractRecipeFromUrl } from "@/lib/extractor";
import { assertUsageAllowed, recordUsage } from "@/lib/usage";

const requestSchema = z.object({
  url: z.string().url("Please provide a valid URL."),
});

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const { identifier, userId } = await assertUsageAllowed("EXTRACTION");
    const recipe = await extractRecipeFromUrl(payload.url);

    await db.recipeExtract.create({
      data: {
        identifier,
        userId,
        url: payload.url,
        title: recipe.title,
        payloadJson: JSON.stringify(recipe),
      },
    });

    await recordUsage("EXTRACTION", { url: payload.url });

    return NextResponse.json({ recipe });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not extract that recipe." },
      { status: 400 },
    );
  }
}
