import { VehicleRentalForm } from "@/components/admin/VehicleRentalForm";

export default function NewVehicleRentalPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Nuevo vehículo</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <VehicleRentalForm />
      </div>
    </div>
  );
}
