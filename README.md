# Trippr — AI Travel Concierge

Text what you want. Get the perfect trip. Trippr is your AI travel concierge that knows your points, your cards, and how you like to fly — so you never leave money on the table.

## What it does

Trippr lets you describe a trip in plain English and returns a fully optimized itinerary that factors in your loyalty program balances, credit card perks, and personal travel preferences. Chat back and forth to refine the plan, then save your itinerary to a personal dashboard.

**Key features:**
- Conversational chat UI powered by Claude AI
- Loyalty program tracking (airline miles, hotel points)
- Credit card perk maximizer (travel multipliers, annual credits)
- Personalized preferences (seat, hotel style, flight time, budget)
- Inline itinerary cards with flight/hotel breakdowns and points allocation
- Saved trips dashboard

## Running locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Neon, Supabase, or local)
- An Anthropic API key

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env example and fill in values
cp .env.example .env.local

# 3. Run database migrations
npx prisma migrate dev --name init

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up to get started.

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon serverless format) |
| `AUTH_SECRET` | Random secret for NextAuth JWT signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3000` locally) |
| `ANTHROPIC_API_KEY` | Your Claude API key from console.anthropic.com |

## Deploying to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the environment variables in the Vercel dashboard
4. Set the build command to: `npx prisma migrate deploy && npx prisma generate && next build`
5. Deploy

The app uses Neon's serverless PostgreSQL driver which works natively on Vercel's serverless functions.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (custom dark luxury theme)
- **Prisma 7** with Neon PostgreSQL adapter
- **NextAuth v5** (credentials provider, JWT sessions)
- **Anthropic Claude** via `@anthropic-ai/sdk`
- **Lucide React** for icons
- **Google Fonts** (Playfair Display + DM Sans)
