import { prisma } from "@/lib/prisma";
import { Card, Button, Field, Input, Textarea, Select, Badge } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { createNews, deleteNews } from "@/lib/actions/admin";
import { NEWS_TYPES, MUNICIPALITIES } from "@/lib/taxonomy";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="p-5 md:p-8 max-w-5xl grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Publicar noticia</h1>
        <p className="text-ink-soft text-sm mt-1">Noticias, alertas y comunicados oficiales del municipio.</p>
        <Card className="p-5 mt-4">
          <form action={createNews} className="space-y-4">
            <Field label="Título" required><Input name="title" required /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select name="type">
                  {Object.entries(NEWS_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Municipio">
                <Select name="municipality" defaultValue="Mosquera">
                  {MUNICIPALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Contenido" required><Textarea name="body" className="min-h-32" required /></Field>
            <Field label="Imagen"><ImageUpload name="image" max={1} label="Imagen (opcional)" /></Field>
            <Button className="w-full">Publicar</Button>
          </form>
        </Card>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-3">Publicaciones ({news.length})</h2>
        <div className="space-y-2">
          {news.map((n) => {
            const t = NEWS_TYPES[n.type] || NEWS_TYPES.NEWS;
            return (
              <Card key={n.id} className="p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Badge tone={n.type === "ALERT" ? "danger" : "neutral"}>{t.icon} {t.label}</Badge>
                  <p className="font-semibold mt-1 truncate">{n.title}</p>
                  <p className="text-xs text-ink-faint">{n.municipality} · {timeAgo(n.publishedAt)}</p>
                </div>
                <form action={deleteNews.bind(null, n.id)}>
                  <Button size="sm" variant="ghost" className="text-danger">Eliminar</Button>
                </form>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
