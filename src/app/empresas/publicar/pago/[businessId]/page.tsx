import { redirect } from "next/navigation";
import { resolveMockBusinessPayment } from "@/lib/actions/resolve-mock-business-payment";

export default async function MockBusinessPaymentPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  async function approve() {
    "use server";
    try {
      await resolveMockBusinessPayment(businessId, true);
    } catch {
      // Already processed — fall through to confirmation regardless.
    }
    redirect(`/empresas/publicar/confirmacion/${businessId}?status=success`);
  }

  async function reject() {
    "use server";
    try {
      await resolveMockBusinessPayment(businessId, false);
    } catch {
      // See approve() above.
    }
    redirect(`/empresas/publicar/confirmacion/${businessId}?status=failure`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
        Pago simulado — modo desarrollo
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-volcanic">
        Simular pago de publicación
      </h1>
      <p className="mt-3 text-sm text-volcanic/60">
        Reemplaza a Mercado Pago mientras no configures <code>MERCADOPAGO_ACCESS_TOKEN</code>.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <form action={approve}>
          <button className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]">
            ✓ Aprobar pago
          </button>
        </form>
        <form action={reject}>
          <button className="w-full rounded-full border border-terracotta px-6 py-3 text-sm font-semibold text-terracotta transition-transform hover:scale-[1.03] hover:bg-terracotta/10 active:scale-[0.98]">
            ✕ Rechazar pago
          </button>
        </form>
      </div>
    </div>
  );
}
