import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BusinessPaymentConfirmationPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, payment_status")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) notFound();

  const title =
    business.payment_status === "paid"
      ? "¡Pago confirmado!"
      : "Tu publicación está pendiente de pago";

  const subtitle =
    business.payment_status === "paid"
      ? "La revisaremos y, una vez aprobada, aparecerá en el directorio de empresas."
      : "Si el pago no se procesó, puedes intentarlo nuevamente desde el formulario de publicación.";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{title}</h1>
      <p className="mt-4 text-volcanic/70">
        {business.name} — {subtitle}
      </p>

      <Link
        href="/empresas"
        className="mt-8 inline-block rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]"
      >
        Ver directorio de empresas
      </Link>
    </div>
  );
}
