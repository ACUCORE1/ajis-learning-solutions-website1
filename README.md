# AJIS Learning Solutions

Responsive React, Vite and TypeScript website for AJIS Learning Solutions.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

The public pages can be explored without backend credentials. Public forms require a configured Supabase project and will show an error instead of pretending to submit when the backend is unavailable.

## Supabase setup

1. Create a Supabase project and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
2. Apply `supabase/schema.sql` in the Supabase SQL editor or with the Supabase CLI.
3. Deploy `supabase/functions/submit-form` with JWT verification enabled.
4. Configure Edge Function secrets: `SUPABASE_SERVICE_ROLE_KEY`, `APP_ORIGIN`, `AJIS_PUBLIC_URL`, `AJIS_NOTIFICATION_EMAIL`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`. Email delivery is optional; database submissions still work when Resend is not configured.
5. Create an authorised user in Supabase Auth, then add that user to `public.ajis_admins` from the SQL editor. Never expose the service-role key in the browser.

The admin page is available at `/admin`. Row-level security restricts learner and contact records to authorised AJIS administrators. The Edge Function validates and stores public form submissions server-side.

## GitHub Pages

The `Deploy to GitHub Pages` workflow publishes the production site on pushes to `main`. It builds the app with the repository base path and includes an SPA fallback for direct page links. The expected public URL is `https://acucore1.github.io/ajis-learning-solutions-website1/` after the first successful Actions deployment.

For online form submissions, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository Actions variables (Settings → Secrets and variables → Actions → Variables). These are public frontend configuration values; never add the Supabase service-role key to the website or build variables.

## Project notes

- Tuition registration questions, options, required fields and terms were read from the supplied Google Form.
- The source form’s terms include `+447853237530`, which conflicts with the official contact number supplied for the website (`+44 7882 665968`). The source wording is retained in the registration flow; confirm which number should appear there before launch.
- No AJIS logo, founder portrait, testimonials, article content, or social profiles were supplied. The site uses a wordmark, learning photography, and honest empty states instead of inventing these assets or claims.
- Article and testimonial tables are ready for future content management. No fabricated stories or statistics are published.