# May-Be Tours Cozumel — Website & Booking Manager

A booking website for May-Be Tours Cozumel: a public site where customers browse
and pay for tours online, plus an "Airbnb-host-style" admin dashboard for managing
reservations, taking manual bookings, and tracking revenue.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, Prisma (SQLite in dev),
Stripe Checkout, Resend for email, a lightweight custom admin login (JWT cookie).

## Getting started

```bash
npm install
npx prisma migrate dev --name init   # creates prisma/dev.db and applies the schema
npx prisma db seed                   # loads the 8 real tours + the admin user
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and
[http://localhost:3000/admin](http://localhost:3000/admin) for the booking manager.

**Admin login:** the email/password come from `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env` (defaults: `info@maybetours.com` /
`MayBeTours2026!`). Change the password in `.env` before re-seeding, or
just update it directly in the database later.

## Environment variables

Copy `.env.example` to `.env` and fill in what you have (Prisma's CLI only
auto-loads a file literally named `.env`, so that's what this project uses for
local dev — Next.js reads it too). Everything has a
safe fallback so the site runs end-to-end even before real keys are added:

| Variable | What happens if it's missing |
|---|---|
| `DATABASE_URL` | Required — SQLite file path for local dev |
| `AUTH_SECRET` | Required — random string signing admin sessions (`openssl rand -base64 32`) |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | Booking flow still works, but confirms instantly instead of charging a card, and shows a "payments being set up" notice |
| `STRIPE_WEBHOOK_SECRET` | Needed once Stripe keys are set, so the webhook can verify Stripe's requests |
| `RESEND_API_KEY` | Emails are logged to the console instead of sent |

### Turning on real Stripe payments

1. Get your **test mode** keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys)
   and put them in `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`.
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` (requires the
   [Stripe CLI](https://stripe.com/docs/stripe-cli)) and copy the `whsec_...` value
   it prints into `STRIPE_WEBHOOK_SECRET`.
3. Restart `npm run dev`. Book a tour and pay with Stripe's test card
   `4242 4242 4242 4242`, any future expiry/CVC.
4. When ready to go live, switch to live-mode keys and set up a webhook endpoint
   in the Stripe dashboard pointing at `https://yourdomain.com/api/stripe/webhook`.

### Turning on real emails

Create a free [Resend](https://resend.com) account, verify a sending domain (or
use their test domain while developing), and set `RESEND_API_KEY` + `EMAIL_FROM`.

## Database: moving from SQLite to Postgres for production

SQLite is great for local dev but isn't suited to most production hosts (its
file disappears on redeploy). To move to Postgres:

1. Create a free Postgres database — [Neon](https://neon.tech),
   [Supabase](https://supabase.com), or Vercel Postgres all work well.
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` to the Postgres connection string in your deployment's
   environment variables.
4. Run `npx prisma migrate deploy` once against the new database, then
   `npx prisma db seed` to load the tour catalog and admin user.

No other code changes are needed — the schema only uses Postgres-compatible types.

## Deploying

The app is a standard Next.js app, so [Vercel](https://vercel.com) is the easiest
target: push to a Git repo, import it in Vercel, set the environment variables
above (with a Postgres `DATABASE_URL`), and deploy. Don't forget to point the
Stripe webhook at your production URL once it's live.

## Project structure

- `app/(site)/` — public marketing site (home, tour listing/detail, booking confirmation)
- `app/(admin)/admin/` — booking manager dashboard (`(protected)/` requires login)
- `app/api/` — booking creation, Stripe webhook, and all `/api/admin/*` CRUD routes
- `lib/` — Prisma client, availability/pricing logic, session auth, Stripe/email clients
- `prisma/` — schema, seed script, and the real tour catalog (`tours-data.ts`)
- `components/site/` and `components/admin/` — UI building blocks

## Known simplifications (tune these in `/admin/tours` or the code as the business needs)

- **Daily capacity for short add-ons** (jet ski, banana boat): since these run many
  short sessions per day rather than one trip, `dailyCapacity` is an estimate of
  daily throughput, not a literal single-ride headcount. Adjust it in `/admin/tours`
  to match real fleet size.
- **Private charters** (El Cielo private catamaran, both private snorkeling boats)
  are modeled as one exclusive booking per calendar day. If the business starts
  running two private charters a day (AM/PM), that needs a time-slot concept added
  to the data model — flag it and we can extend `Booking`/`Tour` for it.
- **Single language (English)** — the real-world audience is mostly English-speaking
  visitors; a Spanish version can be added later with `next-intl` or similar if needed.
