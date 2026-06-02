import { prisma } from "@/lib/prisma";
import { Card, Button, Field, Input } from "@/components/ui";
import { createCategory } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { businesses: true, subcategories: true } } },
  });

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold">Categorías</h1>
      <p className="text-ink-soft text-sm mt-1">Gestiona la clasificación de comercios.</p>

      <Card className="p-4 mt-4">
        <form action={createCategory} className="flex flex-wrap gap-3 items-end">
          <div className="w-20">
            <Field label="Ícono"><Input name="icon" placeholder="🏪" defaultValue="🏪" /></Field>
          </div>
          <div className="flex-1 min-w-40">
            <Field label="Nueva categoría"><Input name="name" placeholder="Nombre de la categoría" required /></Field>
          </div>
          <Button>Agregar</Button>
        </form>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {categories.map((c) => (
          <Card key={c.id} className="p-4 flex items-center gap-3">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-ink-soft">
                {c._count.businesses} comercios · {c._count.subcategories} subcategorías
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
