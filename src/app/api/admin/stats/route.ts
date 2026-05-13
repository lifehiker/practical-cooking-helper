import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalUsers, newUsers7d, totalSuggestions, totalExtractions, paidUsers] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.usageEvent.count({ where: { action: "SUGGESTION" } }),
      db.usageEvent.count({ where: { action: "EXTRACTION" } }),
      db.user.count({ where: { NOT: { plan: "FREE" } } }),
    ]);

  return NextResponse.json({
    totalUsers,
    newUsers7d,
    totalSuggestions,
    totalExtractions,
    paidUsers,
    conversionRate: totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0,
  });
}
