import { getVehicleRentals } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";

export default async function VehicleRentalsPage() {
  const [vehicles, { locale, dict }] = await Promise.all([
    getVehicleRentals(),
    getDictionary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-volcanic">
        {dict.home.sectionVehicleRentals}
      </h1>

      {vehicles.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{dict.common.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <CatalogCard
              key={vehicle.id}
              href={`/catalogo/vehiculos/${vehicle.slug}`}
              name={localize(vehicle, "name", locale)}
              description={localize(vehicle, "description", locale) || null}
              priceClp={vehicle.price_clp_per_day}
              imageUrl={vehicle.cover_image_url}
              meta={vehicle.capacity ? `${vehicle.capacity} pasajeros` : undefined}
              locale={locale}
              fromLabel={dict.common.from}
              priceSuffix={dict.common.perDay}
            />
          ))}
        </div>
      )}
    </div>
  );
}
