import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar, AdminMobileNav } from "@/components/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/home");

  const pending = await prisma.business.count({ where: { status: { in: ["IN_REVIEW", "PENDING"] } } });

  return (
    <div className="min-h-dvh bg-bg md:flex">
      <AdminSidebar pending={pending} />
      <AdminMobileNav pending={pending} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
