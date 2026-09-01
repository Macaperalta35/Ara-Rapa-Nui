import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** For /cuenta pages that require a logged-in customer. */
export async function requireCustomerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");

  // Staff accounts land in the admin panel instead, even if they reach
  // /cuenta directly (e.g. an old bookmark).
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (profile) redirect("/admin");

  return user;
}
