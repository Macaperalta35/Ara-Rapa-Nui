"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { updateOrderStatus, type OrderStatus } from "@/lib/orders/update-status";
import { createClient } from "@/lib/supabase/server";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  await requireAdminAction();
  await updateOrderStatus(orderId, status);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function updateRequestStatusAction(
  requestId: string,
  status: "new" | "contacted" | "closed",
  adminNotes?: string,
) {
  await requireAdminAction();
  const supabase = await createClient();
  const { error } = await supabase
    .from("special_requests")
    .update({ status, ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}) })
    .eq("id", requestId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/solicitudes");
  revalidatePath(`/admin/solicitudes/${requestId}`);
}
