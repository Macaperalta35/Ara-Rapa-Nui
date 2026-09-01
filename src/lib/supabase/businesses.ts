import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import type { Business } from "@/lib/types/business";

export async function getApprovedBusinesses(): Promise<Business[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getApprovedBusinesses:", error.message);
    return [];
  }
  return data ?? [];
}
