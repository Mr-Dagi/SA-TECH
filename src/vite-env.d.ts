/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_ALLOWED_ASSET_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}