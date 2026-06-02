import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, ChevronRight, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, Button, Logo, EmptyState } from "@/components/ui";
import { StatusPill } from "@/components/status";
import { BackBar } from "@/components/nav";

export const dynamic = "force-dynamic";

export default async function MerchantPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/merchant");

  const businesses = await prisma.business.findMany({
    where: { ownerId: session.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { promotions: true } } },
  });

  return (
    <div>
      <BackBar
        title="Mi negocio"
        right={
          <Link href="/merchant/nuevo" className="h-10 w-10 grid place-items-center rounded-full bg-brand text-brand-ink">
            <Plus size={20} />
          </Link>
        }
      />
      <div className="p-4 space-y-3">
        {businesses.length ? (
          businesses.map((b) => (
            <Link key={b.id} href={`/merchant/${b.id}`}>
              <Card className="p-3 flex items-center gap-3">
                <Logo name={b.name} src={b.logoUrl} size={52} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{b.name}</p>
                  <p className="text-xs text-ink-soft truncate">{b.category.icon} {b.category.name}</p>
                  <div className="mt-1">
                    <StatusPill status={b.status} />
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-faint" />
              </Card>
            </Link>
          ))
        ) : (
          <EmptyState
            icon="🏪"
            title="Registra tu primer negocio"
            subtitle="Publica tu comercio gratis y llega a más clientes de tu municipio."
            action={
              <Link href="/merchant/nuevo">
                <Button size="lg"><Store size={18} /> Registrar negocio</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
