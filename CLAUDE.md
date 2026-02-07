# BrewIQ

AI-powered beer discovery platform. Scan beers, write reviews, spot sightings, clone recipes, earn achievements.

## Project Structure

This is a monorepo with two main applications:

```
brewiq-api/     — Express.js + TypeScript backend (deployed on Railway)
brewiq-web/     — Next.js 14 + TypeScript frontend (deployed on Railway)
brewiq-content/ — Content generation skill/module
frontend/       — Legacy frontend (deprecated, do not modify)
```

## Tech Stack

### Backend (`brewiq-api`)
- **Runtime**: Node.js 18+, TypeScript, Express.js
- **Database**: PostgreSQL via Prisma ORM
- **Cache/Queue**: Redis (ioredis), BullMQ for background jobs
- **Auth**: JWT (access + refresh tokens), Passport.js (Google OAuth, GitHub OAuth)
- **AI**: Anthropic Claude (beer scanning, recipe generation), Google Gemini (image generation)
- **Storage**: Cloudinary (images)
- **Payments**: Stripe (subscriptions)
- **Email**: Resend
- **Realtime**: Socket.IO
- **Validation**: Zod

### Frontend (`brewiq-web`)
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, Lucide icons, CVA (class-variance-authority)
- **State**: Zustand (authStore, uiStore)
- **Data Fetching**: Axios (custom client with token refresh), React Query
- **Forms**: React Hook Form + Zod resolvers
- **Animations**: Motion (Framer Motion)

## Backend Architecture

### Module Pattern
Every feature follows `src/modules/{feature}/`:
- `{feature}.schema.ts` — Zod validation schemas
- `{feature}.service.ts` — Business logic (calls Prisma, external services)
- `{feature}.controller.ts` — Express handlers using `asyncHandler()` wrapper
- `{feature}.routes.ts` — Route definitions with middleware

**Modules**: auth, users, beers, breweries, reviews, sightings, scans, recipes, achievements, lists, checkins, notifications, leaderboard, subscriptions, images

### Shared Services (`src/services/`)
- `claude.service.ts` — Beer scanning (single/menu/shelf), clone recipe generation via Claude Sonnet
- `gemini.service.ts` — AI image generation (review images, avatars) via Gemini 2.5 Flash Image
- `upload.service.ts` — Cloudinary image upload/delete/optimize
- `email.service.ts` — Transactional emails via Resend
- `points.service.ts` — Gamification point system
- `recommendation.service.ts` — Personalized beer recommendations

### Middleware (`src/middleware/`)
- `auth.ts` — JWT authentication, adds `req.user` with `id`, `email`, `membershipTier`
- `rateLimiter.ts` — API-wide limiter, auth limiter, scan limiter (monthly), `tierRateLimiter()` (daily per feature)
- `validate.ts` — Zod schema validation for body/query/params
- `errorHandler.ts` — Global error handler + 404 handler

### Key Patterns
- All controllers use `asyncHandler()` from `src/utils/asyncHandler.ts`
- Errors use `ApiError` class with static factories: `.badRequest()`, `.notFound()`, `.forbidden()`, etc.
- Responses always wrapped: `{ success: true, data: ... }` or `{ success: true, data: [...], meta: { page, limit, total, ... } }`
- Config loaded via Zod-validated env vars in `src/config/index.ts`
- Database via `prisma` singleton from `src/config/database.ts`
- Redis via `redis` singleton from `src/config/redis.ts`

### Membership Tiers
Three tiers gate features: `FREE`, `PRO`, `UNLIMITED`. Rate limits vary by tier.

### Database
- PostgreSQL with Prisma ORM
- Schema at `prisma/schema.prisma`
- Use `npx prisma db push` for schema changes (no migration history — use `db push` not `migrate dev`)
- Population scripts in `prisma/` (seed.ts, populate-reviews.ts, populate-sightings.ts, add-ai-images.ts)

## Frontend Architecture

### App Router Structure (`app/`)
- `(auth)/` — Login, register, forgot-password, reset-password
- `(main)/` — Authenticated pages: profile/settings, beers, breweries, recipes, scan, sightings, leaderboard, notifications

### API Client (`lib/api/`)
- `client.ts` — Axios instance with auto token refresh on 401, base URL pointing to Railway API
- Feature-specific clients: `beers.ts`, `reviews.ts`, `scans.ts`, `images.ts`, `users.ts`, etc.
- Types in `lib/types/index.ts`

### Components (`components/`)
Organized by feature: `ui/`, `layout/`, `review/`, `beer/`, `brewery/`, `recipe/`, `scan/`, `sighting/`, `user/`, `home/`

### State Management
- `lib/stores/authStore.ts` — User auth state (Zustand)
- `lib/stores/uiStore.ts` — Toast notifications, UI state (Zustand)
- `lib/hooks/useAuth.ts` — Auth hook with `useRequireAuth()` for protected pages

### Image Domains
Configured in `next.config.mjs` remotePatterns: Railway API, Google avatars, GitHub avatars, Unsplash, Cloudinary

## Deployment

### Railway
Both services auto-deploy on push to `main`:
- **API**: `brewiq-api-production.up.railway.app`
- **Web**: `brewiq-web-production.up.railway.app`
- **DB**: PostgreSQL on Railway (internal: `postgres.railway.internal:5432`, public: `crossover.proxy.rlwy.net:52935`)
- **Redis**: Railway-managed

### Railway CLI
```bash
railway service brewiq-api    # Switch to API service context
railway service brewiq-web    # Switch to web service context
railway service Postgres      # Switch to DB service context
railway vars                  # View env vars
railway vars set KEY=VALUE    # Set env var
railway deployment list       # Check deploy status
railway logs                  # View logs
```

### Environment Variables (API)
Required: `DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ANTHROPIC_API_KEY`
Optional: `GEMINI_API_KEY`, `CLOUDINARY_*`, `STRIPE_*`, `GOOGLE_*`, `GITHUB_*`, `RESEND_API_KEY`

## Common Commands

```bash
# Backend (from brewiq-api/)
npm run dev                              # Start dev server
npx prisma db push                       # Push schema changes
npx prisma generate                      # Regenerate Prisma client
npx prisma studio                        # Open DB browser
npx tsx prisma/seed.ts                   # Seed database
npx tsx prisma/add-ai-images.ts          # Generate AI images for reviews
npx tsc --noEmit                         # Type check

# Frontend (from brewiq-web/)
npm run dev                              # Start dev server
npx next build                           # Production build (also type-checks)
```

## Git Repos
- API: `https://github.com/CuCryptos/brewiq-api.git`
- Web: `https://github.com/CuCryptos/brewiq-web.git`

Both are separate repos under the BrewIQ directory — commit and push separately.
