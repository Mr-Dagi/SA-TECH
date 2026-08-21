# SA-Tech Startup
## Cleanup, Security, and Deployment Change Report

Date: 2026-08-21

## Executive Summary

The active root Vite application was cleaned and rebranded from a personal portfolio into a company website for SA-Tech Startup. Personal identity content, the broken chatbot, obsolete backend/deployment artifacts, and old image assets were removed. Supabase authentication and data access were strengthened, the live database column naming mismatch was corrected in the frontend, and Netlify SPA deployment configuration was added.

## Step-by-Step Work Completed

### 1. Identified the production source

- Confirmed the active application is the root `src` directory.
- Treated `deploy_clean_repo` and `deploy_snapshot` as archived copies and did not use them as the production source.
- Checked the package scripts, Vite entrypoint, admin routes, Supabase client, assets, and deployment files.

### 2. Removed personal branding

- Replaced the personal hero name with `SA-Tech Startup`.
- Rewrote the home, About, contact, footer, translation, and admin reply language to use company voice: `we`, `our team`, and `SA-Tech Startup`.
- Removed personal profile, CV, founder, and personal social-link presentation from the active site.
- Updated page title, description, Open Graph metadata, and Twitter metadata for the company.

### 3. Changed the site image branding

- Made `public/sa_1_11zon.jpg` the single active company logo asset.
- Used the logo for the navbar, footer, favicon, social preview, home page, About page, and settings fallback.
- Removed the old personal portrait and superseded `sa.png` asset.
- Disabled changing the public logo through the settings form so an old database record cannot reintroduce a personal image.

### 4. Removed the broken chatbot

- Removed the chatbot from `src/App.tsx`.
- Deleted `ChatAssistant.tsx`.
- Deleted the chatbot knowledge-base text, PDF, and generator script.
- Removed chatbot-related dead content from the active production path.

### 5. Removed deployment and repository junk

Removed root artifacts that were not imported by the active static Vite app:

- Dockerfile and docker-compose configuration
- Nginx configuration
- Express server
- Prisma configuration and schema
- Postman collection
- Audit PDF
- Chatbot PDF and source files
- Server-only dependencies and unused Docker scripts

The existing archive folders were left untouched.

### 6. Secured admin authentication

- Confirmed the active app uses Supabase email/password authentication.
- Removed localStorage/demo-credential authentication from the active root app.
- Kept admin routes behind `ProtectedRoute` and Supabase session state.
- Added admin authorization through Supabase `app_metadata.role = admin` or the configured `VITE_ADMIN_EMAILS` allowlist.
- Added login rate limiting, cooldown, lockout handling, and input validation already present in the active login flow.
- Added `/admin` compatibility redirects to the existing protected `/tlku` dashboard routes.

### 7. Corrected Supabase data mapping

The live Supabase schema uses lowercase names such as `techstack`, `createdat`, `profileimage`, and `herotitle`, while the React model uses camelCase. Explicit adapters were added so reads and writes work correctly for:

- Projects
- Blog posts
- Messages
- Site settings
- Ratings and timestamps

This prevents admin saves and message ordering from failing after deployment.

### 8. Added Row-Level Security migration

Created:

`supabase/migrations/20260821035120_secure_public_content_policies.sql`

The migration provides:

- Public reads only for visible projects and published blogs.
- Public reads for site settings.
- Anonymous message/contact inserts only.
- Admin-only reads and mutations for messages and contacts.
- Admin-only project, blog, and settings mutations.
- Authorization based on `auth.jwt() -> app_metadata ->> 'role'`.
- Revocation of public execution for the flagged `rls_auto_enable()` function.

The available Supabase SQL connection was read-only during this work, so the migration was prepared and verified locally but was not applied remotely.

### 9. Added deployment configuration

Created `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback from every route to `/index.html`

Created `DEPLOYMENT.md` with Netlify and Supabase setup instructions, including environment variables and secret-handling rules.

Created `.env.example` with placeholder variable names only. Real credentials remain outside the repository.

### 10. Validation performed

Passed checks:

- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Active-root search for personal names, chatbot references, old image names, and demo credentials
- Supabase table inspection and security advisor inspection

The build still reports a non-blocking large JavaScript chunk warning. The production dependency audit reports two moderate React Router advisories and should be handled in a separate dependency upgrade review.

## Required Final Deployment Steps

1. Push the active root repository to GitHub.
2. Import it into Netlify.
3. Confirm Netlify uses `npm run build` and `dist`.
4. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ADMIN_EMAILS` in Netlify environment settings.
5. Create the real admin user in Supabase Auth.
6. Set that user's trusted `app_metadata.role` to `admin` using a server-side/admin workflow.
7. Apply `supabase/migrations/20260821035120_secure_public_content_policies.sql` with Supabase CLI or the SQL editor that has write permission.
8. Enable leaked-password protection in Supabase Auth.
9. Run Supabase security advisors again.
10. Test `/admin` and `/tlku` directly while logged out and logged in.
11. Test the public contact form and verify anonymous users cannot read messages.

## Security Rules

- Never put a service-role key, secret key, password, or access token in a Vite environment variable.
- Only the publishable/anon key belongs in the browser.
- Do not restore demo credentials.
- Keep admin authorization in trusted Supabase app metadata and RLS policies.
- Apply and verify the migration before accepting real production data.
