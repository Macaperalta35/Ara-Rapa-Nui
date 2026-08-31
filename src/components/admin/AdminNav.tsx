"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/paquetes", label: "Paquetes" },
  { href: "/admin/experiencias", label: "Experiencias" },
  { href: "/admin/productos", label: "Productos" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-sand-dark bg-white px-4 py-6">
      <div>
        <p className="px-2 font-display text-lg font-semibold text-volcanic">Ara Rapa Nui</p>
        <nav className="mt-6 flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-terracotta/10 text-terracotta" : "text-volcanic/70 hover:bg-sand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={logout}
        className="rounded-lg px-3 py-2 text-left text-sm font-medium text-volcanic/60 hover:bg-sand"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
