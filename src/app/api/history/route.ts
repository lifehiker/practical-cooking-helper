import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [ingredientSearches, recipeExtracts] = await Promise.all([
      db.ingredientSearch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.recipeExtract.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({ ingredientSearches, recipeExtracts });
  } catch {
    return NextResponse.json({ error: "Could not fetch history." }, { status: 500 });
  }
}
