import { notFound } from "next/navigation";
import { Phone, MessageCircle, MapPin, BedDouble, Bath, Car, Ruler } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Badge, VerifiedBadge, Card } from "@/components/ui";
import { ReportButton } from "@/components/business-interactions";
import { whatsappLink, telLink, formatCOP } from "@/lib/utils";
import { OFFER_TYPES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const p = await prisma.property.findUnique({ where: { id }, include: { photos: true } });
  if (!p) notFound();

  const offer = OFFER_TYPES.find((o) => o.key === p.offerType);
  const specs = [
    p.rooms ? { icon: BedDouble, label: `${p.rooms} hab.` } : null,
    p.bathrooms ? { icon: Bath, label: `${p.bathrooms} baños` } : null,
    p.parking ? { icon: Car, label: "Parqueadero" } : null,
    p.area ? { icon: Ruler, label: `${p.area} m²` } : null,
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <div>
      <BackBar title={`${p.propertyType}`} />
      {p.photos.length > 0 && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {p.photos.map((ph) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={ph.id} src={ph.url} alt="" className="h-56 w-72 object-cover shrink-0 bg-bg" />
          ))}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{offer?.label}</Badge>
          {p.verified && <VerifiedBadge small />}
          {p.status !== "ACTIVE" && <Badge tone="neutral">{p.status === "RESERVED" ? "Reservado" : "Cerrado"}</Badge>}
        </div>
        <h1 className="text-2xl font-extrabold mt-2">
          {formatCOP(p.price)}
          {p.offerType === "RENT" && p.price ? <span className="text-base font-medium text-ink-soft"> /mes</span> : null}
        </h1>
        <p className="text-sm text-ink-soft flex items-center gap-1 mt-1">
          <MapPin size={14} /> {p.neighborhood ? `${p.neighborhood}, ` : ""}{p.municipality}
          {p.address ? ` · ${p.address}` : ""}
        </p>

        {specs.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {specs.map((s, i) => (
              <Card key={i} className="py-3 flex flex-col items-center gap-1">
                <s.icon size={18} className="text-ink" />
                <span className="text-xs text-ink-soft text-center">{s.label}</span>
              </Card>
            ))}
          </div>
        )}

        {p.description && (
          <>
            <h2 className="font-bold mt-5">Descripción</h2>
            <p className="text-sm text-ink-soft mt-1 leading-relaxed">{p.description}</p>
          </>
        )}
        {p.services && (
          <>
            <h2 className="font-bold mt-4">Servicios incluidos</h2>
            <p className="text-sm text-ink-soft mt-1">{p.services}</p>
          </>
        )}
        {p.stratum && <p className="text-sm text-ink-soft mt-3">Estrato {p.stratum}</p>}

        <div className="mt-5 flex justify-center">
          <ReportButton targetId={id} targetType="PROPERTY" isAuthed={!!session} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-surface/95 backdrop-blur border-t border-line p-3">
        <p className="text-xs text-ink-soft mb-2 px-1">Contacto: {p.ownerName}</p>
        <div className="flex gap-2">
          <a href={telLink(p.phone)} className="flex-1 h-12 rounded-2xl bg-ink text-white font-semibold flex items-center justify-center gap-2">
            <Phone size={18} /> Llamar
          </a>
          {p.whatsapp && (
            <a
              href={whatsappLink(p.whatsapp, `Hola, me interesa el ${p.propertyType} publicado en CundiEspacios.`)}
              target="_blank"
              className="flex-1 h-12 rounded-2xl bg-brand text-brand-ink font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
