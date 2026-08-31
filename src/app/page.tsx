import Link from "next/link";
import { getPackages, getExperiences, getProducts } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";

export default async function HomePage() {
  const [packages, experiences, products, { locale, dict }] = await Promise.all([
    getPackages(),
    getExperiences(),
    getProducts(),
    getDictionary(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-volcanic text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{dict.home.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-lg text-sand/85">{dict.home.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalogo/paquetes"
              className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-light"
            >
              {dict.home.ctaExplore}
            </Link>
            <Link
              href="/pedido-especial"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {dict.home.ctaSpecialRequest}
            </Link>
          </div>
        </div>
      </section>

      <CatalogSection
        title={dict.home.sectionPackages}
        seeAllHref="/catalogo/paquetes"
        items={packages.slice(0, 3).map((pkg) => ({
          href: `/catalogo/paquetes/${pkg.slug}`,
          name: localize(pkg, "name", locale),
          description: localize(pkg, "description", locale) || null,
          priceClp: pkg.price_clp,
          imageUrl: pkg.cover_image_url,
        }))}
        locale={locale}
        fromLabel={dict.common.from}
        emptyLabel={dict.common.empty}
      />

      <CatalogSection
        title={dict.home.sectionExperiences}
        seeAllHref="/catalogo/experiencias"
        items={experiences.slice(0, 3).map((exp) => ({
          href: `/catalogo/experiencias/${exp.slug}`,
          name: localize(exp, "name", locale),
          description: localize(exp, "description", locale) || null,
          priceClp: exp.price_clp,
          imageUrl: exp.cover_image_url,
        }))}
        locale={locale}
        fromLabel={dict.common.from}
        emptyLabel={dict.common.empty}
      />

      <CatalogSection
        title={dict.home.sectionProducts}
        seeAllHref="/catalogo/productos"
        items={products.slice(0, 3).map((product) => ({
          href: `/catalogo/productos/${product.slug}`,
          name: localize(product, "name", locale),
          description: localize(product, "description", locale) || null,
          priceClp: product.price_clp,
          imageUrl: product.cover_image_url,
        }))}
        locale={locale}
        fromLabel={dict.common.price}
        emptyLabel={dict.common.empty}
      />
    </div>
  );
}

function CatalogSection({
  title,
  seeAllHref,
  items,
  locale,
  fromLabel,
  emptyLabel,
}: {
  title: string;
  seeAllHref: string;
  items: {
    href: string;
    name: string;
    description: string | null;
    priceClp: number;
    imageUrl: string | null;
  }[];
  locale: import("@/lib/i18n/dictionaries").Locale;
  fromLabel: string;
  emptyLabel: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-volcanic">{title}</h2>
        <Link href={seeAllHref} className="text-sm font-medium text-ocean hover:underline">
          Ver todo →
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{emptyLabel}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <CatalogCard key={item.href} locale={locale} fromLabel={fromLabel} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}
