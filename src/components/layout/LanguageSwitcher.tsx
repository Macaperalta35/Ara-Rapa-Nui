"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();

  function toggle() {
    const next = locale === "es" ? "en" : "es";
    setLocale(next);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium tracking-wide text-volcanic/80 hover:text-ocean transition-colors"
      aria-label="Toggle language"
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
