import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/lib/actions/admin-catalog";
import { formatClp } from "@/lib/format";

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
        {(products ?? []).map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4"
          >
            <div>
              <p className="font-medium text-volcanic">
                {product.name_es}{" "}
                {!product.is_active && <span className="text-xs text-volcanic/40">(inactivo)</span>}
                {product.audience === "resident" && (
                  <span className="ml-1 rounded-full bg-ocean/15 px-2 py-0.5 text-xs font-medium text-ocean">
                    residentes
                  </span>
                )}
              </p>
              <p className="text-sm text-volcanic/60">
                {formatClp(product.price_clp)} · stock {product.stock}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/productos/${product.id}`} className="text-sm text-ocean hover:underline">
                Editar
              </Link>
              <form action={deleteProduct.bind(null, product.id)}>
                <button className="text-sm text-red-600 hover:underline">Eliminar</button>
              </form>
            </div>
          </li>
        ))}
        {(products ?? []).length === 0 && <p className="text-volcanic/50">Sin productos todavía.</p>}
      </ul>
    </div>
  );
}
