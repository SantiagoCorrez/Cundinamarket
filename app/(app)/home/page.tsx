import Link from "next/link";
import { Search, MapPin, Bell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { SectionTitle } from "@/components/ui";
import {
  CategoryChip,
  BusinessFeaturedCard,
  PromoCard,
  NewsCard,
} from "@/components/cards";
import { ModuleGrid } from "@/components/module-grid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  const [categories, featured, promos, news] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.business.findMany({
      where: { status: "VERIFIED" },
      orderBy: [{ featured: "desc" }, { ratingAvg: "desc" }],
      take: 8,
      include: { category: true, _count: { select: { promotions: true } } },
    }),
    prisma.promotion.findMany({
      where: { active: true, business: { status: "VERIFIED" } },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { business: { select: { id: true, name: true, logoUrl: true } } },
    }),
    prisma.news.findMany({ orderBy: { publishedAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="animate-fadeup">
      {/* Header */}
      <header className="bg-ink text-white rounded-b-[2rem] px-5 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">
              {session ? `Hola, ${session.name.split(" ")[0]} 👋` : "Hola 👋"}
            </p>
            <button className="flex items-center gap-1 font-semibold mt-0.5">
              <MapPin size={16} className="text-brand" />
              {session?.municipality || "Mosquera"}
            </button>
          </div>
          <Link
            href={session ? "/profile" : "/login"}
            className="h-10 w-10 rounded-full bg-white/10 grid place-items-center"
          >
            <Bell size={18} />
          </Link>
        </div>

        <Link
          href="/search"
          className="mt-5 flex items-center gap-2 bg-white rounded-2xl h-12 px-4 text-ink-faint"
        >
          <Search size={20} />
          <span className="text-[15px]">Buscar comercios, productos…</span>
        </Link>
      </header>

      {/* Categorías */}
      <section className="mt-5 space-y-3">
        <SectionTitle action={<Link href="/categories" className="text-sm font-semibold text-brand-strong">Ver todo</Link>}>
          Categorías
        </SectionTitle>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 -mx-1">
          {categories.map((c) => (
            <CategoryChip key={c.id} slug={c.slug} name={c.name} icon={c.icon} />
          ))}
        </div>
      </section>

      {/* Módulos */}
      <section className="mt-6 px-4">
        <ModuleGrid />
      </section>

      {/* Destacados */}
      <section className="mt-6 space-y-3">
        <SectionTitle action={<Link href="/search" className="text-sm font-semibold text-brand-strong">Ver más</Link>}>
          ⭐ Comercios destacados
        </SectionTitle>
        {featured.length ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
            {featured.map((b) => (
              <BusinessFeaturedCard key={b.id} b={b} />
            ))}
          </div>
        ) : (
          <p className="px-4 text-sm text-ink-soft">Aún no hay comercios verificados.</p>
        )}
      </section>

      {/* Promociones */}
      {promos.length > 0 && (
        <section className="mt-6 space-y-3">
          <SectionTitle>🔥 Promociones del día</SectionTitle>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
            {promos.map((p) => (
              <PromoCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* Noticias */}
      <section className="mt-6 space-y-3 px-4">
        <SectionTitle action={<Link href="/news" className="text-sm font-semibold text-brand-strong">Ver todas</Link>}>
          📰 Noticias del municipio
        </SectionTitle>
        <div className="space-y-3">
          {news.slice(0, 3).map((n) => (
            <NewsCard key={n.id} n={n} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
