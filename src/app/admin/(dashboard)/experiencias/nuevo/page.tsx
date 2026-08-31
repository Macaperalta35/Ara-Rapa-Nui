import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Nueva experiencia</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <ExperienceForm />
      </div>
    </div>
  );
}
