"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminAction } from "@/lib/auth/admin-guard";

const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "site-images";

export type UploadResult = { url: string } | { error: string };

// Deliberately excludes SVG: an SVG can carry an embedded <script>, so
// serving one from our public bucket with its own content-type would be
// stored XSS. Raster types only.
const ALLOWED: { mime: string; ext: string; signature: number[] }[] = [
  { mime: "image/jpeg", ext: "jpg", signature: [0xff, 0xd8, 0xff] },
  { mime: "image/png", ext: "png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", ext: "gif", signature: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", ext: "webp", signature: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"; WEBP marker follows at byte 8
];

function matchesSignature(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, i) => bytes[i] === byte);
}

async function validateFile(file: File | null): Promise<{ error: string } | { allowed: (typeof ALLOWED)[number] }> {
  if (!file || file.size === 0) return { error: "No se seleccionó ningún archivo." };
  if (file.size > MAX_BYTES) return { error: "La imagen no puede superar 5MB." };

  const allowed = ALLOWED.find((a) => a.mime === file.type);
  if (!allowed) return { error: "Formato no permitido. Usa JPG, PNG, GIF o WEBP." };

  // Verify the actual file bytes match the claimed type — the browser's
  // reported MIME type is otherwise just attacker-controlled metadata.
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesSignature(head, allowed.signature)) {
    return { error: "El archivo no parece ser una imagen válida." };
  }

  return { allowed };
}

async function upload(file: File, ext: string): Promise<UploadResult> {
  const supabase = createAdminClient();
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
  const result = await validateFile(file);
  if ("error" in result) return result;
  return upload(file!, result.allowed.ext);
}

/** For the public "publicar mi empresa" form — no auth, so kept stricter. */
export async function uploadPublicImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const result = await validateFile(file);
  if ("error" in result) return result;
  return upload(file!, result.allowed.ext);
}
