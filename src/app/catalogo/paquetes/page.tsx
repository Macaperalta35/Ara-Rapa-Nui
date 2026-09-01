import { getPackages } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { CatalogPageHeader } from "@/components/catalog/CatalogPageHeader";

export default async function PackagesPage() {
  const [packages, { locale, dict }] = await Promise.all([getPackages(), getDictionary()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CatalogPageHeader title={dict.home.sectionPackages} />

      {packages.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{dict.common.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <CatalogCard
              key={pkg.id}
              href={`/catalogo/paquetes/${pkg.slug}`}
              name={localize(pkg, "name", locale)}
              description={localize(pkg, "description", locale) || null}
              priceClp={pkg.price_clp}
              imageUrl={pkg.cover_image_url}
              meta={`${pkg.duration_days} ${pkg.duration_days === 1 ? dict.common.day : dict.common.days}`}
              locale={locale}
              fromLabel={dict.common.from}
            />
          ))}
        </div>
      )}
    </div>
  );
}
