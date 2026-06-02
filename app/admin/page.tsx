import Link from "next/link";
import { Store, Users, Home, Wrench, Briefcase, Flag, Eye, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalBiz,
    verifiedBiz,
    pendingBiz,
    users,
    properties,
    services,
    jobs,
    openReports,
    promos,
    byCategory,
    byMunicipality,
    mostViewed,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: "VERIFIED" } }),
    prisma.business.count({ where: { status: { in: ["IN_REVIEW", "PENDING"] } } }),
    prisma.user.count(),
    prisma.property.count(),
    prisma.serviceProvider.count(),
    prisma.job.count(),
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.promotion.count({ where: { active: true } }),
    prisma.business.groupBy({ by: ["categoryId"], _count: true, orderBy: { _count: { categoryId: "desc" } }, take: 6 }),
    prisma.business.groupBy({ by: ["municipality"], _count: true, orderBy: { _count: { municipality: "desc" } }, take: 6 }),
    prisma.business.findMany({ where: { status: "VERIFIED" }, orderBy: { views: "desc" }, take: 6, include: { category: true } }),
  ]);

  const cats = await prisma.category.findMany({ where: { id: { in: byCategory.map((c) => c.categoryId) } } });
  const catName = (id: string) => cats.find((c) => c.id === id);

  const stats = [
    { label: "Comercios", value: totalBiz, icon: Store, sub: `${verifiedBiz} verificados` },
    { label: "Por verificar", value: pendingBiz, icon: TrendingUp, sub: "pendientes", href: "/admin/comercios?status=IN_REVIEW" },
    { label: "Usuarios", value: users, icon: Users, sub: "registrados" },
    { label: "Inmuebles", value: properties, icon: Home, sub: "CundiEspacios" },
    { label: "Servicios", value: services, icon: Wrench, sub: "CundiServicios" },
    { label: "Vacantes", value: jobs, icon: Briefcase, sub: "CundiEmpleo" },
    { label: "Promociones", value: promos, icon: TrendingUp, sub: "activas" },
    { label: "Reportes", value: openReports, icon: Flag, sub: "abiertos", href: "/admin/reportes" },
  ];

  const maxCat = Math.max(1, ...byCategory.map((c) => c._count));

  return (
    <div className="p-5 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-extrabold">Panel de control</h1>
      <p className="text-ink-soft text-sm mt-1">Resumen de actividad de CundiMarket · Piloto Mosquera</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {stats.map((s) => {
          const inner = (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <span className="h-9 w-9 rounded-xl bg-bg grid place-items-center">
                  <s.icon size={18} className="text-ink" />
                </span>
                <span className="text-2xl font-extrabold">{s.value}</span>
              </div>
              <p className="text-sm font-semibold mt-2">{s.label}</p>
              <p className="text-xs text-ink-faint">{s.sub}</p>
            </Card>
          );
          return s.href ? <Link key={s.label} href={s.href}>{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Card className="p-5">
          <h2 className="font-bold mb-3">Categorías con más comercios</h2>
          <div className="space-y-2.5">
            {byCategory.map((c) => {
              const cat = catName(c.categoryId);
              return (
                <div key={c.categoryId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat?.icon} {cat?.name}</span>
                    <span className="font-semibold">{c._count}</span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-strong rounded-full" style={{ width: `${(c._count / maxCat) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold mb-3 flex items-center gap-2"><Eye size={16} /> Negocios más visitados</h2>
          <div className="space-y-2">
            {mostViewed.map((b, i) => (
              <Link key={b.id} href={`/business/${b.id}`} className="flex items-center gap-3 py-1.5">
                <span className="text-ink-faint font-bold w-5">{i + 1}</span>
                <span className="flex-1 text-sm truncate">{b.category.icon} {b.name}</span>
                <span className="text-sm font-semibold text-ink-soft">{b.views} 👁</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold mb-3">Municipios con mayor actividad</h2>
          <div className="space-y-2">
            {byMunicipality.map((m) => (
              <div key={m.municipality} className="flex justify-between text-sm py-1">
                <span>📍 {m.municipality}</span>
                <span className="font-semibold">{m._count} comercios</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
