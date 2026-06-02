import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { Badge } from "@/components/ui";
import { NEWS_TYPES } from "@/lib/taxonomy";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await prisma.news.findUnique({ where: { id } });
  if (!n) notFound();
  const t = NEWS_TYPES[n.type] || NEWS_TYPES.NEWS;

  return (
    <div>
      <BackBar title="Noticia" />
      {n.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.imageUrl} alt="" className="h-52 w-full object-cover" />
      ) : (
        <div className="h-40 bg-bg grid place-items-center text-6xl">{t.icon}</div>
      )}
      <article className="p-4">
        <Badge tone={n.type === "ALERT" ? "danger" : "brand"}>{t.icon} {t.label}</Badge>
        <h1 className="text-2xl font-extrabold mt-3 leading-tight">{n.title}</h1>
        <p className="text-xs text-ink-faint mt-1">
          {n.municipality} · {timeAgo(n.publishedAt)}
        </p>
        <p className="text-[15px] text-ink-soft mt-4 leading-relaxed whitespace-pre-line">{n.body}</p>
      </article>
    </div>
  );
}
