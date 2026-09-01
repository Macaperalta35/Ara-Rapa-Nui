import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import type { Review, ReviewTargetType } from "@/lib/types/review";

export async function getApprovedReviews(
  targetType: ReviewTargetType,
  targetId: string,
): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("getApprovedReviews:", error.message);
    return [];
  }
  return data ?? [];
}

export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
