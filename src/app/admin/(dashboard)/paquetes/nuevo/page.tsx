import { PackageForm } from "@/components/admin/PackageForm";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Nuevo paquete</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <PackageForm />
      </div>
    </div>
  );
}
