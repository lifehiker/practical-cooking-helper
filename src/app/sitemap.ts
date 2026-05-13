import type { MetadataRoute } from "next";
import { ingredientPageSeeds } from "@/lib/demo-content";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://fridgemeal.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/ingredients-to-meals`, priority: 0.9 },
    { url: `${BASE_URL}/recipe-extractor`, priority: 0.9 },
    { url: `${BASE_URL}/leftover-chicken-recipes`, priority: 0.8 },
    { url: `${BASE_URL}/leftover-rice-recipes`, priority: 0.8 },
    { url: `${BASE_URL}/fridge-clean-out-recipes`, priority: 0.8 },
    { url: `${BASE_URL}/recipe-without-the-blog`, priority: 0.8 },
    { url: `${BASE_URL}/pricing`, priority: 0.6 },
  ];

  const ingredientPages = Object.keys(ingredientPageSeeds).map((combo) => ({
    url: `${BASE_URL}/ingredients/${combo}`,
    priority: 0.7,
  }));

  const allPages = [...staticPages, ...ingredientPages];

  return allPages.map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}
