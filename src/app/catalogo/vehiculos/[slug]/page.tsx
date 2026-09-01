import { notFound } from "next/navigation";
import { getVehicleRentalBySlug } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import { formatClp } from "@/lib/format";

export default async function VehicleRentalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [vehicle, { locale, dict }] = await Promise.all([
    getVehicleRentalBySlug(slug),
    getDictionary(),
  ]);

  if (!vehicle) notFound();

  const name = localize(vehicle, "name", locale);
  const description = localize(vehicle, "description", locale);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand-dark">
          {vehicle.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vehicle.cover_image_url} alt={name} className="h-full w-full object-cover" />
          )}
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-volcanic">{name}</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-ocean">
          {vehicle.brand_model ? `${vehicle.brand_model} · ` : ""}
          {vehicle.capacity ? `${vehicle.capacity} pasajeros` : ""}
          {vehicle.transmission ? ` · ${vehicle.transmission}` : ""}
        </p>
        {description && <p className="mt-4 whitespace-pre-line text-volcanic/80">{description}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-display text-2xl font-semibold text-terracotta">
          {formatClp(vehicle.price_clp_per_day)}{" "}
          <span className="text-sm font-normal text-volcanic/60">{dict.common.perDay}</span>
        </p>
        <AddToCartForm
          type="vehicle_rental"
          id={vehicle.id}
          slug={vehicle.slug}
          nameEs={vehicle.name_es}
          nameEn={vehicle.name_en}
          pricePerDayClp={vehicle.price_clp_per_day}
          imageUrl={vehicle.cover_image_url}
        />
      </div>
    </div>
  );
}
