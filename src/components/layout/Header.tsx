"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartIcon } from "./CartIcon";
import { CatalogDropdown } from "./CatalogDropdown";
import { PolynesianFlower } from "@/components/ui/PolynesianFlower";
import type { CategoryVisibility } from "@/lib/supabase/site-settings";

export function Header({ visibility }: { visibility: CategoryVisibility }) {
  const t = useTranslations();

  const mobileLinks = [
    visibility.showPackages && { href: "/catalogo/paquetes", label: t.nav.packages },
    visibility.showExperiences && { href: "/catalogo/experiencias", label: t.nav.experiences },
    visibility.showProducts && { href: "/catalogo/productos", label: t.nav.products },
    visibility.showVehicleRentals && { href: "/catalogo/vehiculos", label: t.nav.vehicleRentals },
    visibility.showResidentProducts && {
      href: "/catalogo/productos-residentes",
      label: t.nav.residentProducts,
    },
    visibility.showBusinesses && { href: "/empresas", label: t.nav.businesses },
    visibility.showSpecialRequest && { href: "/pedido-especial", label: t.nav.specialRequest },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <header className="sticky top-0 z-40 border-b border-sand-dark/80 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-volcanic">
          <PolynesianFlower className="h-6 w-6 shrink-0 text-hibiscus" />
          Ara Rapa Nui
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <CatalogDropdown visibility={visibility} />
          {visibility.showBusinesses && (
            <Link
              href="/empresas"
              className="text-sm font-medium text-volcanic/80 transition-colors hover:text-ocean"
            >
              {t.nav.businesses}
            </Link>
          )}
          {visibility.showSpecialRequest && (
            <Link
              href="/pedido-especial"
              className="text-sm font-medium text-volcanic/80 transition-colors hover:text-ocean"
            >
              {t.nav.specialRequest}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <CartIcon />
        </div>
      </div>

      <nav className="flex items-center gap-4 overflow-x-auto border-t border-sand-dark/60 px-4 py-2 lg:hidden">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm font-medium text-volcanic/80"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
