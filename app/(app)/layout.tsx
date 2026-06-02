import { BottomNav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md min-h-dvh bg-bg shadow-pop relative">
      <div className="pb-24">{children}</div>
      <BottomNav />
    </div>
  );
}
