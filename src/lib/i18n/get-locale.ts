import { cookies } from "next/headers";
import { DEFAULT_LOCALE, dictionaries, isLocale, LOCALE_COOKIE } from "./dictionaries";

/** Server-side helper: read the active locale + dictionary from the request cookie. */
export async function getLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}

/** Picks the field for the active locale from a bilingual Supabase row, e.g. localize(product, "name", locale). */
export function localize<T extends Record<string, unknown>>(
  record: T,
  field: string,
  locale: "es" | "en",
): string {
  return String(record[`${field}_${locale}`] ?? record[`${field}_es`] ?? "");
}
