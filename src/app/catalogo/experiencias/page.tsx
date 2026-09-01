import { getExperiences } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { CatalogPageHeader } from "@/components/catalog/CatalogPageHeader";

export default async function ExperiencesPage() {
  const [experiences, { locale, dict }] = await Promise.all([
    getExperiences(),
    getDictionary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CatalogPageHeader title={dict.home.sectionExperiences} />

      {experiences.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{dict.common.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <CatalogCard
              key={exp.id}
              href={`/catalogo/experiencias/${exp.slug}`}
              name={localize(exp, "name", locale)}
              description={localize(exp, "description", locale) || null}
              priceClp={exp.price_clp}
              imageUrl={exp.cover_image_url}
              meta={exp.duration_hours ? `${exp.duration_hours} ${dict.common.hours}` : undefined}
              locale={locale}
              fromLabel={dict.common.from}
            />
          ))}
        </div>
      )}
    </div>
  );
}
