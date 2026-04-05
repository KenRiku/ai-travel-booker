# CLAUDE.md — Developer Context for Trippr

## What this project is

Trippr is an AI-powered travel concierge web app built as an MVP prototype. Users describe their desired trip in plain English via a chat interface, and the app returns a fully optimized itinerary that accounts for their loyalty program balances (United Miles, Marriott Bonvoy, etc.), credit card travel perks (Chase Sapphire 3x, Amex Platinum 5x), and personal preferences (seat type, hotel style, budget). Itineraries are structured JSON parsed out of Claude's response and rendered as rich inline cards. Users can save trips to a dashboard and manage their travel profile.

## Architecture

```
/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Server-side API routes
│   ├── chat/               # Chat UI page
│   ├── dashboard/          # Saved trips dashboard
│   ├── login/              # Login page
│   ├── onboarding/         # 3-step onboarding wizard
│   ├── profile/            # Profile/settings page
│   ├── signup/             # Sign-up page
│   ├── generated/prisma/   # Auto-generated Prisma client (do not edit)
│   ├── globals.css         # Tailwind v4 theme + animations
│   ├── layout.tsx          # Root layout with fonts + SessionProvider
│   └── page.tsx            # Landing page
├── components/             # Shared React components (navbar, itinerary-card, session-provider)
├── lib/                    # Server-side utilities (Prisma singleton)
├── prisma/                 # Schema and migrations
├── auth.ts                 # NextAuth v5 configuration
└── proxy.ts                # Route protection middleware (Next.js 16 convention)
```

## Key files

| File | Responsibility |
|---|---|
| `auth.ts` | NextAuth config: credentials provider, bcrypt verify, JWT session with `user.id` |
| `proxy.ts` | Auth guard: redirects unauthenticated users away from `/dashboard`, `/chat`, `/profile`, `/onboarding` |
| `lib/prisma.ts` | Prisma singleton using `PrismaNeon` adapter for serverless-safe PostgreSQL |
| `prisma/schema.prisma` | Data model: User, LoyaltyProgram, CreditCard, Conversation, Message, Trip |
| `app/api/chat/route.ts` | Core AI endpoint: builds system prompt with user context, calls Claude, parses `<itinerary>` JSON blocks from response |
| `app/api/trips/route.ts` | GET/POST trips for the authenticated user |
| `app/api/profile/route.ts` | GET/PUT user profile (loyalty programs, cards, preferences) |
| `app/chat/page.tsx` | Chat UI: message history, auto-growing textarea, inline ItineraryCard rendering |
| `components/itinerary-card.tsx` | Renders structured itinerary with flights/hotels/points, Save Trip button |
| `components/navbar.tsx` | Authenticated navigation with mobile hamburger menu |
| `app/globals.css` | Tailwind v4 theme tokens (navy, gold, cream palette), animation keyframes, `.glass` utility |

## Data flow

**Chat request:**
1. User types in `app/chat/page.tsx` → sends POST to `/api/chat`
2. API route fetches user profile from DB (loyalty programs, cards, prefs)
3. Builds system prompt injecting user's points balances and card multipliers
4. Calls `claude-opus-4-5` via `@anthropic-ai/sdk`
5. Parses `<itinerary>...</itinerary>` XML block from response into JSON
6. Saves conversation + messages to DB
7. Returns `{ content, itinerary, conversationId }` to client
8. Chat page renders text + `<ItineraryCard>` inline

**Save trip:**
1. User clicks "Save Trip" in `ItineraryCard`
2. POST to `/api/trips` with itinerary JSON and conversationId
3. Creates `Trip` record in DB linked to the conversation
4. Button transitions to "Saved!" state

## Stack decisions

- **Next.js 16 App Router**: Full-stack in one repo; server components for data fetching; API routes for auth-gated endpoints
- **Prisma 7 + Neon adapter**: Prisma 7 requires explicit driver adapters; `PrismaNeon` works on serverless (no persistent TCP connections)
- **NextAuth v5 (beta)**: Credentials provider with bcrypt. JWT strategy (not DB sessions) to avoid extra DB round-trips. `session.user.id` is populated via `callbacks.session`
- **Anthropic Claude**: `claude-opus-4-5` model. Structured itinerary data is extracted via XML tags (`<itinerary>`) in the response
- **Tailwind CSS v4**: Uses `@theme` block in CSS (not `tailwind.config.js`). Custom tokens for the navy/gold/cream design system
- **No real-time streaming**: Chat waits for the full Claude response before rendering. Can be upgraded with Vercel AI SDK

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. Neon serverless format. Used in `prisma.config.ts` and `lib/prisma.ts`. |
| `AUTH_SECRET` | Secret key for signing NextAuth JWT tokens. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Full URL of the app. Required by NextAuth for redirects. `http://localhost:3000` in dev. |
| `ANTHROPIC_API_KEY` | API key for the Anthropic Claude API. Get from `console.anthropic.com`. |

## How to run locally

```bash
npm install                              # installs deps + runs prisma generate
cp .env.example .env.local               # then fill in real values
npx prisma migrate dev --name init       # creates DB tables
npm run dev                              # starts on http://localhost:3000
```

## Known quirks

- **`proxy.ts` instead of `middleware.ts`**: Next.js 16 renamed the middleware file convention to `proxy.ts`. The auth guard lives there.
- **Prisma client output**: The generated client is at `app/generated/prisma/`. The `postinstall` script runs `prisma generate` automatically after `npm install`.
- **`prisma.config.ts`**: Prisma 7 uses this file for configuration instead of `datasource.url` in `schema.prisma`. The `DATABASE_URL` env var is read here.
- **AI itinerary parsing**: The AI is prompted to wrap JSON in `<itinerary>` XML tags. If the AI doesn't include tags (for conversational replies), no itinerary card is rendered.
- **No real flight data**: All itinerary content is AI-generated and clearly labeled as estimated.

## What's NOT implemented

- **Real booking**: No actual booking or payment flow — itinerary is suggestions only
- **Live loyalty balance sync**: Users self-report balances; no API integrations with airlines/hotels
- **Response streaming**: Chat waits for the full Claude response (not streamed)
- **WhatsApp channel**: Planned for future phase
- **Premium paywall**: `isPremium` flag exists on User model but no Stripe integration
- **Email verification**: No email confirmation on sign-up
- **Rate limiting**: No per-user rate limiting on `/api/chat`
- **Automated tests**: Manual QA only; no test suite
