import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ModuleHero, FilterChips } from "@/components/module-hero";
import { JobCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";
import { CONTRACT_TYPES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function EmpleoPage({
  searchParams,
}: {
  searchParams: Promise<{ contract?: string }>;
}) {
  const { contract } = await searchParams;
  const jobs = await prisma.job.findMany({
    where: { active: true, ...(contract ? { contractType: contract } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <ModuleHero
        title="CundiEmpleo"
        subtitle="Oportunidades en tu municipio"
        icon="💼"
        cta={{ href: "/empleo/nuevo", label: "+ Publicar vacante" }}
      />
      <div className="flex items-center justify-between px-4 pt-3">
        <Link href="/empleo/perfil" className="text-sm font-semibold text-brand-strong">
          👤 Mi perfil laboral
        </Link>
      </div>
      <FilterChips
        base="/empleo"
        param="contract"
        current={contract}
        options={CONTRACT_TYPES.map((c) => ({ key: c, label: c }))}
      />
      <div className="px-4 space-y-3">
        {jobs.length ? (
          jobs.map((j) => <JobCard key={j.id} j={j} />)
        ) : (
          <EmptyState icon="💼" title="Sin vacantes por ahora" subtitle="Vuelve pronto o publica una vacante." />
        )}
      </div>
    </div>
  );
}
