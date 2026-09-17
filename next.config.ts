import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Vercel n’expose automatiquement au navigateur que les variables NEXT_PUBLIC_*.
    // On recopie donc les noms utilisés par l’intégration Supabase si besoin.
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.SUPABASE_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
