"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-sand-dark/80 bg-volcanic text-sand/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-white">Ara Rapa Nui</p>
          <p className="mt-2 text-sm text-sand/70">{t.home.heroSubtitle}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link href="/catalogo/paquetes" className="hover:text-white">
            {t.nav.packages}
          </Link>
          <Link href="/catalogo/experiencias" className="hover:text-white">
            {t.nav.experiences}
          </Link>
          <Link href="/catalogo/productos" className="hover:text-white">
            {t.nav.products}
          </Link>
          <Link href="/catalogo/vehiculos" className="hover:text-white">
            {t.nav.vehicleRentals}
          </Link>
          <Link href="/catalogo/productos-residentes" className="hover:text-white">
            {t.nav.residentProducts}
          </Link>
          <Link href="/empresas" className="hover:text-white">
            {t.nav.businesses}
          </Link>
          <Link href="/pedido-especial" className="hover:text-white">
            {t.nav.specialRequest}
          </Link>
        </div>

        <div className="text-sm text-sand/70">
          <p>Rapa Nui, Chile</p>
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
