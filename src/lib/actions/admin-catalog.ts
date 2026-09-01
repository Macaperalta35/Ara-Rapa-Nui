"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";

const baseFields = {
  slug: z.string().trim().min(1),
  name_es: z.string().trim().min(1),
  name_en: z.string().trim().min(1),
  description_es: z.string().trim().optional(),
  description_en: z.string().trim().optional(),
  price_clp: z.coerce.number().int().min(0),
  cover_image_url: z.string().trim().optional(),
  is_active: z.coerce.boolean(),
};

function readBase(formData: FormData) {
  return {
    slug: formData.get("slug"),
    name_es: formData.get("name_es"),
    name_en: formData.get("name_en"),
    description_es: formData.get("description_es") || undefined,
    description_en: formData.get("description_en") || undefined,
    price_clp: formData.get("price_clp"),
    cover_image_url: formData.get("cover_image_url") || undefined,
    is_active: formData.get("is_active") === "on",
  };
}

// Packages ------------------------------------------------------------

const packageSchema = z.object({
  ...baseFields,
  duration_days: z.coerce.number().int().min(1),
  max_participants: z.coerce.number().int().min(1).optional(),
});

export async function upsertPackage(formData: FormData) {
  await requireAdminAction();
  const id = formData.get("id") as string | null;

  const parsed = packageSchema.parse({
    ...readBase(formData),
    duration_days: formData.get("duration_days"),
    max_participants: formData.get("max_participants") || undefined,
  });

  const supabase = await createClient();
  const query = id
    ? supabase.from("packages").update(parsed).eq("id", id)
    : supabase.from("packages").insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/paquetes");
  revalidatePath("/catalogo/paquetes");
  redirect("/admin/paquetes");
}

export async function deletePackage(id: string) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/paquetes");
  revalidatePath("/catalogo/paquetes");
}

// Experiences -----------------------------------------------------------

const experienceSchema = z.object({
  ...baseFields,
  duration_hours: z.coerce.number().min(0).optional(),
  requires_date: z.coerce.boolean(),
});

export async function upsertExperience(formData: FormData) {
  await requireAdminAction();
  const id = formData.get("id") as string | null;

  const parsed = experienceSchema.parse({
    ...readBase(formData),
    duration_hours: formData.get("duration_hours") || undefined,
    requires_date: formData.get("requires_date") === "on",
  });

  const supabase = await createClient();
  const query = id
    ? supabase.from("experiences").update(parsed).eq("id", id)
    : supabase.from("experiences").insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/experiencias");
  revalidatePath("/catalogo/experiencias");
  redirect("/admin/experiencias");
}

export async function deleteExperience(id: string) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experiencias");
  revalidatePath("/catalogo/experiencias");
}

// Products ----------------------------------------------------------------

const productSchema = z.object({
  ...baseFields,
  stock: z.coerce.number().int().min(0),
  sku: z.string().trim().optional(),
  audience: z.enum(["tourist", "resident"]),
});

export async function upsertProduct(formData: FormData) {
  await requireAdminAction();
  const id = formData.get("id") as string | null;

  const parsed = productSchema.parse({
    ...readBase(formData),
    stock: formData.get("stock"),
    sku: formData.get("sku") || undefined,
    audience: formData.get("audience") || "tourist",
  });

  const supabase = await createClient();
  const query = id
    ? supabase.from("products").update(parsed).eq("id", id)
    : supabase.from("products").insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo/productos");
  revalidatePath("/catalogo/productos-residentes");
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo/productos");
  revalidatePath("/catalogo/productos-residentes");
}

// Vehicle rentals -----------------------------------------------------------

const vehicleRentalSchema = z.object({
  slug: z.string().trim().min(1),
  name_es: z.string().trim().min(1),
  name_en: z.string().trim().min(1),
  description_es: z.string().trim().optional(),
  description_en: z.string().trim().optional(),
  vehicle_type: z.string().trim().min(1),
  brand_model: z.string().trim().optional(),
  capacity: z.coerce.number().int().min(1).optional(),
  transmission: z.string().trim().optional(),
  price_clp_per_day: z.coerce.number().int().min(0),
  cover_image_url: z.string().trim().optional(),
  is_active: z.coerce.boolean(),
});

export async function upsertVehicleRental(formData: FormData) {
  await requireAdminAction();
  const id = formData.get("id") as string | null;

  const parsed = vehicleRentalSchema.parse({
    slug: formData.get("slug"),
    name_es: formData.get("name_es"),
    name_en: formData.get("name_en"),
    description_es: formData.get("description_es") || undefined,
    description_en: formData.get("description_en") || undefined,
    vehicle_type: formData.get("vehicle_type"),
    brand_model: formData.get("brand_model") || undefined,
    capacity: formData.get("capacity") || undefined,
    transmission: formData.get("transmission") || undefined,
    price_clp_per_day: formData.get("price_clp_per_day"),
    cover_image_url: formData.get("cover_image_url") || undefined,
    is_active: formData.get("is_active") === "on",
  });

  const supabase = await createClient();
  const query = id
    ? supabase.from("vehicle_rentals").update(parsed).eq("id", id)
    : supabase.from("vehicle_rentals").insert(parsed);
  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/admin/vehiculos");
  revalidatePath("/catalogo/vehiculos");
  redirect("/admin/vehiculos");
}

export async function deleteVehicleRental(id: string) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase.from("vehicle_rentals").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/vehiculos");
  revalidatePath("/catalogo/vehiculos");
}
