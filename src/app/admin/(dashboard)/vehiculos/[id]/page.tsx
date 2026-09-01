import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VehicleRentalForm } from "@/components/admin/VehicleRentalForm";

export default async function EditVehicleRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: vehicle } = await supabase
    .from("vehicle_rentals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Editar vehículo</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <VehicleRentalForm vehicle={vehicle} />
      </div>
    </div>
  );
}
