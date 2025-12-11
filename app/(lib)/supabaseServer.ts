import { createClient } from "@supabase/supabase-js";

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,          // URL can be public
  process.env.SUPABASE_SERVICE_ROLE_KEY!,         // VERY SENSITIVE
  {
    auth: {
      persistSession: false,
    },
  }
);
