import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { SearchControls } from "@/components/search-controls";
import { BusinessCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;

  const where: Prisma.BusinessWhereInput = {
    status: sort === "verified" ? "VERIFIED" : { in: ["VERIFIED"] },
  };
  if (category) where.category = { slug: category };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { products: { some: { name: { contains: q } } } },
      { neighborhood: { contains: q } },
    ];
  }
  if (sort === "promos") where.promotions = { some: { active: true } };

  let orderBy: Prisma.BusinessOrderByWithRelationInput = { ratingAvg: "desc" };
  if (sort === "recent") orderBy = { createdAt: "desc" };
  if (sort === "top") orderBy = { ratingAvg: "desc" };

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const results = await prisma.business.findMany({
    where,
    orderBy,
    take: 50,
    include: { category: true, _count: { select: { promotions: true } } },
  });

  return (
    <div>
      <SearchControls categories={categories} />
      <div className="px-4 pt-2">
        <p className="text-sm text-ink-soft mb-3">
          {results.length} {results.length === 1 ? "resultado" : "resultados"}
          {category ? ` en ${categories.find((c) => c.slug === category)?.name}` : ""}
        </p>
        {results.length ? (
          <div className="space-y-3">
            {results.map((b) => (
              <BusinessCard key={b.id} b={b} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sin resultados"
            subtitle="Prueba con otra categoría o término de búsqueda."
          />
        )}
      </div>
    </div>
  );
}
