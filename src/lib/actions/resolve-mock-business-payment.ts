"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { updateBusinessPaymentStatus } from "@/lib/businesses/update-payment-status";
import { isMercadoPagoConfigured } from "@/lib/mercadopago/types";

/** Mock stand-in for the business listing fee — mirrors resolveMockPayment. */
export async function resolveMockBusinessPayment(businessId: string, approved: boolean) {
  if (isMercadoPagoConfigured()) {
    throw new Error("Mercado Pago is configured — the mock payment flow is disabled.");
  }

  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("payment_status")
    .eq("id", businessId)
    .maybeSingle();

  if (!business || business.payment_status !== "unpaid") {
    throw new Error("Esta publicación ya fue procesada.");
  }

  if (approved) {
    await updateBusinessPaymentStatus(businessId, "paid");
  }
}
