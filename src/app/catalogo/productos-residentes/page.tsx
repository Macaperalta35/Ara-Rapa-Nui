import { getProducts } from "@/lib/supabase/catalog";
import { getDictionary, localize } from "@/lib/i18n/get-locale";
import { CatalogCard } from "@/components/catalog/CatalogCard";

export default async function ResidentProductsPage() {
  const [products, { locale, dict }] = await Promise.all([
    getProducts("resident"),
    getDictionary(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-volcanic">
        {dict.home.sectionResidentProducts}
      </h1>
      <p className="mt-2 text-sm text-volcanic/60">
        Productos e insumos pensados para los habitantes de Rapa Nui.
      </p>

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
