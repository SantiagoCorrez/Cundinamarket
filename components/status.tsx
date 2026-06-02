import { Badge } from "./ui";
import { BUSINESS_STATUS } from "@/lib/taxonomy";

const toneMap: Record<string, "neutral" | "success" | "warn" | "danger"> = {
  PENDING: "neutral",
  IN_REVIEW: "warn",
  VERIFIED: "success",
  REJECTED: "danger",
  SUSPENDED: "danger",
};

export function StatusPill({ status }: { status: string }) {
  const s = BUSINESS_STATUS[status] || BUSINESS_STATUS.PENDING;
  return (
    <Badge tone={toneMap[status] || "neutral"}>
      {s.icon} {s.label}
    </Badge>
  );
}
