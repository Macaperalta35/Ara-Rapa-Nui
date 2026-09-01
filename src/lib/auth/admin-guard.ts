import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AdminRole = "admin" | "superadmin";

async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  return { user, role: profile.role as AdminRole };
}

/** For page/layout components: redirects to /admin/login if not an admin. */
export async function requireAdminPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For Server Actions: throws instead of redirecting (see Next's data-security guide). */
export async function requireAdminAction() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("No autorizado.");
  return admin;
}

/** For pages that only superadmins may reach (e.g. managing other admins). */
export async function requireSuperAdminPage() {
  const admin = await requireAdminPage();
  if (admin.role !== "superadmin") redirect("/admin");
  return admin;
}

/** For Server Actions that only superadmins may invoke. */
export async function requireSuperAdminAction() {
  const admin = await requireAdminAction();
  if (admin.role !== "superadmin") throw new Error("Solo un superadmin puede hacer esto.");
  return admin;
}
