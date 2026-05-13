# HUMAN INPUT NEEDED

The app runs fully without any of these credentials. External services degrade gracefully to local fallbacks.

---

## Required for Production Use

### 1. AUTH_SECRET
- **What**: Random secret for NextAuth session signing
- **How**: `openssl rand -base64 32`
- **Set in**: Coolify environment variables as `AUTH_SECRET`
- **Default**: A weak default is baked into the Dockerfile — replace before production

### 2. DATABASE_URL
- **What**: SQLite database path (default: `/data/app.db` inside container)
- **How**: `DATABASE_URL=file:/data/app.db` (the Dockerfile default works automatically)
- **Note**: The container initializes the DB on first start via `prisma db push`

---

## Optional — for AI Meal Suggestions

### 3. OPENAI_API_KEY
- **What**: OpenAI API key for LLM-powered meal suggestions
- **How**: Get from https://platform.openai.com/api-keys
- **Set in**: `OPENAI_API_KEY=sk-...`
- **Fallback**: Without this, the app uses local deterministic fallback suggestions (still functional)
- **Optional model override**: `OPENAI_MODEL=gpt-4o-mini` (default: `gpt-4.1-mini`)

---

## Optional — for Stripe Billing

### 4. STRIPE_SECRET_KEY
- **What**: Stripe secret key for payment processing
- **How**: Get from https://dashboard.stripe.com/apikeys
- **Set in**: `STRIPE_SECRET_KEY=sk_live_...`

### 5. STRIPE_WEBHOOK_SECRET
- **What**: Stripe webhook signing secret for verifying webhook events
- **How**: In Stripe dashboard, create a webhook to `https://yourdomain.com/api/webhooks/stripe` and copy the signing secret
- **Set in**: `STRIPE_WEBHOOK_SECRET=whsec_...`
- **Events to enable**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 6. STRIPE_PRICE_MONTHLY
- **What**: Stripe price ID for the monthly Pro plan ($4.99/month)
- **How**: Create a product and price at https://dashboard.stripe.com/products
- **Set in**: `STRIPE_PRICE_MONTHLY=price_...`

### 7. STRIPE_PRICE_YEARLY
- **What**: Stripe price ID for the annual Pro plan ($29/year)
- **How**: Create a product and price at https://dashboard.stripe.com/products
- **Set in**: `STRIPE_PRICE_YEARLY=price_...`

### 8. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **What**: Stripe publishable key (public, safe for browser)
- **How**: Get from https://dashboard.stripe.com/apikeys
- **Set in**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`

---

## Optional — for Transactional Email

### 9. RESEND_API_KEY
- **What**: Resend API key for sending welcome and billing emails
- **How**: Get from https://resend.com/api-keys
- **Set in**: `RESEND_API_KEY=re_...`
- **Fallback**: Without this, emails are skipped and logged to console (no crash)

### 10. RESEND_FROM_EMAIL
- **What**: Sender address for emails
- **Example**: `FridgeMeal <noreply@fridgemeal.app>`
- **Note**: Must be a verified domain in Resend

---

## Optional — for Google OAuth

### 11. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- **What**: Google OAuth credentials for "Sign in with Google"
- **How**: Create OAuth 2.0 credentials at https://console.cloud.google.com/apis/credentials
- **Callback URL**: `https://yourdomain.com/api/auth/callback/google`
- **Fallback**: Without these, the sign-in page uses email-only credentials (still functional)

---

## Optional — for Admin Access

### 12. ADMIN_EMAILS
- **What**: Comma-separated list of emails that can access `/admin`
- **Example**: `ADMIN_EMAILS=you@example.com,team@example.com`
- **Default**: No admin access if not set

---

## App URL

### 13. NEXT_PUBLIC_APP_URL
- **What**: Public base URL of the deployed app
- **Example**: `NEXT_PUBLIC_APP_URL=https://fridgemeal.app`
- **Used for**: Stripe redirect URLs, email links, og:image base URL
