import Link from "next/link";
import {
  getPackages,
  getExperiences,
  getProducts,
  getVehicleRentals,
} from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { PolynesianFlower } from "@/components/ui/PolynesianFlower";
import { OceanWave } from "@/components/ui/OceanWave";
import { getSiteSettings } from "@/lib/supabase/site-settings";

export default async function HomePage() {
  const [packages, experiences, products, residentProducts, vehicles, { locale, dict }, settings] =
    await Promise.all([
      getPackages(),
      getExperiences(),
      getProducts(),
      getProducts("resident"),
      getVehicleRentals(),
      getDictionary(),
      getSiteSettings(),
    ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-volcanic text-white">
        <PolynesianFlower
          className="animate-sway pointer-events-none absolute -right-6 -top-10 h-64 w-64 text-hibiscus/40"
        />
        <PolynesianFlower
          className="animate-sway pointer-events-none absolute -bottom-12 left-[-2rem] h-56 w-56 text-ocean-light/35"
          style={{ animationDelay: "1.5s" }}
        />
        <PolynesianFlower
          className="animate-sway pointer-events-none absolute right-1/4 bottom-0 hidden h-28 w-28 text-sunset/30 md:block"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h1 className="font-display animate-fade-in-up text-4xl font-semibold sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p
            className="animate-fade-in-up mt-4 max-w-xl text-lg text-sand/85"
            style={{ animationDelay: "100ms" }}
          >
            {dict.home.heroSubtitle}
          </p>
          <div
            className="animate-fade-in-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/catalogo/paquetes"
              className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.04] hover:bg-terracotta-light active:scale-[0.97]"
            >
              {dict.home.ctaExplore}
            </Link>
            <Link
              href="/pedido-especial"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.04] hover:bg-white/10 active:scale-[0.97]"
            >
              {dict.home.ctaSpecialRequest}
            </Link>
          </div>
        </div>

        <OceanWave className="pointer-events-none absolute -bottom-1 left-0 h-10 w-full text-sand sm:h-14" />
      </section>

      {settings.show_packages && (
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
      )}

      {settings.show_experiences && (
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
      )}

      {settings.show_products && (
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
      )}

      {settings.show_vehicle_rentals && (
        <CatalogSection
          title={dict.home.sectionVehicleRentals}
          seeAllHref="/catalogo/vehiculos"
          items={vehicles.slice(0, 3).map((vehicle) => ({
            href: `/catalogo/vehiculos/${vehicle.slug}`,
            name: localize(vehicle, "name", locale),
            description: localize(vehicle, "description", locale) || null,
            priceClp: vehicle.price_clp_per_day,
            imageUrl: vehicle.cover_image_url,
          }))}
          locale={locale}
          fromLabel={dict.common.from}
          priceSuffix={dict.common.perDay}
          emptyLabel={dict.common.empty}
        />
      )}

      {settings.show_resident_products && (
        <CatalogSection
          title={dict.home.sectionResidentProducts}
          seeAllHref="/catalogo/productos-residentes"
          items={residentProducts.slice(0, 3).map((product) => ({
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
      )}
    </div>
  );
}

function CatalogSection({
  title,
  seeAllHref,
  items,
  locale,
  fromLabel,
  priceSuffix,
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
  priceSuffix?: string;
  emptyLabel: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <PolynesianFlower className="h-7 w-7 shrink-0 text-hibiscus" />
          <h2 className="font-display text-2xl font-semibold text-volcanic">{title}</h2>
        </div>
        <Link href={seeAllHref} className="text-sm font-medium text-ocean hover:underline">
          Ver todo →
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{emptyLabel}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.href}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <CatalogCard locale={locale} fromLabel={fromLabel} priceSuffix={priceSuffix} {...item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
