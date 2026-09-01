"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import type { BusinessStatus } from "@/lib/types/business";

export async function updateBusinessStatusAction(
  businessId: string,
  status: BusinessStatus,
  adminNotes?: string,
) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("businesses")
    .update({ status, ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}) })
    .eq("id", businessId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/empresas");
  revalidatePath(`/admin/empresas/${businessId}`);
  revalidatePath("/empresas");
}

export async function deleteBusinessAction(businessId: string) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").delete().eq("id", businessId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/empresas");
  revalidatePath("/empresas");
}
