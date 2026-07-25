Deployment to Supabase Hosting
=============================

This document describes two ways to deploy the built project to Supabase Hosting: using GitHub Actions (recommended for CI) or manually via the Supabase Dashboard/CLI.

Prerequisites
- A Supabase project (URL and publishable key available).
- A GitHub repository connected to this project (for GitHub Actions path).

Quick local deploy (manual upload)
1. Build the site locally:
```bash
npm run build
```
2. Open your Supabase project → Hosting → Sites, create a new site (or open an existing one) and upload the `dist` folder as the site content.

Deploy via GitHub Actions (recommended)
1. Add the workflow file `.github/workflows/deploy-supabase.yml` (already included in this repo).
2. Create the following GitHub repository secrets:
  - `SUPABASE_ACCESS_TOKEN` — your Supabase personal access token.
  - `SUPABASE_PROJECT_REF` — your project's ref (found in the Supabase project URL; e.g., `rgxhqvxhnhzwsnyikvok`).
  - `SUPABASE_SITE_NAME` — the site identifier in Supabase Hosting (create one in the Hosting UI first or use an existing site name).
3. Push to `main`. The workflow will run, build the app, and deploy `./dist` to your Supabase site.

How to get a personal access token
1. In Supabase, go to Account → Settings → Personal Access Tokens (or similar). Create a token and copy it.
2. Store it in GitHub Secrets as `SUPABASE_ACCESS_TOKEN`.

If you prefer me to perform the deploy from this machine, run `supabase login` in this terminal to authenticate the CLI interactively, then tell me and I'll run the deploy command here.

Security notes
- Do NOT commit tokens into the repo. Use GitHub Secrets or the Supabase Dashboard to store credentials.
- Configure Row-Level Security (RLS) for any table that accepts public writes (e.g., `public.contacts`) and create appropriate policies.
