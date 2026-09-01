import { getSiteSettings } from "@/lib/supabase/site-settings";
import { PublishBusinessForm } from "@/components/empresas/PublishBusinessForm";

export default async function PublishBusinessPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">Publica tu empresa</h1>
      <p className="mt-2 text-sm text-volcanic/60">
        Cuéntanos sobre tu negocio en Rapa Nui. Cobramos una publicación única de{" "}
        {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
          settings.business_listing_fee_clp,
        )}{" "}
        y revisamos cada publicación antes de que aparezca en el directorio.
      </p>

      <PublishBusinessForm feeClp={settings.business_listing_fee_clp} />
    </div>
  );
}
