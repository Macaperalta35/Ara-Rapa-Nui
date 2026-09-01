import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { AddToCartForm } from "@/components/cart/AddToCartForm";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { formatClp } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, { locale, dict }] = await Promise.all([
    getProductBySlug(slug),
    getDictionary(),
  ]);

  if (!product) notFound();

  const name = localize(product, "name", locale);
  const description = localize(product, "description", locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand-dark">
            {product.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.cover_image_url} alt={name} className="h-full w-full object-cover" />
            )}
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-volcanic">{name}</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-ocean">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </p>
          {description && <p className="mt-4 whitespace-pre-line text-volcanic/80">{description}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-display text-2xl font-semibold text-terracotta">
            {formatClp(product.price_clp)}
          </p>
          <AddToCartForm
            type="product"
            id={product.id}
            slug={product.slug}
            nameEs={product.name_es}
            nameEn={product.name_en}
            unitPriceClp={product.price_clp}
            imageUrl={product.cover_image_url}
            stock={product.stock}
          />
        </div>
      </div>

      <ReviewsSection targetType="product" targetId={product.id} />
    </div>
  );
}
