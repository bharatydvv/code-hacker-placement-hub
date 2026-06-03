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

## Supabase setup

1. Create a project at https://supabase.com.
2. In the SQL editor, run the migrations in order, then the seed:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/seed.sql`
3. Enable the **Google** provider under Authentication → Providers, and add
   `https://YOUR_DOMAIN/auth/callback` (and the localhost equivalent) to the redirect URLs.
4. Copy the Project URL and anon/service keys into `.env.local`.
5. Promote yourself to admin:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
   ```

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Set the environment variables from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`).
   Set `NEXT_PUBLIC_SITE_URL` to your production domain so SEO/sitemap/OG URLs are correct.
3. Deploy — `next build` and output are auto-detected.
4. In Supabase, add the production domain to the OAuth redirect URLs.

## SEO

- Per-route dynamic metadata (homepage, subjects, companies, resources) with Open Graph + Twitter cards.
- Dynamic OG image at `src/app/opengraph-image.tsx`.
- `sitemap.ts` (subjects, companies, published resources) and `robots.ts`.
- JSON-LD: `EducationalOrganization` (global), `Course` (subjects/companies), `Article` (resources), `FAQPage` (companies).
