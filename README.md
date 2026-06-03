# Code Hacker Placement Hub

Premium SaaS platform for CS placement preparation. Subject-wise and company-wise study material, interview questions, PYQs, aptitude resources, a student dashboard, and a database-driven admin CMS.

Built with **Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Supabase**. Deployable on Vercel.

## Status

Implemented in phases on `feat/phase-1-foundation` (and follow-up branches):

- **Phase 1** — Next.js 15 setup, TypeScript, Tailwind, Shadcn UI, Framer Motion, design system, dark theme, premium animated homepage. *(this commit)*
- Phase 2 — Supabase integration, authentication, user roles.
- Phase 3 — Dynamic subject & company pages, resource library, search & filters.
- Phase 4 — Student dashboard, bookmarks, recent activity.
- Phase 5 — Admin CMS, resource management, bulk CSV/XLSX import, analytics.
- Phase 6 — SEO, performance optimization.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

App runs at http://localhost:3000.

## Environment variables

See `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run lint` — lint

## Architecture

- App Router with route groups: `(marketing)`, `(auth)`, `(app)` dashboard, `(admin)` CMS.
- React Server Components by default; client components only for interactivity/animation.
- Supabase Postgres + RLS. Google Drive stores only the actual PDFs; the database stores metadata + the Drive link.
- Resources auto-route to `/subjects/[slug]/[type]` and `/companies/[slug]/[type]` purely from data.

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Set the environment variables from `.env.example`.
3. Deploy. Default build command `next build` and output are auto-detected.
