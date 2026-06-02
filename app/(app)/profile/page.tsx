import Link from "next/link";
import { Heart, Store, Shield, Bell, Settings, ChevronRight, LogOut, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { Card, Button, Logo } from "@/components/ui";
import { BusinessCard } from "@/components/cards";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="p-6 pt-16 flex flex-col items-center text-center min-h-[70dvh] justify-center">
        <div className="h-20 w-20 rounded-full bg-bg grid place-items-center mb-4">
          <User size={36} className="text-ink-faint" />
        </div>
        <h1 className="text-xl font-extrabold">Tu cuenta</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-xs">
          Inicia sesión para guardar favoritos, calificar comercios y publicar.
        </p>
        <div className="w-full max-w-xs mt-6 space-y-2">
          <Link href="/login"><Button size="lg" className="w-full">Iniciar sesión</Button></Link>
          <Link href="/register"><Button variant="outline" size="lg" className="w-full">Crear cuenta</Button></Link>
        </div>
      </div>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    include: { business: { include: { category: true, _count: { select: { promotions: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const links = [
    session.role === "MERCHANT" && { href: "/merchant", icon: Store, label: "Mi negocio" },
    session.role === "ADMIN" && { href: "/admin", icon: Shield, label: "Panel administrativo" },
    { href: "/empleo/perfil", icon: User, label: "Mi perfil laboral" },
    { href: "#", icon: Bell, label: "Notificaciones" },
    { href: "#", icon: Settings, label: "Configuración" },
  ].filter(Boolean) as { href: string; icon: typeof Store; label: string }[];

  return (
    <div>
      <header className="bg-ink text-white rounded-b-[2rem] px-5 pt-8 pb-7 flex items-center gap-4">
        <Logo name={session.name} size={64} />
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold truncate">{session.name}</h1>
          <p className="text-white/60 text-sm truncate">{session.email}</p>
          <p className="text-brand text-xs font-semibold mt-0.5">
            📍 {session.municipality} · {session.role === "MERCHANT" ? "Comerciante" : session.role === "ADMIN" ? "Administrador" : "Ciudadano"}
          </p>
        </div>
      </header>

      <div className="p-4 space-y-2">
        {links.map((l) => (
          <Link key={l.label} href={l.href}>
            <Card className="p-3.5 flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-bg grid place-items-center">
                <l.icon size={18} className="text-ink" />
              </span>
              <span className="flex-1 font-medium">{l.label}</span>
              <ChevronRight size={18} className="text-ink-faint" />
            </Card>
          </Link>
        ))}
      </div>

      <section className="p-4 space-y-3">
        <h2 className="font-bold flex items-center gap-2">
          <Heart size={18} className="text-danger" /> Mis favoritos
        </h2>
        {favorites.length ? (
          favorites.map((f) => <BusinessCard key={f.id} b={f.business} />)
        ) : (
          <p className="text-sm text-ink-soft">Aún no tienes comercios favoritos.</p>
        )}
      </section>

      <div className="p-4">
        <form action={logoutAction}>
          <Button variant="outline" className="w-full text-danger border-danger/30">
            <LogOut size={18} /> Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
