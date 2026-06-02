import { notFound } from "next/navigation";
import { Phone, MessageCircle, MapPin, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Logo, Stars, VerifiedBadge, Card, SectionTitle } from "@/components/ui";
import { RateButton, ReportButton } from "@/components/business-interactions";
import { whatsappLink, telLink, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const s = await prisma.serviceProvider.findUnique({
    where: { id },
    include: {
      photos: true,
      ratings: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!s) notFound();

  return (
    <div>
      <BackBar title="Prestador de servicio" />
      <div className="px-4 pt-4 flex items-start gap-3">
        <Logo name={s.providerName} src={s.photoUrl} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold">{s.providerName}</h1>
            {s.verified && <VerifiedBadge small />}
          </div>
          <p className="text-sm text-ink-soft">{s.serviceType}</p>
          <div className="mt-1">
            <Stars value={s.ratingAvg} count={s.ratingCount} size={16} />
          </div>
        </div>
      </div>

      <div className="px-4 mt-3 space-y-1.5 text-sm text-ink-soft">
        <p className="flex items-center gap-2"><MapPin size={15} className="text-ink" /> {s.coverageZone || s.municipality}</p>
        {s.yearsExperience ? (
          <p className="flex items-center gap-2"><BadgeCheck size={15} className="text-ink" /> {s.yearsExperience} años de experiencia</p>
        ) : null}
      </div>

      {s.description && (
        <section className="px-4 mt-4">
          <SectionTitle>Sobre el servicio</SectionTitle>
          <p className="text-sm text-ink-soft mt-2 leading-relaxed">{s.description}</p>
        </section>
      )}

      {s.photos.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar px-4">
          {s.photos.map((ph) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={ph.id} src={ph.url} alt="" className="h-36 w-48 object-cover rounded-2xl shrink-0 bg-bg" />
          ))}
        </div>
      )}

      <section className="px-4 mt-5 space-y-2">
        <SectionTitle action={<RateButton targetId={id} type="provider" isAuthed={!!session} />}>
          Calificaciones
        </SectionTitle>
        {s.ratings.length ? (
          s.ratings.map((r) => (
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
          <p className="text-sm text-ink-soft">Aún no hay calificaciones.</p>
        )}
      </section>

      <div className="px-4 mt-5 flex justify-center">
        <ReportButton targetId={id} targetType="SERVICE" isAuthed={!!session} />
      </div>

      <div className="sticky bottom-0 mt-6 bg-surface/95 backdrop-blur border-t border-line p-3 flex gap-2">
        <a href={telLink(s.phone)} className="flex-1 h-12 rounded-2xl bg-ink text-white font-semibold flex items-center justify-center gap-2">
          <Phone size={18} /> Llamar
        </a>
        {s.whatsapp && (
          <a
            href={whatsappLink(s.whatsapp, `Hola ${s.providerName}, te contacto desde CundiServicios.`)}
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
