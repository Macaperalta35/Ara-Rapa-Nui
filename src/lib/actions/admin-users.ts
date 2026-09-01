"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSuperAdminAction } from "@/lib/auth/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminRole } from "@/lib/auth/admin-guard";

const createSchema = z.object({
  email: z.string().trim().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["admin", "superadmin"]),
});

export type CreateAdminState = { error?: string; success?: boolean } | undefined;

export async function createAdminUser(
  _prevState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  await requireSuperAdminAction();

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = createAdminClient();

  const { data, error: createError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });
  if (createError || !data.user) {
    return { error: createError?.message ?? "No pudimos crear la cuenta." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    email: parsed.data.email,
    role: parsed.data.role,
  });
  if (profileError) {
    return { error: "La cuenta se creó, pero no pudimos darle acceso de admin: " + profileError.message };
  }

  revalidatePath("/admin/administradores");
  return { success: true };
}

export async function updateAdminRole(profileId: string, role: AdminRole) {
  const { user } = await requireSuperAdminAction();
  if (profileId === user.id && role !== "superadmin") {
    throw new Error("No puedes quitarte tu propio rol de superadmin.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/administradores");
}

export async function removeAdminAccess(profileId: string) {
  const { user } = await requireSuperAdminAction();
  if (profileId === user.id) {
    throw new Error("No puedes quitarte tu propio acceso.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/administradores");
}
