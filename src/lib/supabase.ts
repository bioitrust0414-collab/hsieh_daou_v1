import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Client is only created when both env vars are present. Callers should
// treat a missing client as "tracking disabled" rather than throwing, so a
// misconfigured deployment never breaks LIFF login itself.
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export interface LineUserRecord {
  line_user_id: string;
  display_name?: string;
  picture_url?: string;
  status_message?: string;
  is_in_client: boolean;
}

// Writes go through the `record_line_login` Postgres function (security
// definer), which does an atomic upsert + login_count increment. Anon only
// has EXECUTE on the function, not direct table access — the table itself
// stays unreadable and unwritable from the browser except through this path.
export async function recordLineLogin(record: LineUserRecord): Promise<void> {
  if (!supabase) return;

  try {
    const { error } = await supabase.rpc("record_line_login", {
      p_line_user_id: record.line_user_id,
      p_display_name: record.display_name ?? null,
      p_picture_url: record.picture_url ?? null,
      p_status_message: record.status_message ?? null,
      p_is_in_client: record.is_in_client,
    });
    if (error) throw error;
  } catch (err) {
    // Never let tracking failures break the LIFF login/UI flow.
    console.error("[supabase] recordLineLogin failed:", err);
  }
}
