"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto"),
  email: z.string().trim().email("Correo inválido"),
  phone: z.string().trim().optional(),
  description: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)"),
  preferredDate: z.string().optional(),
});

export type SpecialRequestState = { error?: string; success?: boolean } | undefined;

export async function submitSpecialRequest(
  _prevState: SpecialRequestState,
  formData: FormData,
): Promise<SpecialRequestState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    description: formData.get("description"),
    preferredDate: formData.get("preferredDate") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("special_requests").insert({
    customer_name: parsed.data.name,
    customer_email: parsed.data.email,
    customer_phone: parsed.data.phone ?? null,
    description: parsed.data.description,
    preferred_date: parsed.data.preferredDate || null,
  });

  if (error) {
    return { error: "No pudimos enviar tu solicitud. Intenta nuevamente." };
  }

  return { success: true };
}
