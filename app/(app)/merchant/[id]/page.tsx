import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Card, Button, Field, Input, Textarea, Logo } from "@/components/ui";
import { StatusPill } from "@/components/status";
import { updateBusiness, togglePromotion, addProduct } from "@/lib/actions/merchant";
import { formatCOP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ManageBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ registered?: string }>;
}) {
  const { id } = await params;
  const { registered } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");

  const b = await prisma.business.findUnique({
    where: { id },
    include: { category: true, promotions: { orderBy: { createdAt: "desc" } }, products: true },
  });
  if (!b) notFound();
  if (b.ownerId !== session.id && session.role !== "ADMIN") redirect("/merchant");

  const statusMessage: Record<string, string> = {
    IN_REVIEW: "Nuestro equipo está revisando la información de tu negocio. Tiempo estimado: 24 – 48 horas. Te notificaremos cuando esté activo.",
    PENDING: "Completa el registro y las evidencias para iniciar la verificación.",
    VERIFIED: "¡Tu negocio ya aparece en la aplicación! Ahora puedes publicar promociones y productos.",
    REJECTED: b.rejectionNote || "El registro fue rechazado. Revisa y corrige la información.",
    SUSPENDED: "Tu comercio fue suspendido. Contacta al administrador.",
  };

  return (
    <div>
      <BackBar
        title="Mi negocio"
        right={
          b.status === "VERIFIED" ? (
            <Link href={`/business/${b.id}`} className="h-10 w-10 grid place-items-center rounded-full hover:bg-bg">
              <ExternalLink size={18} />
            </Link>
          ) : undefined
        }
      />

      <div className="p-4 space-y-4">
        {registered && (
          <Card className="p-4 bg-success/10 border-success/20 text-center animate-fadeup">
            <p className="text-3xl">✅</p>
            <p className="font-bold mt-1">Registro enviado correctamente</p>
            <p className="text-sm text-ink-soft mt-1">
              Tu negocio ha sido registrado. Nuestro equipo revisará la información antes de publicarlo.
            </p>
          </Card>
        )}

        {/* Estado */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Logo name={b.name} src={b.logoUrl} size={52} />
            <div className="flex-1">
              <p className="font-bold">{b.name}</p>
              <p className="text-xs text-ink-soft">{b.category.icon} {b.category.name}</p>
            </div>
          </div>
          <div className="mt-3">
            <StatusPill status={b.status} />
            <p className="text-sm text-ink-soft mt-2">{statusMessage[b.status]}</p>
          </div>
          {b.status === "VERIFIED" && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link href={`/merchant/${b.id}/promocion`}>
                <Button variant="soft" className="w-full" size="sm">Publicar promoción</Button>
              </Link>
              <Link href={`/business/${b.id}`}>
                <Button variant="outline" className="w-full" size="sm">Ver perfil público</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Editar información */}
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer font-semibold py-2">
            <Pencil size={16} /> Editar información
          </summary>
          <form action={updateBusiness} className="space-y-3 mt-2">
            <input type="hidden" name="id" value={b.id} />
            <Field label="Nombre"><Input name="name" defaultValue={b.name} /></Field>
            <Field label="Dirección" hint="Cambiarla puede requerir nueva verificación">
              <Input name="address" defaultValue={b.address} />
            </Field>
            <Field label="Barrio"><Input name="neighborhood" defaultValue={b.neighborhood || ""} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Teléfono"><Input name="phone" defaultValue={b.phone} /></Field>
              <Field label="WhatsApp"><Input name="whatsapp" defaultValue={b.whatsapp || ""} /></Field>
            </div>
            <Field label="Horario"><Input name="schedule" defaultValue={b.schedule || ""} /></Field>
            <Field label="Descripción"><Textarea name="description" defaultValue={b.description} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Instagram"><Input name="instagram" defaultValue={b.instagram || ""} /></Field>
              <Field label="Facebook"><Input name="facebook" defaultValue={b.facebook || ""} /></Field>
            </div>
            <Button className="w-full">Guardar cambios</Button>
          </form>
        </details>

        {/* Promociones */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">🔥 Promociones</h2>
            <Link href={`/merchant/${b.id}/promocion`} className="text-sm font-semibold text-brand-strong inline-flex items-center gap-1">
              <Plus size={15} /> Nueva
            </Link>
          </div>
          {b.promotions.length ? (
            <div className="space-y-2">
              {b.promotions.map((p) => (
                <Card key={p.id} className="p-3 flex items-center gap-3">
                  {p.discount ? (
                    <span className="bg-brand text-brand-ink font-bold rounded-xl px-2 py-1 text-sm">-{p.discount}%</span>
                  ) : <span className="text-xl">🔥</span>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.title}</p>
                    <p className={`text-xs ${p.active ? "text-success" : "text-ink-faint"}`}>{p.active ? "Activa" : "Inactiva"}</p>
                  </div>
                  <form action={togglePromotion.bind(null, p.id, b.id)}>
                    <Button variant="ghost" size="sm">{p.active ? "Pausar" : "Activar"}</Button>
                  </form>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Aún no tienes promociones.</p>
          )}
        </section>

        {/* Productos */}
        <section>
          <h2 className="font-bold mb-2">📋 Menú / Catálogo</h2>
          {b.products.length > 0 && (
            <div className="space-y-2 mb-3">
              {b.products.map((pr) => (
                <Card key={pr.id} className="p-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{pr.name}</span>
                  {pr.price ? <span className="text-sm font-semibold">{formatCOP(pr.price)}</span> : null}
                </Card>
              ))}
            </div>
          )}
          <form action={addProduct} className="flex gap-2 items-end">
            <input type="hidden" name="businessId" value={b.id} />
            <div className="flex-1">
              <Input name="name" placeholder="Producto / plato" required />
            </div>
            <div className="w-28">
              <Input name="price" type="number" inputMode="numeric" placeholder="Precio" />
            </div>
            <Button size="md" className="px-3"><Plus size={18} /></Button>
          </form>
        </section>
      </div>
    </div>
  );
}
