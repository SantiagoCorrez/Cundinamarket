import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { Card, Button, Logo, Input } from "@/components/ui";
import { StatusPill } from "@/components/status";
import { approveBusiness, rejectBusiness, suspendBusiness, toggleFeatured } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const tabs = [
  { key: "", label: "Todos" },
  { key: "IN_REVIEW", label: "Por verificar" },
  { key: "VERIFIED", label: "Verificados" },
  { key: "REJECTED", label: "Rechazados" },
  { key: "SUSPENDED", label: "Suspendidos" },
];

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where: Prisma.BusinessWhereInput = status ? { status } : {};
  const businesses = await prisma.business.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { category: true, owner: { select: { name: true, email: true } }, photos: true },
  });

  return (
    <div className="p-5 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-extrabold">Comercios</h1>
      <p className="text-ink-soft text-sm mt-1">Verifica y administra los establecimientos registrados.</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/comercios?status=${t.key}` : "/admin/comercios"}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition",
              (status || "") === t.key ? "bg-ink text-white border-ink" : "bg-surface border-line text-ink-soft",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3 mt-4">
        {businesses.map((b) => (
          <Card key={b.id} className="p-4">
            <div className="flex items-start gap-3">
              <Logo name={b.name} src={b.logoUrl} size={56} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{b.name}</p>
                  <StatusPill status={b.status} />
                  {b.featured && <span className="text-xs bg-brand/20 text-brand-ink rounded-full px-2 py-0.5">⭐ Destacado</span>}
                </div>
                <p className="text-sm text-ink-soft">{b.category.icon} {b.category.name} · {b.municipality}</p>
                <p className="text-xs text-ink-faint mt-0.5">
                  {b.address} · Tel: {b.phone} · Por: {b.owner.name} ({b.owner.email})
                </p>
                {b.rejectionNote && <p className="text-xs text-danger mt-1">Nota: {b.rejectionNote}</p>}
              </div>
            </div>

            {b.photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3">
                {b.photos.map((ph) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={ph.id} src={ph.url} alt={ph.type} className="h-24 w-32 object-cover rounded-xl shrink-0 bg-bg" title={ph.type} />
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              {b.status !== "VERIFIED" && (
                <form action={approveBusiness.bind(null, b.id)}>
                  <Button size="sm" className="bg-success text-white">✔ Aprobar</Button>
                </form>
              )}
              {b.status === "VERIFIED" && (
                <>
                  <form action={suspendBusiness.bind(null, b.id)}>
                    <Button size="sm" variant="danger">Suspender</Button>
                  </form>
                  <form action={toggleFeatured.bind(null, b.id, !b.featured)}>
                    <Button size="sm" variant="outline">{b.featured ? "Quitar destacado" : "Destacar"}</Button>
                  </form>
                </>
              )}
              <Link href={`/business/${b.id}`}>
                <Button size="sm" variant="ghost">Ver ficha</Button>
              </Link>
            </div>

            {b.status !== "VERIFIED" && b.status !== "SUSPENDED" && (
              <details className="mt-2">
                <summary className="text-sm text-danger cursor-pointer">Rechazar / solicitar correcciones</summary>
                <form action={rejectBusiness} className="flex gap-2 mt-2">
                  <input type="hidden" name="id" value={b.id} />
                  <Input name="note" placeholder="Motivo del rechazo" className="flex-1" />
                  <Button size="sm" variant="danger">Rechazar</Button>
                </form>
              </details>
            )}
          </Card>
        ))}
        {!businesses.length && <p className="text-ink-soft text-sm">No hay comercios en este estado.</p>}
      </div>
    </div>
  );
}
