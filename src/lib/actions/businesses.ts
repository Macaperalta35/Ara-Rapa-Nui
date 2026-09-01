"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_CATEGORIES } from "@/lib/types/business";

const categoryValues = BUSINESS_CATEGORIES.map((c) => c.value) as [string, ...string[]];

const schema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto"),
  category: z.enum(categoryValues),
  description: z.string().trim().min(20, "Cuéntanos un poco más (mínimo 20 caracteres)"),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  location: z.string().trim().optional(),
  website_url: z.string().trim().optional(),
  instagram_url: z.string().trim().optional(),
  facebook_url: z.string().trim().optional(),
  hours: z.string().trim().optional(),
  cover_image_url: z.string().trim().optional(),
  contact_email: z.string().trim().email("Correo inválido"),
});

export type SubmitBusinessState = { error?: string; success?: boolean } | undefined;

export async function submitBusiness(
  _prevState: SubmitBusinessState,
  formData: FormData,
): Promise<SubmitBusinessState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    phone: formData.get("phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    location: formData.get("location") || undefined,
    website_url: formData.get("website_url") || undefined,
    instagram_url: formData.get("instagram_url") || undefined,
    facebook_url: formData.get("facebook_url") || undefined,
    hours: formData.get("hours") || undefined,
    cover_image_url: formData.get("cover_image_url") || undefined,
    contact_email: formData.get("contact_email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("businesses").insert({
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description,
    phone: parsed.data.phone ?? null,
    whatsapp: parsed.data.whatsapp ?? null,
    location: parsed.data.location ?? null,
    website_url: parsed.data.website_url ?? null,
    instagram_url: parsed.data.instagram_url ?? null,
    facebook_url: parsed.data.facebook_url ?? null,
    hours: parsed.data.hours ?? null,
    cover_image_url: parsed.data.cover_image_url ?? null,
    contact_email: parsed.data.contact_email,
  });

  if (error) {
    return { error: "No pudimos enviar tu publicación. Intenta nuevamente." };
  }

  return { success: true };
}
