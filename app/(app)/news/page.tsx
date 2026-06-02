import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { NewsCard } from "@/components/cards";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" }, take: 50 });

  return (
    <div>
      <BackBar title="Noticias del municipio" />
      <div className="p-4 space-y-3">
        {news.length ? (
          news.map((n) => <NewsCard key={n.id} n={n} />)
        ) : (
          <EmptyState icon="📰" title="Sin noticias por ahora" subtitle="Pronto verás información oficial de tu municipio." />
        )}
      </div>
    </div>
  );
}
