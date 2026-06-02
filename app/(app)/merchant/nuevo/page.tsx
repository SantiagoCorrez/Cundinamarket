import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea, Select, Card } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { CategorySelect } from "@/components/category-select";
import { createBusiness } from "@/lib/actions/merchant";
import { MUNICIPALITIES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/merchant/nuevo");

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subcategories: { orderBy: { name: "asc" } } },
  });

  return (
    <div>
      <BackBar title="Registrar mi negocio" />
      <form action={createBusiness} className="p-4 space-y-6">
        {/* Paso 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-brand text-brand-ink text-xs font-bold grid place-items-center">1</span>
            <h2 className="font-bold">Información del negocio</h2>
          </div>

          <Field label="Nombre del negocio" required>
            <Input name="name" placeholder="Ej: Hamburguesas Mosquera" required />
          </Field>

          <CategorySelect
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              icon: c.icon,
              subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
            }))}
          />

          <Field label="Dirección" required>
            <Input name="address" placeholder="Calle 00 # 0-00" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Municipio">
              <Select name="municipality" defaultValue="Mosquera">
                {MUNICIPALITIES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </Field>
            <Field label="Barrio">
              <Input name="neighborhood" placeholder="Centro" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" required>
              <Input name="phone" type="tel" placeholder="601 XXX XXXX" required />
            </Field>
            <Field label="WhatsApp">
              <Input name="whatsapp" type="tel" placeholder="3XX XXX XXXX" />
            </Field>
          </div>

          <Field label="Horario de atención">
            <Input name="schedule" placeholder="Lun-Dom 8:00am - 8:00pm" />
          </Field>

          <Field label="Descripción">
            <Textarea name="description" placeholder="Describe tu negocio y lo que ofreces." />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Instagram">
              <Input name="instagram" placeholder="https://instagram.com/…" />
            </Field>
            <Field label="Facebook">
              <Input name="facebook" placeholder="https://facebook.com/…" />
            </Field>
          </div>

          <Field label="Logo del negocio">
            <ImageUpload name="logo" max={1} label="Logo (opcional)" />
          </Field>
        </section>

        {/* Paso 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-brand text-brand-ink text-xs font-bold grid place-items-center">2</span>
            <h2 className="font-bold">Evidencias para verificación</h2>
          </div>
          <Card className="p-3 bg-brand/10 border-brand/20">
            <p className="text-sm text-ink-soft">
              Para validar tu negocio necesitamos al menos <b>1 foto</b> del establecimiento.
              Esto confirma su existencia y genera confianza en los ciudadanos.
            </p>
          </Card>

          <Field label="📸 Foto del establecimiento">
            <ImageUpload name="facade" max={2} label="Fachada del negocio" />
          </Field>
          <Field label="📸 Foto del aviso comercial">
            <ImageUpload name="sign" max={1} label="Aviso / letrero" />
          </Field>
          <Field label="📸 Foto del interior del local">
            <ImageUpload name="interior" max={1} label="Interior" />
          </Field>
        </section>

        <Button size="lg" className="w-full">Enviar registro</Button>
        <p className="text-center text-xs text-ink-faint">
          Al registrar aceptas los términos y el tratamiento de datos (Ley 1581 de 2012).
        </p>
      </form>
    </div>
  );
}
