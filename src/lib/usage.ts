import { headers } from "next/headers";

import { auth } from "@/auth";
import { FREE_LIMITS } from "@/lib/constants";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

function startOfDay() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export async function getRequestIdentifier() {
  const session = await auth();

  if (session?.user?.id) {
    return { identifier: session.user.id, userId: session.user.id };
  }

  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "127.0.0.1";

  return {
    identifier: `${ip}:${userAgent.slice(0, 40)}`,
    userId: null,
  };
}

export async function isProUser() {
  const user = await getCurrentUser();
  return Boolean(user && user.plan !== "FREE");
}

export async function assertUsageAllowed(action: "SUGGESTION" | "EXTRACTION" | "SAVE") {
  const { identifier, userId } = await getRequestIdentifier();
  const user = await getCurrentUser();

  if (user && user.plan !== "FREE") {
    return { identifier, userId };
  }

  const createdAt = { gte: startOfDay() };

  if (action === "SAVE" && userId) {
    const currentSavedCount = await db.savedItem.count({
      where: { userId },
    });

    if (currentSavedCount >= FREE_LIMITS.savedItems) {
      throw new Error("Free users can save up to 5 items. Upgrade to Pro for an unlimited library.");
    }
  }

  const todayCount = await db.usageEvent.count({
    where: {
      action,
      createdAt,
      OR: [{ userId: userId ?? undefined }, { identifier }],
    },
  });

  const limit =
    action === "SUGGESTION"
      ? FREE_LIMITS.suggestionsPerDay
      : action === "EXTRACTION"
        ? FREE_LIMITS.extractsPerDay
        : FREE_LIMITS.savedItems;

  if (todayCount >= limit) {
    throw new Error("You have reached today's free usage limit. Upgrade to Pro for unlimited access.");
  }

  return { identifier, userId };
}

export async function recordUsage(action: "SUGGESTION" | "EXTRACTION" | "SAVE", meta?: unknown) {
  const { identifier, userId } = await getRequestIdentifier();
  await db.usageEvent.create({
    data: {
      action,
      identifier,
      userId,
      metaJson: meta ? JSON.stringify(meta) : undefined,
    },
  });
}
