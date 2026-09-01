"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import type { ReviewTargetType, ReviewStatus } from "@/lib/types/review";

const schema = z.object({
  target_type: z.enum(["package", "experience", "product", "vehicle_rental", "business"]),
  target_id: z.string().uuid(),
  customer_name: z.string().trim().min(2, "Nombre muy corto"),
  customer_email: z.string().trim().email("Correo inválido"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export type SubmitReviewState = { error?: string; success?: boolean } | undefined;

export async function submitReview(
  _prevState: SubmitReviewState,
  formData: FormData,
): Promise<SubmitReviewState> {
  const parsed = schema.safeParse({
    target_type: formData.get("target_type"),
    target_id: formData.get("target_id"),
    customer_name: formData.get("customer_name"),
    customer_email: formData.get("customer_email"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").insert({
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    customer_name: parsed.data.customer_name,
    customer_email: parsed.data.customer_email,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });

  if (error) {
    return { error: "No pudimos enviar tu reseña. Intenta nuevamente." };
  }

  return { success: true };
}

export async function updateReviewStatus(reviewId: string, status: ReviewStatus, targetType: ReviewTargetType) {
  await requireAdminAction();
  const supabase = createAdminClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/resenas");
  revalidatePath(`/catalogo/${categoryPath(targetType)}`);
}

function categoryPath(type: ReviewTargetType) {
  switch (type) {
    case "package":
      return "paquetes";
    case "experience":
      return "experiencias";
    case "vehicle_rental":
      return "vehiculos";
    default:
      return "productos";
  }
}
