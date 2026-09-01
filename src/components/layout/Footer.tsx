"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
import { PolynesianFlower } from "@/components/ui/PolynesianFlower";
import { AccountLink } from "./AccountLink";
import type { CategoryVisibility } from "@/lib/supabase/site-settings";

export function Footer({ visibility }: { visibility: CategoryVisibility }) {
  const t = useTranslations();

  return (
    <footer className="relative overflow-hidden border-t border-sand-dark/80 bg-volcanic text-sand/90">
      <PolynesianFlower className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-hibiscus/25" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <PolynesianFlower className="h-5 w-5 shrink-0 text-hibiscus" />
            Ara Rapa Nui
          </p>
          <p className="mt-2 text-sm text-sand/70">{t.home.heroSubtitle}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          {visibility.showPackages && (
            <Link href="/catalogo/paquetes" className="hover:text-white">
              {t.nav.packages}
            </Link>
          )}
          {visibility.showExperiences && (
            <Link href="/catalogo/experiencias" className="hover:text-white">
              {t.nav.experiences}
            </Link>
          )}
          {visibility.showProducts && (
            <Link href="/catalogo/productos" className="hover:text-white">
              {t.nav.products}
            </Link>
          )}
          {visibility.showVehicleRentals && (
            <Link href="/catalogo/vehiculos" className="hover:text-white">
              {t.nav.vehicleRentals}
            </Link>
          )}
          {visibility.showResidentProducts && (
            <Link href="/catalogo/productos-residentes" className="hover:text-white">
              {t.nav.residentProducts}
            </Link>
          )}
          {visibility.showBusinesses && (
            <Link href="/empresas" className="hover:text-white">
              {t.nav.businesses}
            </Link>
          )}
          {visibility.showSpecialRequest && (
            <Link href="/pedido-especial" className="hover:text-white">
              {t.nav.specialRequest}
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-sand/70">
          <p>Rapa Nui, Chile</p>
          <div className="mt-2">
            <AccountLink />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-sand/60">
        Creado por{" "}
        <a
          href="https://github.com/Macaperalta35"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          🦇 Lilith
        </a>{" "}
        con ❤️
      </div>
    </footer>
  );
}
