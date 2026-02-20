## BUILD SPEC (paste into markdown file)

---

## VIDEO CHECKLIST (70 min)

| Phase | Time | Actions |
|-------|------|---------|
| **Setup** | 8 min | Create Next.js app → init git → push to GitHub → import to Vercel |
| **Supabase** | 8 min | Create project → copy keys to .env.local → create tables (links, clicks) → enable RLS |
| **Auth** | 12 min | Login/signup pages → connect Supabase auth → test flow |
| **Dashboard** | 12 min | Layout + sidebar → fetch user's links → "Create Link" form → insert to DB |
| **Analytics** | 10 min | Click tracking table → display click counts per source → simple chart |
| **Redirect** | 8 min | /[slug] route → log click → redirect to original URL |
| **Deploy** | 7 min | Push → Vercel auto-deploys → add env vars → update Supabase redirect URLs |
| **Demo** | 5 min | Full flow test live: signup → create link → click it → see analytics |

---

**What makes it impressive:**
- Real working SaaS in 70 min
- Auth, DB, analytics, deployment – full stack
- Educational: git, env vars, RLS, dynamic routes
- Practical use case everyone understands

**Skip:** Stripe, drag-drop, fancy UI polish, AI features
