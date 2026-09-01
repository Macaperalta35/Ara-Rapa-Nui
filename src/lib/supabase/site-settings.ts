import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

export const DEFAULT_SITE_SETTINGS = {
  color_volcanic: "#211d16",
  color_volcanic_light: "#3a332a",
  color_ocean: "#0c8a90",
  color_ocean_light: "#2bc4c4",
  color_terracotta: "#b3543a",
  color_terracotta_light: "#c97854",
  color_sunset: "#f2894a",
  color_sand: "#f5efe0",
  color_sand_dark: "#e8dcc4",
  color_hibiscus: "#e0356d",
  color_hibiscus_light: "#f47fa8",
  color_palm: "#2f7d52",
  color_background: "#faf6ee",
  color_foreground: "#211d16",
  show_packages: true,
  show_experiences: true,
  show_products: true,
  show_vehicle_rentals: true,
  show_resident_products: true,
  show_businesses: true,
  show_special_request: true,
  business_listing_fee_clp: 15000,
} as const;

export type SiteSettings = typeof DEFAULT_SITE_SETTINGS;

export type SiteThemeColorKey =
  | "color_volcanic"
  | "color_volcanic_light"
  | "color_ocean"
  | "color_ocean_light"
  | "color_terracotta"
  | "color_terracotta_light"
  | "color_sunset"
  | "color_sand"
  | "color_sand_dark"
  | "color_hibiscus"
  | "color_hibiscus_light"
  | "color_palm"
  | "color_background"
  | "color_foreground";

export type CategoryVisibility = {
  showPackages: boolean;
  showExperiences: boolean;
  showProducts: boolean;
  showVehicleRentals: boolean;
  showResidentProducts: boolean;
  showBusinesses: boolean;
  showSpecialRequest: boolean;
};

/** The color fields, as (cssVarName, settingsKey) pairs — shared by the theme
 * injector and the admin color-picker form so they can't drift apart. */
export const THEME_COLOR_VARS: { cssVar: string; key: SiteThemeColorKey; label: string }[] = [
  { cssVar: "--color-volcanic", key: "color_volcanic", label: "Volcánico" },
  { cssVar: "--color-volcanic-light", key: "color_volcanic_light", label: "Volcánico claro" },
  { cssVar: "--color-ocean", key: "color_ocean", label: "Océano" },
  { cssVar: "--color-ocean-light", key: "color_ocean_light", label: "Océano claro" },
  { cssVar: "--color-terracotta", key: "color_terracotta", label: "Terracota" },
  { cssVar: "--color-terracotta-light", key: "color_terracotta_light", label: "Terracota claro" },
  { cssVar: "--color-sunset", key: "color_sunset", label: "Atardecer" },
  { cssVar: "--color-sand", key: "color_sand", label: "Arena" },
  { cssVar: "--color-sand-dark", key: "color_sand_dark", label: "Arena oscura" },
  { cssVar: "--color-hibiscus", key: "color_hibiscus", label: "Hibisco" },
  { cssVar: "--color-hibiscus-light", key: "color_hibiscus_light", label: "Hibisco claro" },
  { cssVar: "--color-palm", key: "color_palm", label: "Palma" },
  { cssVar: "--background", key: "color_background", label: "Fondo" },
  { cssVar: "--foreground", key: "color_foreground", label: "Texto" },
];

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SITE_SETTINGS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return { ...DEFAULT_SITE_SETTINGS, ...data };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function buildThemeCss(settings: SiteSettings): string {
  const decls = THEME_COLOR_VARS.filter(({ key }) => HEX_RE.test(settings[key] as string))
    .map(({ cssVar, key }) => `${cssVar}:${settings[key]} !important;`)
    .join("");
  return `:root{${decls}}`;
}
