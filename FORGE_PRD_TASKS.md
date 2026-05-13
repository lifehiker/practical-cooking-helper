# FORGE PRD TASKS: Practical Cooking Helper

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

## Phase 1: Foundation
- [x] Read `PRD.md` and `BUILD_INSTRUCTIONS.md` end-to-end
- [x] Audit repository state and identify existing gaps
- [x] Scaffold Next.js app with App Router, TypeScript, Tailwind, and standalone build output
- [x] Install runtime dependencies for auth, database, forms, parsing, billing, email, and UI
- [x] Define app information architecture, route map, metadata strategy, and shared design system
- [x] Add environment example and runtime-safe env helpers
- [x] Add Docker-ready configuration and deployment-safe defaults

## Phase 2: Data Model and Persistence
- [x] Define Prisma schema for users, auth sessions/accounts, subscriptions, usage events, saved items, ingredient history, recipe history, and admin analytics support
- [x] Add Prisma client singleton and migration / db push workflow
- [x] Choose safe local persistence fallback (SQLite)
- [x] Seed or hardcode common ingredient/autocomplete data

## Phase 3: Auth and Access Control
- [x] Configure NextAuth/Auth.js with credentials provider (always) and Google provider (guarded by env)
- [x] Add safe local/demo auth fallback so the app still runs without Google credentials
- [x] Implement auth routes, session helpers, and protected-page gating
- [x] Add sign-in and account entry points in the UI
- [x] Support admin access checks via ADMIN_EMAILS env var

## Phase 4: Core Suggestion Workflow
- [x] Build homepage hero and dual-tool entry UX
- [x] Build ingredient entry flow with chips, autocomplete, pantry toggle, and must-use prioritization
- [x] Implement leftover suggestion generation API/server action
- [x] Add deterministic local-safe suggestion fallback when external AI credentials are unavailable
- [x] Enforce daily usage limits for free users and unlimited behavior for paid users
- [x] Save ingredient-search history for logged-in users
- [x] Build results UI with five meal ideas, confidence, cook time, description, and missing optional ingredients

## Phase 5: Recipe Extraction Workflow
- [x] Build recipe extractor page with URL input and polished loading/error states
- [x] Implement remote HTML fetch and extraction pipeline
- [x] Parse `application/ld+json` recipe data first
- [x] Add Readability / heuristic fallback parsing
- [x] Normalize extracted recipe fields into a clean internal model
- [x] Save recipe extraction history for logged-in users
- [x] Enforce extraction usage limits for free users
- [x] Build clean recipe reader with checkable ingredients, steps, and wake lock toggle

## Phase 6: Saved Library and Secondary User Workflows
- [x] Implement save/unsave actions for meal ideas and extracted recipes
- [x] Enforce free-tier saved-item cap and pro unlimited behavior
- [x] Build saved library with search and type filters
- [x] Build recent history views for ingredient runs and recipe URLs
- [x] Add pricing page and account/billing management surface
- [x] Add basic admin dashboard for signups, usage, and conversions

## Phase 7: Billing, Email, and External Integrations
- [x] Add Stripe checkout flow with lazy initialization and missing-env guards
- [x] Add Stripe customer portal / billing management path
- [x] Add Stripe webhook handler and subscription sync model
- [x] Add transactional email service with lazy initialization and fallback logging
- [x] Send welcome email and billing-related email hooks when credentials are available
- [x] Document only true external credential requirements in `HUMAN_INPUT_NEEDED.md`

## Phase 8: Marketing, SEO, and Content Pages
- [x] Build polished homepage with strong value proposition and conversion paths
- [x] Build `/ingredients-to-meals`
- [x] Build `/recipe-extractor`
- [x] Build `/leftover-chicken-recipes`
- [x] Build `/leftover-rice-recipes`
- [x] Build `/fridge-clean-out-recipes`
- [x] Build `/recipe-without-the-blog`
- [x] Build programmatic ingredient pages including `/ingredients/chicken-rice-onion` and `/ingredients/eggs-spinach-cheese`
- [x] Add metadata, sitemap, robots, and structured data

## Phase 9: Deployment and Verification
- [x] Run `npm run build` and fix all build issues ✓
- [x] Start the dev server and confirm it boots cleanly ✓
- [x] Smoke-test primary routes and interactive flows ✓
- [x] Create production-ready Dockerfile using Next standalone output ✓
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to concrete implementation files ✓
- [x] Confirm all non-external requirements are implemented before declaring `FORGE_BUILD_COMPLETE` ✓
