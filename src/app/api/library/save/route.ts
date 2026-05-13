import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { assertUsageAllowed } from "@/lib/usage";
import { getCurrentUser } from "@/lib/session";

const requestSchema = z.object({
  type: z.enum(["EXTRACTED_RECIPE", "MEAL_IDEA"]),
  title: z.string().min(1),
  summary: z.string().optional(),
  sourceUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  data: z.unknown(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to save items." }, { status: 401 });
    }

    const payload = requestSchema.parse(await request.json());
    await assertUsageAllowed("SAVE");

    const item = await db.savedItem.create({
      data: {
        userId: user.id,
        type: payload.type,
        title: payload.title,
        summary: payload.summary,
        sourceUrl: payload.sourceUrl,
        imageUrl: payload.imageUrl,
        payloadJson: JSON.stringify(payload.data),
        searchText: payload.title.toLowerCase(),
      },
    });

    return NextResponse.json({ id: item.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save item." },
      { status: 400 },
    );
  }
}
