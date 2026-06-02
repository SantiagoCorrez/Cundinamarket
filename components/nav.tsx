"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Newspaper, User, LayoutGrid, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Inicio", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/explore", label: "Servicios", icon: LayoutGrid },
  { href: "/news", label: "Noticias", icon: Newspaper },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-md">
      <div className="bg-surface/95 backdrop-blur border-t border-line px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        <ul className="flex items-stretch justify-between">
          {items.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + "/");
            const Icon = it.icon;
            return (
              <li key={it.href} className="flex-1">
                <Link
                  href={it.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-1.5 rounded-2xl transition",
                    active ? "text-ink" : "text-ink-faint",
                  )}
                >
                  <span
                    className={cn(
                      "grid place-items-center h-8 w-12 rounded-full transition",
                      active && "bg-brand",
                    )}
                  >
                    <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                  </span>
                  <span className="text-[11px] font-medium">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function BackBar({ title, right }: { title: string; right?: React.ReactNode }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-line">
      <div className="h-14 flex items-center gap-2 px-3">
        <button
          onClick={() => router.back()}
          aria-label="Volver"
          className="h-10 w-10 grid place-items-center rounded-full hover:bg-bg active:scale-95 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-[17px] truncate flex-1">{title}</h1>
        {right}
      </div>
    </header>
  );
}
