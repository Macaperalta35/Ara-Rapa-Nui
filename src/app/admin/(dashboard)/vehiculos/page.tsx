import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteVehicleRental } from "@/lib/actions/admin-catalog";
import { formatClp } from "@/lib/format";

export default async function AdminVehicleRentalsPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicle_rentals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-volcanic">Arriendo de vehículos</h1>
        <Link
          href="/admin/vehiculos/nuevo"
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-light"
        >
          + Nuevo vehículo
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {(vehicles ?? []).map((vehicle) => (
          <li
            key={vehicle.id}
            className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4"
          >
            <div>
              <p className="font-medium text-volcanic">
                {vehicle.name_es}{" "}
                {!vehicle.is_active && <span className="text-xs text-volcanic/40">(inactivo)</span>}
              </p>
              <p className="text-sm text-volcanic/60">{formatClp(vehicle.price_clp_per_day)} / día</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/vehiculos/${vehicle.id}`} className="text-sm text-ocean hover:underline">
                Editar
              </Link>
              <form action={deleteVehicleRental.bind(null, vehicle.id)}>
                <button className="text-sm text-red-600 hover:underline">Eliminar</button>
              </form>
            </div>
          </li>
        ))}
        {(vehicles ?? []).length === 0 && <p className="text-volcanic/50">Sin vehículos todavía.</p>}
      </ul>
    </div>
  );
}
