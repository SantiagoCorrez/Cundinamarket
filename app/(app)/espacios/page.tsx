import { prisma } from "@/lib/prisma";
import { ModuleHero, FilterChips } from "@/components/module-hero";
import { PropertyCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";
import { OFFER_TYPES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function EspaciosPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string }>;
}) {
  const { offer } = await searchParams;
  const properties = await prisma.property.findMany({
    where: { ...(offer ? { offerType: offer } : {}) },
    orderBy: { createdAt: "desc" },
    include: { photos: true },
    take: 50,
  });

  return (
    <div>
      <ModuleHero
        title="CundiEspacios"
        subtitle="Encuentra tu próximo hogar"
        icon="🏠"
        cta={{ href: "/espacios/nuevo", label: "+ Publicar inmueble" }}
      />
      <FilterChips base="/espacios" param="offer" current={offer} options={OFFER_TYPES.map((o) => ({ key: o.key, label: o.label }))} />
      <div className="px-4 space-y-3">
        {properties.length ? (
          properties.map((p) => <PropertyCard key={p.id} p={p} />)
        ) : (
          <EmptyState icon="🏠" title="Aún no hay publicaciones" subtitle="Sé el primero en publicar un inmueble." />
        )}
      </div>
    </div>
  );
}
