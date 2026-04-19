import { createBrowserClient } from "@supabase/ssr";

// Use process.env directly — Next.js inlines NEXT_PUBLIC_* at build time
// Do NOT use the env wrapper here (process.env as an object is empty in the browser)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default createClient
