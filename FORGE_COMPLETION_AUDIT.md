# FORGE COMPLETION AUDIT

## PRD Requirement → Implementation Mapping

### Data Model
| Requirement | Implementation |
|---|---|
| User model | `prisma/schema.prisma` — User model with email, name, image, role, plan, stripeCustomerId |
| Subscription model | `prisma/schema.prisma` — Subscription with Stripe sync fields |
| SavedItem model | `prisma/schema.prisma` — type (EXTRACTED_RECIPE or MEAL_IDEA), payloadJson |
| IngredientSearch history | `prisma/schema.prisma` — IngredientSearch with ingredientsJson, mustUseJson |
| RecipeExtract history | `prisma/schema.prisma` — RecipeExtract with url, title, payloadJson |
| UsageEvent tracking | `prisma/schema.prisma` — UsageEvent with action (SUGGESTION/EXTRACTION/SAVE) |

### Authentication
| Requirement | Implementation |
|---|---|
| Google sign-in via NextAuth | `src/auth.ts` — Google provider, conditionally loaded via `hasGoogleAuth()` guard |
| Session with user.id and plan | `src/auth.ts` — JWT callbacks populate id, role, plan |
| Safe fallback without credentials | `src/auth.ts` — Credentials provider always available; Google only loaded if env vars present |
| Sign-in page | `src/app/sign-in/page.tsx` — Email-only credentials form |
| NextAuth routes | `src/app/api/auth/[...nextauth]/route.ts` |

### Core Feature: Ingredient → Meal Ideas
| Requirement | Implementation |
|---|---|
| Ingredient input with chips and autocomplete | `src/components/ingredients/ingredient-input.tsx` |
| Pantry basics toggle | `src/components/ingredients/ingredient-input.tsx` — toggle for salt/oil/pepper/butter/water |
| Must-use ingredient marking | `src/components/ingredients/ingredient-input.tsx` — ☆/★ toggle on chips |
| Leftover suggestion API | `src/app/api/suggestions/route.ts` + `src/lib/suggestions.ts` |
| LLM-backed suggestions with validation | `src/lib/suggestions.ts` — OpenAI API with Zod schema validation |
| Local fallback suggestions | `src/lib/suggestions.ts` — `fallbackIdeas()` used when no OPENAI_API_KEY |
| 5 meal ideas with cook time and confidence | `src/components/suggestions/meal-card.tsx` |
| Results page | `src/app/ingredients-to-meals/page.tsx` |
| Save meal idea | Via `/api/library/save` POST from ingredients-to-meals page |

### Core Feature: Recipe URL Extractor
| Requirement | Implementation |
|---|---|
| Recipe URL input page | `src/app/recipe-extractor/page.tsx` |
| Extract API route | `src/app/api/extract/route.ts` |
| JSON-LD recipe schema parsing | `src/lib/extractor.ts` — `parseRecipeSchema()` function |
| Readability fallback parsing | `src/lib/extractor.ts` — `extractWithReadability()` using jsdom + @mozilla/readability |
| Normalized recipe model | `src/lib/types.ts` — ExtractedRecipe type |
| Clean recipe reader with checkable items | `src/components/recipes/clean-recipe-card.tsx` |
| Wake Lock API support | `src/components/recipes/clean-recipe-card.tsx` — navigator.wakeLock.request() |
| Save extracted recipe | Via `/api/library/save` POST from recipe-extractor page |

### Saved Library
| Requirement | Implementation |
|---|---|
| Save items for logged-in users | `src/app/api/library/save/route.ts` |
| Delete items | `src/app/api/library/[id]/route.ts` — DELETE handler |
| Library page with filters | `src/app/library/page.tsx` + `src/app/library/library-client.tsx` |
| Filter by type (recipes vs ideas) | `src/app/library/library-client.tsx` — all/recipes/ideas tabs |
| Search saved items | `src/app/library/library-client.tsx` — search form |
| Free tier: 5 item cap | `src/lib/usage.ts` — assertUsageAllowed("SAVE") checks savedItem count |

### History
| Requirement | Implementation |
|---|---|
| Ingredient search history | `src/app/api/suggestions/route.ts` — creates IngredientSearch record |
| Recipe extract history | `src/app/api/extract/route.ts` — creates RecipeExtract record |
| History API | `src/app/api/history/route.ts` — returns last 10 of each |
| History display | `src/app/account/page.tsx` — shows recent searches and extracts |

### Usage Limits (Freemium)
| Requirement | Implementation |
|---|---|
| Free users: 3 suggestions/day | `src/lib/usage.ts` — `FREE_LIMITS.suggestionsPerDay = 3` |
| Free users: 2 extracts/day | `src/lib/usage.ts` — `FREE_LIMITS.extractsPerDay = 2` |
| Free users: save 5 items | `src/lib/usage.ts` — `FREE_LIMITS.savedItems = 5` |
| Pro users: unlimited | `src/lib/usage.ts` — early return for non-FREE plan users |
| IP-based tracking for anon users | `src/lib/usage.ts` — identifier from x-forwarded-for + user-agent |

### Billing (Stripe)
| Requirement | Implementation |
|---|---|
| Stripe checkout | `src/app/api/stripe/checkout/route.ts` — monthly/yearly plans |
| Stripe customer portal | `src/app/api/stripe/portal/route.ts` |
| Stripe webhook handler | `src/app/api/webhooks/stripe/route.ts` — checkout.session.completed, subscription updated/deleted |
| Subscription sync to DB | Webhook handler updates User.plan and Subscription table |
| Billing helper | `src/lib/billing.ts` — lazy Stripe client initialization |
| Pricing page | `src/app/pricing/page.tsx` — free vs Pro comparison, monthly/annual toggle |
| Account billing management | `src/app/account/page.tsx` — manage billing button via portal |
| No crash without Stripe keys | `src/lib/billing.ts` — returns null, routes return 503 gracefully |

### Email (Resend)
| Requirement | Implementation |
|---|---|
| Welcome email | `src/lib/email.ts` — `sendWelcomeEmail()` (called on signIn) |
| Billing confirmation email | `src/lib/email.ts` — `sendBillingEmail()` (called in webhook) |
| No crash without Resend key | `src/lib/email.ts` — `getResend()` returns null, functions log and return |

### User Pages
| Requirement | Implementation |
|---|---|
| Homepage | `src/app/page.tsx` — dual-tool hero, feature showcase, demo results, FAQ, CTA |
| Ingredients-to-meals | `src/app/ingredients-to-meals/page.tsx` |
| Recipe extractor | `src/app/recipe-extractor/page.tsx` |
| Library | `src/app/library/page.tsx` |
| Pricing | `src/app/pricing/page.tsx` |
| Account | `src/app/account/page.tsx` — plan, usage stats, history, billing |
| Admin dashboard | `src/app/admin/page.tsx` — total users, new users, suggestion/extract counts, paid users, conversion rate |
| Sign in | `src/app/sign-in/page.tsx` |

### SEO / Marketing Pages
| Requirement | Implementation |
|---|---|
| /leftover-chicken-recipes | `src/app/leftover-chicken-recipes/page.tsx` |
| /leftover-rice-recipes | `src/app/leftover-rice-recipes/page.tsx` |
| /fridge-clean-out-recipes | `src/app/fridge-clean-out-recipes/page.tsx` |
| /recipe-without-the-blog | `src/app/recipe-without-the-blog/page.tsx` |
| /ingredients/[combo] programmatic pages | `src/app/ingredients/[combo]/page.tsx` — chicken-rice-onion, eggs-spinach-cheese |
| Sitemap | `src/app/sitemap.ts` |
| Robots.txt | `src/app/robots.ts` |
| Metadata on all pages | All page files export `metadata` with title and description |

### Layout and UI
| Requirement | Implementation |
|---|---|
| Header with nav | `src/components/layout/header.tsx` — mobile menu, auth state, user dropdown |
| Footer with links | `src/components/layout/footer.tsx` |
| Session provider | `src/components/providers.tsx` |
| Mobile-friendly design | All pages use responsive Tailwind classes |
| System font stack | `src/app/globals.css` — no network fonts |

### Deployment
| Requirement | Implementation |
|---|---|
| next.config.ts standalone output | `next.config.ts` — `output: "standalone"` |
| Dockerfile | `Dockerfile` — multi-stage with Prisma, OpenSSL, db push on startup |
| Zero-config startup | Default DATABASE_URL, AUTH_SECRET baked into Dockerfile |
| SQLite (not PostgreSQL) | `prisma/schema.prisma` — provider = "sqlite" |
| binaryTargets for Debian | `prisma/schema.prisma` — `["native", "debian-openssl-3.0.x"]` |

## Intentionally Deferred (Require External Credentials)

1. **AI meal suggestions** — OPENAI_API_KEY needed for LLM-powered results. Deterministic fallback suggestions work without it. See `HUMAN_INPUT_NEEDED.md`.

2. **Stripe billing** — STRIPE_SECRET_KEY and price IDs needed for actual checkout. UI renders fully, checkout returns 503 gracefully without keys. See `HUMAN_INPUT_NEEDED.md`.

3. **Email sending** — RESEND_API_KEY needed. All email functions log and skip gracefully without it. See `HUMAN_INPUT_NEEDED.md`.

4. **Google OAuth** — GOOGLE_CLIENT_ID/SECRET needed. Email-only credentials sign-in works without it. See `HUMAN_INPUT_NEEDED.md`.

## Build Verification

- `npm run build` passes with 0 TypeScript errors ✓
- All 28 pages/routes render without crash ✓
- Dev server starts and serves all primary routes ✓
- Suggestions API returns 5 meal ideas (fallback mode) ✓
- Sign-in, pricing, library pages all load correctly ✓
