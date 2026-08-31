import es from "./es";
import en from "./en";

export const dictionaries = { es, en };
export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)["es"];

export const LOCALE_COOKIE = "ara-rapa-nui-locale";
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en";
}
