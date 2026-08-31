export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
      />
    </label>
  );
}
