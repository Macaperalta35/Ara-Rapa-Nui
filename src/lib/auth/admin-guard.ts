import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? user : null;
}

/** For page/layout components: redirects to /admin/login if not an admin. */
export async function requireAdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For Server Actions: throws instead of redirecting (see Next's data-security guide). */
export async function requireAdminAction() {
  const user = await getAdminUser();
  if (!user) throw new Error("No autorizado.");
  return user;
}
