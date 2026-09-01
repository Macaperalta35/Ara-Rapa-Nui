"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { THEME_COLOR_VARS } from "@/lib/supabase/site-settings";

const hexColor = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hex válido");

export async function updateSiteTheme(formData: FormData) {
  await requireAdminAction();

  const values: Record<string, string> = {};
  for (const { key } of THEME_COLOR_VARS) {
    values[key] = hexColor.parse(formData.get(key));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(values).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

const visibilitySchema = z.object({
  show_packages: z.coerce.boolean(),
  show_experiences: z.coerce.boolean(),
  show_products: z.coerce.boolean(),
  show_vehicle_rentals: z.coerce.boolean(),
  show_resident_products: z.coerce.boolean(),
  show_businesses: z.coerce.boolean(),
  show_special_request: z.coerce.boolean(),
});

export async function updateCategoryVisibility(formData: FormData) {
  await requireAdminAction();

  const parsed = visibilitySchema.parse({
    show_packages: formData.get("show_packages") === "on",
    show_experiences: formData.get("show_experiences") === "on",
    show_products: formData.get("show_products") === "on",
    show_vehicle_rentals: formData.get("show_vehicle_rentals") === "on",
    show_resident_products: formData.get("show_resident_products") === "on",
    show_businesses: formData.get("show_businesses") === "on",
    show_special_request: formData.get("show_special_request") === "on",
  });

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(parsed).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function updateBusinessFee(formData: FormData) {
  await requireAdminAction();

  const feeClp = z.coerce.number().int().min(0).parse(formData.get("business_listing_fee_clp"));

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ business_listing_fee_clp: feeClp })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/empresas/publicar");
  revalidatePath("/admin/apariencia");
}
