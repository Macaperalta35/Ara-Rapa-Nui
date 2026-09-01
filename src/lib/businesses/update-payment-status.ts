import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateBusinessPaymentStatus(
  businessId: string,
  paymentStatus: "paid" | "unpaid",
  mpPaymentId?: string,
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("businesses")
    .update({ payment_status: paymentStatus, ...(mpPaymentId ? { mp_payment_id: mpPaymentId } : {}) })
    .eq("id", businessId);
  if (error) throw new Error(error.message);
}
