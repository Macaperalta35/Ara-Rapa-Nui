"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createBusinessPaymentPreference } from "@/lib/mercadopago/create-preference";
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

export type SubmitBusinessResult = { error: string } | { businessId: string; paymentUrl: string };

/**
 * Creates the business listing (pending review + unpaid), then returns a
 * Mercado Pago (or mock) checkout URL for the listing fee — mirrors the
 * order checkout flow in src/lib/actions/checkout.ts.
 */
export async function submitBusiness(formData: FormData): Promise<SubmitBusinessResult> {
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

  const { data: settings } = await supabase
    .from("site_settings")
    .select("business_listing_fee_clp")
    .eq("id", 1)
    .maybeSingle();
  const feeClp = settings?.business_listing_fee_clp ?? 15000;

  const { data: business, error } = await supabase
    .from("businesses")
    .insert({
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
      listing_fee_clp: feeClp,
    })
    .select()
    .single();

  if (error || !business) {
    return { error: "No pudimos enviar tu publicación. Intenta nuevamente." };
  }

  try {
    const { initPoint, preferenceId } = await createBusinessPaymentPreference(business);
    if (preferenceId) {
      const { error: prefError } = await supabase
        .from("businesses")
        .update({ mp_preference_id: preferenceId })
        .eq("id", business.id);
      if (prefError) {
        console.error(`submitBusiness: failed to store mp_preference_id for ${business.id}:`, prefError.message);
      }
    }
    return { businessId: business.id, paymentUrl: initPoint };
  } catch (err) {
    console.error(`submitBusiness: payment preference creation failed for ${business.id}:`, err);
    return { error: "No pudimos iniciar el pago de la publicación. Intenta nuevamente en unos minutos." };
  }
}
