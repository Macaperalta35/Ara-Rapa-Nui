import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePackage } from "@/lib/actions/admin-catalog";
import { formatClp } from "@/lib/format";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-volcanic">Paquetes</h1>
        <Link
          href="/admin/paquetes/nuevo"
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-light"
        >
          + Nuevo paquete
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {(packages ?? []).map((pkg) => (
          <li
            key={pkg.id}
            className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4"
          >
            <div>
              <p className="font-medium text-volcanic">
                {pkg.name_es} {!pkg.is_active && <span className="text-xs text-volcanic/40">(inactivo)</span>}
              </p>
              <p className="text-sm text-volcanic/60">{formatClp(pkg.price_clp)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/paquetes/${pkg.id}`} className="text-sm text-ocean hover:underline">
                Editar
              </Link>
              <form action={deletePackage.bind(null, pkg.id)}>
                <button className="text-sm text-red-600 hover:underline">Eliminar</button>
              </form>
            </div>
          </li>
        ))}
        {(packages ?? []).length === 0 && <p className="text-volcanic/50">Sin paquetes todavía.</p>}
      </ul>
    </div>
  );
}
