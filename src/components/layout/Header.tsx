"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartIcon } from "./CartIcon";

export function Header() {
  const t = useTranslations();

  const links = [
    { href: "/catalogo/paquetes", label: t.nav.packages },
    { href: "/catalogo/experiencias", label: t.nav.experiences },
    { href: "/catalogo/productos", label: t.nav.products },
    { href: "/catalogo/vehiculos", label: t.nav.vehicleRentals },
    { href: "/catalogo/productos-residentes", label: t.nav.residentProducts },
    { href: "/pedido-especial", label: t.nav.specialRequest },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-sand-dark/80 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold text-volcanic">
          Ara Rapa Nui
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-5 gap-y-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-volcanic/80 transition-colors hover:text-ocean"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <CartIcon />
        </div>
      </div>

      <nav className="flex items-center gap-4 overflow-x-auto border-t border-sand-dark/60 px-4 py-2 lg:hidden">
        {links.map((link) => (
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
