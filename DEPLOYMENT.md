# SA-Tech Startup Deployment

## Netlify

1. Push this repository to GitHub and import it into Netlify.
2. Keep the build command as `npm run build` and the publish directory as `dist`.
3. In Netlify project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Add `VITE_ADMIN_EMAILS` with the real Supabase Auth email for the admin account. The login username `mrx` maps to this configured email.
5. Never add `SUPABASE_SECRET_KEY`, a service-role key, or passwords to Vite variables.
6. Deploy. `netlify.toml` provides the SPA fallback needed for `/admin` and `/tlku` refreshes.

## Supabase

1. Create the admin user in Supabase Authentication with the configured email and a strong password. The username shown in the site is `mrx`; the password is entered only in Supabase Auth and the login form, never in source code.
2. Set the user's `app_metadata.role` to `admin` using a trusted server-side/admin workflow.
3. Apply the migration in `supabase/migrations/20260821035120_secure_public_content_policies.sql`.
4. Enable leaked-password protection in Supabase Authentication settings.
5. Run the Supabase security advisors after applying the migration and confirm no public table is readable without its intended policy.

The browser only receives the publishable/anon key. RLS is the enforcement boundary for projects, blogs, settings, messages, and contacts.