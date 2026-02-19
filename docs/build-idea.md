# LinkTrack – URL Attribution Analytics

## What it does
Create shortened links with source tracking. See which traffic sources (Twitter, YouTube, Email, etc.) drive the most clicks.

## Tech Stack
- Next.js 14 (App Router, TypeScript, Tailwind)
- Supabase (Auth + Postgres)
- Vercel (Deployment)
- OpenRouter (optional AI features)

## Core Features
1. User auth (email/password via Supabase)
2. Create short links with custom slugs
3. Add source tags (utm-style) per link
4. Track clicks with timestamp + country/referrer
5. Dashboard showing click analytics per source
6. Public redirect route that logs + redirects

## Database Tables
- users (handled by Supabase auth)
- links (id, user_id, original_url, slug, created_at)
- clicks (id, link_id, source_tag, timestamp, country, referrer)

## Routes
- / → Landing
- /login, /signup → Auth
- /dashboard → User's links + analytics
- /[slug] → Public redirect (logs click, redirects)
