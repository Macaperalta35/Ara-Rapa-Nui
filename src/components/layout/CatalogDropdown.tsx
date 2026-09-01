"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/LanguageProvider";

export function CatalogDropdown() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = [
    { href: "/catalogo/paquetes", label: t.nav.packages },
    { href: "/catalogo/experiencias", label: t.nav.experiences },
    { href: "/catalogo/productos", label: t.nav.products },
    { href: "/catalogo/vehiculos", label: t.nav.vehicleRentals },
    { href: "/catalogo/productos-residentes", label: t.nav.residentProducts },
  ];

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-volcanic/80 transition-colors hover:text-ocean"
        aria-expanded={open}
      >
        Catálogo
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute left-0 top-full z-50 mt-2 w-56 origin-top-left rounded-xl border border-sand-dark bg-white p-2 shadow-lg transition-all duration-150 ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-volcanic/80 transition-colors hover:bg-sand hover:text-ocean"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
