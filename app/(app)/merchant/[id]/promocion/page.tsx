import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { createPromotion } from "@/lib/actions/merchant";

export const dynamic = "force-dynamic";

export default async function NewPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");
  const b = await prisma.business.findUnique({ where: { id } });
  if (!b) notFound();
  if (b.ownerId !== session.id && session.role !== "ADMIN") redirect("/merchant");

  return (
    <div>
      <BackBar title="Nueva promoción" />
      <form action={createPromotion} className="p-4 space-y-4">
        <input type="hidden" name="businessId" value={id} />
        <Field label="Título de la promoción" required>
          <Input name="title" placeholder="Ej: 2x1 en hamburguesas" required />
        </Field>
        <Field label="Descripción">
          <Textarea name="description" placeholder="Detalles de la promoción." />
        </Field>
        <Field label="Descuento (%)">
          <Input name="discount" type="number" inputMode="numeric" placeholder="20" />
        </Field>
        <Field label="Imagen de la promoción">
          <ImageUpload name="image" max={1} label="Imagen (opcional)" />
        </Field>
        <Button size="lg" className="w-full">Publicar promoción</Button>
      </form>
    </div>
  );
}
