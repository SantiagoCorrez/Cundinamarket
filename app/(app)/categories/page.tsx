import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { CategoryTile } from "@/components/cards";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { businesses: true } } },
  });

  return (
    <div>
      <BackBar title="Categorías" />
      <div className="p-4 grid grid-cols-3 gap-3">
        {categories.map((c) => (
          <CategoryTile key={c.id} slug={c.slug} name={c.name} icon={c.icon} />
        ))}
      </div>
    </div>
  );
}
