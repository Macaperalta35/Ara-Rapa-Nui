"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAction } from "@/lib/auth/admin-guard";

const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "site-images";

export type UploadResult = { url: string } | { error: string };

function validateFile(file: File | null): string | null {
  if (!file || file.size === 0) return "No se seleccionó ningún archivo.";
  if (!file.type.startsWith("image/")) return "El archivo debe ser una imagen.";
  if (file.size > MAX_BYTES) return "La imagen no puede superar 5MB.";
  return null;
}

async function upload(file: File): Promise<UploadResult> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

/** For admin catalog forms (packages, experiences, products, vehicles). */
export async function uploadAdminImage(formData: FormData): Promise<UploadResult> {
  await requireAdminAction();
  const file = formData.get("file") as File | null;
  const error = validateFile(file);
  if (error) return { error };
  return upload(file!);
}

/** For the public "publicar mi empresa" form — no auth, so kept stricter. */
export async function uploadPublicImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const error = validateFile(file);
  if (error) return { error };
  return upload(file!);
}
