import { notFound } from "next/navigation";
import { Phone, MessageCircle, MapPin, Clock, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Card, Stars, VerifiedBadge, Logo, Badge, SectionTitle } from "@/components/ui";
import { FavoriteButton, RateButton, ReportButton } from "@/components/business-interactions";
import { whatsappLink, telLink, formatCOP, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      photos: true,
      products: true,
      promotions: { where: { active: true }, orderBy: { createdAt: "desc" } },
      ratings: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 8 },
    },
  });

  if (!business) notFound();

  // contador de vistas (no bloqueante)
  prisma.business.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const favorited = session
    ? !!(await prisma.favorite.findUnique({
        where: { userId_businessId: { userId: session.id, businessId: id } },
      }))
    : false;

  const waMsg = `Hola, te contacto desde CundiMarket por ${business.name}.`;

  return (
    <div>
      <BackBar
        title={business.name}
        right={<FavoriteButton businessId={id} initial={favorited} isAuthed={!!session} />}
      />

      {/* Encabezado */}
      <div className="px-4 pt-4 flex items-start gap-3">
        <Logo name={business.name} src={business.logoUrl} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-extrabold text-ink">{business.name}</h1>
            {business.status === "VERIFIED" && <VerifiedBadge />}
          </div>
          <p className="text-sm text-ink-soft">
            {business.category.icon} {business.category.name}
            {business.subcategory ? ` · ${business.subcategory.name}` : ""}
          </p>
          <div className="mt-1">
            <Stars value={business.ratingAvg} count={business.ratingCount} size={16} />
          </div>
        </div>
      </div>

      {/* Datos de contacto */}
      <div className="px-4 mt-4 space-y-2 text-sm">
        <p className="flex items-center gap-2 text-ink-soft">
          <MapPin size={16} className="text-ink shrink-0" />
          {business.address}
          {business.neighborhood ? `, ${business.neighborhood}` : ""}, {business.municipality}
        </p>
        {business.schedule && (
          <p className="flex items-center gap-2 text-ink-soft">
            <Clock size={16} className="text-ink shrink-0" /> {business.schedule}
          </p>
        )}
        <p className="flex items-center gap-2 text-ink-soft">
          <Phone size={16} className="text-ink shrink-0" /> {business.phone}
        </p>
        <div className="flex items-center gap-3 pt-1">
          {business.instagram && (
            <a href={business.instagram} target="_blank" className="text-sm font-medium text-info">Instagram</a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" className="text-sm font-medium text-info">Facebook</a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" className="text-ink-soft inline-flex items-center gap-1 text-sm"><Globe size={16} /> Sitio web</a>
          )}
        </div>
      </div>

      {/* Galería */}
      {business.photos.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar px-4">
          {business.photos.map((ph) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={ph.id}
              src={ph.url}
              alt=""
              className="h-40 w-56 object-cover rounded-2xl shrink-0 bg-bg"
            />
          ))}
        </div>
      )}

      {/* Descripción */}
      {business.description && (
        <section className="px-4 mt-5">
          <SectionTitle>Descripción</SectionTitle>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">{business.description}</p>
        </section>
      )}

      {/* Promociones */}
      {business.promotions.length > 0 && (
        <section className="px-4 mt-5 space-y-2">
          <SectionTitle>🔥 Promociones vigentes</SectionTitle>
          {business.promotions.map((p) => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              {p.discount ? (
                <span className="bg-brand text-brand-ink font-extrabold rounded-xl px-2.5 py-1">-{p.discount}%</span>
              ) : (
                <span className="text-2xl">🔥</span>
              )}
              <div>
                <p className="font-semibold text-ink">{p.title}</p>
                {p.description && <p className="text-xs text-ink-soft">{p.description}</p>}
              </div>
            </Card>
          ))}
        </section>
      )}

      {/* Menú / Catálogo */}
      {business.products.length > 0 && (
        <section className="px-4 mt-5 space-y-2">
          <SectionTitle>📋 Menú / Catálogo</SectionTitle>
          {business.products.map((pr) => (
            <Card key={pr.id} className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-ink truncate">{pr.name}</p>
                {pr.description && <p className="text-xs text-ink-soft truncate">{pr.description}</p>}
              </div>
              {pr.price ? <span className="font-semibold text-ink shrink-0">{formatCOP(pr.price)}</span> : null}
            </Card>
          ))}
        </section>
      )}

      {/* Calificaciones */}
      <section className="px-4 mt-5 space-y-2">
        <SectionTitle action={<RateButton targetId={id} type="business" isAuthed={!!session} />}>
          Calificaciones
        </SectionTitle>
        {business.ratings.length ? (
          business.ratings.map((r) => (
            <Card key={r.id} className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.user.name}</span>
                <Stars value={r.stars} />
              </div>
              {r.comment && <p className="text-sm text-ink-soft mt-1">{r.comment}</p>}
              <p className="text-xs text-ink-faint mt-1">{timeAgo(r.createdAt)}</p>
            </Card>
          ))
        ) : (
          <p className="text-sm text-ink-soft">Sé el primero en calificar este comercio.</p>
        )}
      </section>

      <div className="px-4 mt-5 flex justify-center">
        <ReportButton targetId={id} targetType="BUSINESS" isAuthed={!!session} />
      </div>

      {/* Barra de contacto fija */}
      <div className="sticky bottom-0 mt-6 bg-surface/95 backdrop-blur border-t border-line p-3 flex gap-2">
        <a href={telLink(business.phone)} className="flex-1 h-12 rounded-2xl bg-ink text-white font-semibold flex items-center justify-center gap-2">
          <Phone size={18} /> Llamar
        </a>
        {business.whatsapp && (
          <a
            href={whatsappLink(business.whatsapp, waMsg)}
            target="_blank"
            className="flex-1 h-12 rounded-2xl bg-brand text-brand-ink font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
