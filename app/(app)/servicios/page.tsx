import { prisma } from "@/lib/prisma";
import { ModuleHero, FilterChips } from "@/components/module-hero";
import { ServiceCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";
import { SERVICE_CATEGORIES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const providers = await prisma.serviceProvider.findMany({
    where: { ...(cat ? { category: cat } : {}) },
    orderBy: [{ verified: "desc" }, { ratingAvg: "desc" }],
    take: 50,
  });

  return (
    <div>
      <ModuleHero
        title="CundiServicios"
        subtitle="Encuentra expertos cerca de ti"
        icon="🛠️"
        cta={{ href: "/servicios/nuevo", label: "+ Ofrecer servicio" }}
      />
      <FilterChips
        base="/servicios"
        param="cat"
        current={cat}
        options={SERVICE_CATEGORIES.map((c) => ({ key: c.key, label: `${c.icon} ${c.name.replace("Servicios ", "")}` }))}
      />
      <div className="px-4 space-y-3">
        {providers.length ? (
          providers.map((s) => <ServiceCard key={s.id} s={s} />)
        ) : (
          <EmptyState icon="🛠️" title="Sin prestadores aún" subtitle="Sé el primero en ofrecer tu servicio." />
        )}
      </div>
    </div>
  );
}
