"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Newspaper, Flag, Phone, FolderTree } from "lucide-react";
import { BrandMark } from "./brand";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/comercios", label: "Comercios", icon: Store },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/reportes", label: "Reportes", icon: Flag },
  { href: "/admin/contactos", label: "Canales de atención", icon: Phone },
];

export function AdminSidebar({ pending }: { pending: number }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-ink text-white min-h-dvh sticky top-0 p-4">
      <Link href="/admin" className="flex items-center gap-2 px-2 py-3">
        <BrandMark size={32} />
        <span className="font-extrabold">Cundi<span className="text-brand">Admin</span></span>
      </Link>
      <nav className="mt-4 space-y-1">
        {links.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition",
                active ? "bg-brand text-brand-ink font-semibold" : "text-white/70 hover:bg-white/10",
              )}
            >
              <l.icon size={18} />
              {l.label}
              {l.href === "/admin/comercios" && pending > 0 && (
                <span className="ml-auto bg-danger text-white text-xs rounded-full px-1.5 py-0.5">{pending}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/home" className="mt-auto text-white/50 text-xs px-3 py-2 hover:text-white">
        ← Volver a la app
      </Link>
    </aside>
  );
}

export function AdminMobileNav({ pending }: { pending: number }) {
  const pathname = usePathname();
  return (
    <nav className="md:hidden flex gap-1 overflow-x-auto no-scrollbar bg-ink px-2 py-2 sticky top-0 z-30">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap",
              active ? "bg-brand text-brand-ink font-semibold" : "text-white/70",
            )}
          >
            <l.icon size={15} />
            {l.label}
            {l.href === "/admin/comercios" && pending > 0 && (
              <span className="bg-danger text-white rounded-full px-1.5">{pending}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
