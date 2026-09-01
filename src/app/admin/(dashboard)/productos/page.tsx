import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, toggleProductActive } from "@/lib/actions/admin-catalog";
import { formatClp } from "@/lib/format";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-volcanic">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-light"
        >
          + Nuevo producto
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {(products ?? []).map((product) => {
          const outOfStock = product.stock <= 0;
          const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;

          return (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4"
            >
              <div>
                <p className="flex flex-wrap items-center gap-1.5 font-medium text-volcanic">
                  {product.name_es}
                  {!product.is_active && <span className="text-xs text-volcanic/40">(pausado)</span>}
                  {product.audience === "resident" && (
                    <span className="rounded-full bg-ocean/15 px-2 py-0.5 text-xs font-medium text-ocean">
                      residentes
                    </span>
                  )}
                  {outOfStock && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      sin stock
                    </span>
                  )}
                  {lowStock && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      stock bajo
                    </span>
                  )}
                </p>
                <p className="text-sm text-volcanic/60">
                  {formatClp(product.price_clp)} · stock {product.stock}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <form action={toggleProductActive.bind(null, product.id, !product.is_active)}>
                  <button className="text-sm text-volcanic/70 hover:underline">
                    {product.is_active ? "Pausar" : "Activar"}
                  </button>
                </form>
                <Link href={`/admin/productos/${product.id}`} className="text-sm text-ocean hover:underline">
                  Editar
                </Link>
                <form action={deleteProduct.bind(null, product.id)}>
                  <button className="text-sm text-red-600 hover:underline">Eliminar</button>
                </form>
              </div>
            </li>
          );
        })}
        {(products ?? []).length === 0 && <p className="text-volcanic/50">Sin productos todavía.</p>}
      </ul>
    </div>
  );
}
