import { notFound } from "next/navigation";
import { getExperienceBySlug } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { formatClp } from "@/lib/format";

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [exp, { locale, dict }] = await Promise.all([
    getExperienceBySlug(slug),
    getDictionary(),
  ]);

  if (!exp) notFound();

  const name = localize(exp, "name", locale);
  const description = localize(exp, "description", locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand-dark">
            {exp.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={exp.cover_image_url} alt={name} className="h-full w-full object-cover" />
            )}
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-volcanic">{name}</h1>
          {exp.duration_hours && (
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-ocean">
              {exp.duration_hours} {dict.common.hours}
            </p>
          )}
          {description && <p className="mt-4 whitespace-pre-line text-volcanic/80">{description}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-display text-2xl font-semibold text-terracotta">
            {formatClp(exp.price_clp)}{" "}
            <span className="text-sm font-normal text-volcanic/60">{dict.common.perPerson}</span>
          </p>
          <AddToCartForm
            type="experience"
            id={exp.id}
            slug={exp.slug}
            nameEs={exp.name_es}
            nameEn={exp.name_en}
            unitPriceClp={exp.price_clp}
            imageUrl={exp.cover_image_url}
            requiresDate={exp.requires_date}
          />
        </div>
      </div>

      <ReviewsSection targetType="experience" targetId={exp.id} />
    </div>
  );
}
