import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import type { Package, Experience, Product } from "@/lib/types/catalog";

// Every function here returns an empty result instead of throwing when
// Supabase isn't configured yet, so the site stays browsable while the
// user sets up their project (see .env.example).

export async function getPackages(): Promise<Package[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getPackages:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) {
    console.warn("getPackageBySlug:", error.message);
    return null;
  }
  return data;
}

export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getExperiences:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) {
    console.warn("getExperienceBySlug:", error.message);
    return null;
  }
  return data;
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) {
    console.warn("getProductBySlug:", error.message);
    return null;
  }
  return data;
}
