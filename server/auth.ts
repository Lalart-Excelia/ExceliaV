import { supabaseServer } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
