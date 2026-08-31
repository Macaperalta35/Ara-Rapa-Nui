import { notFound } from "next/navigation";
import { getPackageBySlug } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import { formatClp } from "@/lib/format";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pkg, { locale, dict }] = await Promise.all([getPackageBySlug(slug), getDictionary()]);

  if (!pkg) notFound();

  const name = localize(pkg, "name", locale);
  const description = localize(pkg, "description", locale);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand-dark">
          {pkg.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pkg.cover_image_url} alt={name} className="h-full w-full object-cover" />
          )}
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-volcanic">{name}</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-ocean">
          {pkg.duration_days} {pkg.duration_days === 1 ? dict.common.day : dict.common.days}
          {pkg.max_participants ? ` · Máx. ${pkg.max_participants} personas` : ""}
        </p>
        {description && <p className="mt-4 whitespace-pre-line text-volcanic/80">{description}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-display text-2xl font-semibold text-terracotta">
          {formatClp(pkg.price_clp)}{" "}
          <span className="text-sm font-normal text-volcanic/60">{dict.common.perPerson}</span>
        </p>
        <AddToCartForm
          type="package"
          id={pkg.id}
          slug={pkg.slug}
          nameEs={pkg.name_es}
          nameEn={pkg.name_en}
          unitPriceClp={pkg.price_clp}
          imageUrl={pkg.cover_image_url}
        />
      </div>
    </div>
  );
}
