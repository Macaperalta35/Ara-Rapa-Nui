import { getSiteSettings, THEME_COLOR_VARS } from "@/lib/supabase/site-settings";
import { updateSiteTheme, updateCategoryVisibility, updateBusinessFee } from "@/lib/actions/site-settings";

const CATEGORY_TOGGLES: { name: string; label: string }[] = [
  { name: "show_packages", label: "Paquetes turísticos" },
  { name: "show_experiences", label: "Experiencias" },
  { name: "show_products", label: "Productos" },
  { name: "show_vehicle_rentals", label: "Arriendo de vehículos" },
  { name: "show_resident_products", label: "Productos residentes" },
  { name: "show_businesses", label: "Empresas" },
  { name: "show_special_request", label: "Pedido especial" },
];

export default async function AppearancePage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Apariencia</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        Cambia los colores del sitio y qué categorías se muestran en el menú.
      </p>

      <form
        action={updateSiteTheme}
        className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6"
      >
        <h2 className="font-display text-lg font-semibold text-volcanic">Colores</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {THEME_COLOR_VARS.map(({ key, label }) => (
            <label key={key} className="flex flex-col gap-1 text-sm font-medium text-volcanic">
              {label}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name={key}
                  defaultValue={settings[key]}
                  className="h-9 w-9 cursor-pointer rounded border border-sand-dark"
                />
                <span className="font-mono text-xs text-volcanic/50">{settings[key]}</span>
              </div>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-terracotta-light active:scale-[0.98]"
        >
          Guardar colores
        </button>
      </form>

      <form
        action={updateCategoryVisibility}
        className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6"
      >
        <h2 className="font-display text-lg font-semibold text-volcanic">Categorías visibles en el menú</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {CATEGORY_TOGGLES.map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 text-sm font-medium text-volcanic">
              <input
                type="checkbox"
                name={name}
                defaultChecked={settings[name as keyof typeof settings] as boolean}
              />
              {label}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-terracotta-light active:scale-[0.98]"
        >
          Guardar categorías
        </button>
      </form>

      <form
        action={updateBusinessFee}
        className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6"
      >
        <h2 className="font-display text-lg font-semibold text-volcanic">
          Tarifa de publicación de empresas
        </h2>
        <p className="mt-1 text-sm text-volcanic/60">
          Lo que cobra cada negocio para aparecer en el directorio de empresas.
        </p>
        <label className="mt-4 flex flex-col gap-1 text-sm font-medium text-volcanic">
          Tarifa (CLP)
          <input
            type="number"
            name="business_listing_fee_clp"
            min={0}
            step={500}
            defaultValue={settings.business_listing_fee_clp}
            className="w-40 rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
          />
        </label>
        <button
          type="submit"
          className="mt-6 rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-terracotta-light active:scale-[0.98]"
        >
          Guardar tarifa
        </button>
      </form>
    </div>
  );
}
