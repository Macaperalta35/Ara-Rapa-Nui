import { getProducts } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { CatalogPageHeader } from "@/components/catalog/CatalogPageHeader";

export default async function ProductsPage() {
  const [products, { locale, dict }] = await Promise.all([getProducts(), getDictionary()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CatalogPageHeader title={dict.home.sectionProducts} />

      {products.length === 0 ? (
        <p className="mt-6 text-volcanic/60">{dict.common.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <CatalogCard
              key={product.id}
              href={`/catalogo/productos/${product.slug}`}
              name={localize(product, "name", locale)}
              description={localize(product, "description", locale) || null}
              priceClp={product.price_clp}
              imageUrl={product.cover_image_url}
              meta={product.stock > 0 ? undefined : "Sin stock"}
              locale={locale}
              fromLabel={dict.common.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
