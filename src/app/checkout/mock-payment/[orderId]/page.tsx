import { redirect } from "next/navigation";
import { resolveMockPayment } from "@/lib/actions/resolve-mock-payment";

export default async function MockPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  async function approve() {
    "use server";
    await resolveMockPayment(orderId, true);
    redirect(`/checkout/confirmacion/${orderId}?status=success`);
  }

  async function reject() {
    "use server";
    await resolveMockPayment(orderId, false);
    redirect(`/checkout/confirmacion/${orderId}?status=failure`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
        Pago simulado — modo desarrollo
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-volcanic">
        Simular pago de Mercado Pago
      </h1>
      <p className="mt-3 text-sm text-volcanic/60">
        Reemplaza a Mercado Pago mientras no configures <code>MERCADOPAGO_ACCESS_TOKEN</code>.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <form action={approve}>
          <button className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-light">
            ✓ Aprobar pago
          </button>
        </form>
        <form action={reject}>
          <button className="w-full rounded-full border border-terracotta px-6 py-3 text-sm font-semibold text-terracotta hover:bg-terracotta/10">
            ✕ Rechazar pago
          </button>
        </form>
      </div>
    </div>
  );
}
