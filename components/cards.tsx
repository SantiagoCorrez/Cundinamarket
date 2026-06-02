import Link from "next/link";
import { MapPin, Briefcase, BedDouble, Bath, Car } from "lucide-react";
import { Card, Stars, VerifiedBadge, Logo, Badge } from "./ui";
import { cn, formatCOP, timeAgo } from "@/lib/utils";
import { NEWS_TYPES, OFFER_TYPES } from "@/lib/taxonomy";

type BusinessCardData = {
  id: string;
  name: string;
  logoUrl?: string | null;
  category?: { name: string; icon: string } | null;
  neighborhood?: string | null;
  municipality: string;
  ratingAvg: number;
  ratingCount: number;
  status: string;
  address: string;
  _count?: { promotions?: number };
};

export function BusinessCard({ b }: { b: BusinessCardData }) {
  return (
    <Link href={`/business/${b.id}`} className="block active:scale-[.99] transition">
      <Card className="p-3 flex gap-3 items-center">
        <Logo name={b.name} src={b.logoUrl} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-ink truncate">{b.name}</h3>
            {b.status === "VERIFIED" && <VerifiedBadge small />}
          </div>
          <p className="text-xs text-ink-soft truncate">
            {b.category?.icon} {b.category?.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Stars value={b.ratingAvg} count={b.ratingCount} />
            <span className="inline-flex items-center gap-0.5 text-xs text-ink-faint truncate">
              <MapPin size={12} /> {b.neighborhood || b.municipality}
            </span>
          </div>
        </div>
        {b._count?.promotions ? (
          <Badge tone="danger" className="shrink-0">
            🔥 {b._count.promotions}
          </Badge>
        ) : null}
      </Card>
    </Link>
  );
}

export function BusinessFeaturedCard({ b }: { b: BusinessCardData }) {
  return (
    <Link href={`/business/${b.id}`} className="block w-44 shrink-0 active:scale-[.99] transition">
      <Card className="overflow-hidden">
        <div className="h-24 bg-ink relative grid place-items-center">
          <span className="text-4xl">{b.category?.icon || "🏪"}</span>
          {b.status === "VERIFIED" && (
            <span className="absolute top-2 right-2">
              <VerifiedBadge small />
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-ink truncate">{b.name}</h3>
          <p className="text-xs text-ink-soft truncate">{b.category?.name}</p>
          <div className="mt-1">
            <Stars value={b.ratingAvg} count={b.ratingCount} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function CategoryTile({ slug, name, icon }: { slug: string; name: string; icon: string }) {
  return (
    <Link href={`/search?category=${slug}`} className="active:scale-95 transition">
      <Card className="p-3 flex flex-col items-center gap-2 text-center h-full justify-center">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-medium text-ink leading-tight">{name}</span>
      </Card>
    </Link>
  );
}

export function CategoryChip({ slug, name, icon }: { slug: string; name: string; icon: string }) {
  return (
    <Link
      href={`/search?category=${slug}`}
      className="shrink-0 inline-flex items-center gap-1.5 bg-surface border border-line rounded-full px-3.5 py-2 text-sm font-medium text-ink active:scale-95 transition shadow-card"
    >
      <span>{icon}</span>
      {name}
    </Link>
  );
}

type PromoData = {
  id: string;
  title: string;
  discount?: number | null;
  imageUrl?: string | null;
  business: { id: string; name: string; logoUrl?: string | null };
};

export function PromoCard({ p }: { p: PromoData }) {
  return (
    <Link href={`/business/${p.business.id}`} className="block w-60 shrink-0 active:scale-[.99] transition">
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-brand to-brand-strong relative p-3 flex flex-col justify-between">
          {p.discount ? (
            <span className="self-start bg-ink text-brand text-lg font-extrabold rounded-xl px-2.5 py-1">
              -{p.discount}%
            </span>
          ) : (
            <span className="self-start text-2xl">🔥</span>
          )}
          <p className="font-bold text-brand-ink leading-tight line-clamp-2">{p.title}</p>
        </div>
        <div className="p-2.5 flex items-center gap-2">
          <Logo name={p.business.name} src={p.business.logoUrl} size={28} />
          <span className="text-xs font-medium text-ink-soft truncate">{p.business.name}</span>
        </div>
      </Card>
    </Link>
  );
}

type NewsData = {
  id: string;
  title: string;
  type: string;
  imageUrl?: string | null;
  publishedAt: Date | string;
  body: string;
};

export function NewsCard({ n, compact }: { n: NewsData; compact?: boolean }) {
  const t = NEWS_TYPES[n.type] || NEWS_TYPES.NEWS;
  return (
    <Link href={`/news/${n.id}`} className="block active:scale-[.99] transition">
      <Card className={cn("overflow-hidden", compact ? "flex gap-3 p-3 items-center" : "")}>
        {!compact && (
          <div className="h-32 bg-bg grid place-items-center text-5xl">
            {n.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={n.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              t.icon
            )}
          </div>
        )}
        <div className={compact ? "min-w-0 flex-1" : "p-3"}>
          <Badge tone={n.type === "ALERT" ? "danger" : "neutral"}>
            {t.icon} {t.label}
          </Badge>
          <h3 className="font-semibold text-ink mt-1.5 line-clamp-2">{n.title}</h3>
          <p className="text-xs text-ink-faint mt-1">{timeAgo(n.publishedAt)}</p>
        </div>
      </Card>
    </Link>
  );
}

type PropertyData = {
  id: string;
  offerType: string;
  propertyType: string;
  neighborhood?: string | null;
  municipality: string;
  price?: number | null;
  rooms?: number | null;
  bathrooms?: number | null;
  parking: boolean;
  area?: number | null;
  status: string;
  verified: boolean;
  photos: { url: string }[];
};

export function PropertyCard({ p }: { p: PropertyData }) {
  const offer = OFFER_TYPES.find((o) => o.key === p.offerType);
  return (
    <Link href={`/espacios/${p.id}`} className="block active:scale-[.99] transition">
      <Card className="overflow-hidden">
        <div className="h-40 bg-bg relative grid place-items-center text-5xl">
          {p.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photos[0].url} alt="" className="h-full w-full object-cover" />
          ) : (
            "🏠"
          )}
          <span className="absolute top-2 left-2">
            <Badge tone="brand">{offer?.label}</Badge>
          </span>
          {p.status !== "ACTIVE" && (
            <span className="absolute top-2 right-2">
              <Badge tone="neutral">{p.status === "RESERVED" ? "Reservado" : "Cerrado"}</Badge>
            </span>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ink truncate">
              {p.propertyType} en {p.municipality}
            </h3>
            {p.verified && <VerifiedBadge small />}
          </div>
          <p className="text-brand-ink font-bold mt-0.5">
            {formatCOP(p.price)}
            {p.offerType === "RENT" && p.price ? " /mes" : ""}
          </p>
          <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {p.neighborhood || p.municipality}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-soft">
            {p.rooms ? <span className="inline-flex items-center gap-1"><BedDouble size={13} /> {p.rooms}</span> : null}
            {p.bathrooms ? <span className="inline-flex items-center gap-1"><Bath size={13} /> {p.bathrooms}</span> : null}
            {p.parking ? <span className="inline-flex items-center gap-1"><Car size={13} /> Sí</span> : null}
            {p.area ? <span>📐 {p.area} m²</span> : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}

type ServiceData = {
  id: string;
  providerName: string;
  serviceType: string;
  municipality: string;
  coverageZone?: string | null;
  photoUrl?: string | null;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
};

export function ServiceCard({ s }: { s: ServiceData }) {
  return (
    <Link href={`/servicios/${s.id}`} className="block active:scale-[.99] transition">
      <Card className="p-3 flex gap-3 items-center">
        <Logo name={s.providerName} src={s.photoUrl} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-ink truncate">{s.providerName}</h3>
            {s.verified && <VerifiedBadge small />}
          </div>
          <p className="text-xs text-ink-soft truncate">{s.serviceType}</p>
          <div className="flex items-center gap-2 mt-1">
            <Stars value={s.ratingAvg} count={s.ratingCount} />
            <span className="inline-flex items-center gap-0.5 text-xs text-ink-faint truncate">
              <MapPin size={12} /> {s.coverageZone || s.municipality}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

type JobData = {
  id: string;
  title: string;
  companyName: string;
  municipality: string;
  salary?: number | null;
  contractType: string;
  sector: string;
};

export function JobCard({ j }: { j: JobData }) {
  return (
    <Link href={`/empleo/${j.id}`} className="block active:scale-[.99] transition">
      <Card className="p-3.5">
        <div className="flex gap-3 items-start">
          <div className="h-11 w-11 rounded-2xl bg-brand/20 grid place-items-center shrink-0">
            <Briefcase size={20} className="text-brand-ink" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-ink truncate">{j.title}</h3>
            <p className="text-xs text-ink-soft truncate">{j.companyName}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <Badge tone="neutral">📍 {j.municipality}</Badge>
              <Badge tone="neutral">{j.contractType}</Badge>
              {j.salary ? <Badge tone="brand">{formatCOP(j.salary)}</Badge> : null}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
