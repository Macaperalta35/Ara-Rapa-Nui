import { NextResponse, type NextRequest } from "next/server";
import { fetchPayment } from "@/lib/mercadopago/client";
import { updateOrderStatus } from "@/lib/orders/update-status";
import { updateBusinessPaymentStatus } from "@/lib/businesses/update-payment-status";

// Mercado Pago calls this from its own servers — it can't be a Server
// Action, so it stays a plain Route Handler. See the create-preference
// helper for the notification_url that points here.
export async function POST(request: NextRequest) {
  let body: { type?: string; data?: { id?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (body.type !== "payment" || !body.data?.id) {
    // Ignore other notification types (merchant_order, etc).
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    // Always re-fetch from Mercado Pago's API rather than trusting the
    // webhook payload — the payload only tells us *which* payment changed.
    const payment = await fetchPayment(body.data.id);
    if (!payment.external_reference) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Business listing fees use a distinct external_reference prefix
    // (see createBusinessPaymentPreference) so they route to a different
    // table than order payments.
    if (payment.external_reference.startsWith("business:")) {
      const businessId = payment.external_reference.slice("business:".length);
      if (payment.status === "approved") {
        await updateBusinessPaymentStatus(businessId, "paid", String(payment.id));
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Map Mercado Pago's payment statuses to ours. Refunds/chargebacks map
    // to "cancelled" rather than "pending" so a settled order's outcome
    // (it was paid, then reversed) isn't lost — "pending" only covers
    // genuinely in-flight states.
    const status =
      payment.status === "approved"
        ? "paid"
        : payment.status === "rejected"
          ? "failed"
          : payment.status === "refunded" || payment.status === "charged_back"
            ? "cancelled"
            : "pending";

    await updateOrderStatus(payment.external_reference, status, String(payment.id));
  } catch (err) {
    console.error("mercadopago webhook error:", err);
    // Still 200 so Mercado Pago doesn't hammer retries for a bug on our side
    // that a human needs to look at — but log it loudly above.
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
