import Link from "next/link";
import { getApprovedBusinesses } from "@/lib/supabase/businesses";
import { BUSINESS_CATEGORIES } from "@/lib/types/business";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function BusinessDirectoryPage() {
  const [businesses, { dict }] = await Promise.all([getApprovedBusinesses(), getDictionary()]);

  const categoryLabel = (value: string) =>
    BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-volcanic">Empresas de Rapa Nui</h1>
          <p className="mt-2 text-sm text-volcanic/60">
            Negocios locales recomendados por la comunidad.
          </p>
        </div>
        <Link
          href="/empresas/publicar"
          className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]"
        >
          + Publicar mi empresa
        </Link>
      </div>

      {businesses.length === 0 ? (
        <p className="mt-10 text-volcanic/60">{dict.common.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((biz, i) => (
            <div
              key={biz.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in-up flex flex-col overflow-hidden rounded-2xl border border-sand-dark bg-white transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-sand-dark">
                {biz.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={biz.cover_image_url} alt={biz.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-xs font-medium uppercase tracking-wide text-ocean">
                  {categoryLabel(biz.category)}
                </span>
                <h3 className="font-display text-lg font-semibold text-volcanic">{biz.name}</h3>
                <p className="line-clamp-3 text-sm text-volcanic/70">{biz.description}</p>
                {biz.location && <p className="text-xs text-volcanic/50">📍 {biz.location}</p>}
                {biz.hours && <p className="text-xs text-volcanic/50">🕒 {biz.hours}</p>}
                <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm">
                  {biz.phone && (
                    <a href={`tel:${biz.phone}`} className="text-terracotta hover:underline">
                      {biz.phone}
                    </a>
                  )}
                  {biz.whatsapp && (
                    <a
                      href={`https://wa.me/${biz.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:underline"
                    >
                      WhatsApp
                    </a>
                  )}
                  {biz.website_url && (
                    <a
                      href={biz.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:underline"
                    >
                      Sitio web
                    </a>
                  )}
                  {biz.instagram_url && (
                    <a
                      href={biz.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {biz.facebook_url && (
                    <a
                      href={biz.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
