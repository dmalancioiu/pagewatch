import {
  createClient,
  dist_exports
} from "./chunk-VK2CBFCN.mjs";
import {
  __name,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// trigger/lib/supabase.ts
init_esm();
function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase admin env vars");
  }
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
__name(createAdminSupabase, "createAdminSupabase");
export {
  createAdminSupabase
};
//# sourceMappingURL=supabase.mjs.map
