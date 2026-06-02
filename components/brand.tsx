export function BrandMark({ size = 48, onDark = true }: { size?: number; onDark?: boolean }) {
  // Pin de ubicación con bolsa de compras — identidad de CundiMarket
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="CundiMarket">
      <rect width="64" height="64" rx="18" fill={onDark ? "#c2f92c" : "#0f1419"} />
      <path
        d="M32 14c-7.2 0-13 5.6-13 12.6 0 8.8 11 21 12.2 22.3a1.1 1.1 0 0 0 1.6 0C34 47.6 45 35.4 45 26.6 45 19.6 39.2 14 32 14Z"
        fill={onDark ? "#0f1419" : "#c2f92c"}
      />
      <path
        d="M26.5 24h11l-.9 9.2a2 2 0 0 1-2 1.8h-5.2a2 2 0 0 1-2-1.8L26.5 24Z"
        fill={onDark ? "#c2f92c" : "#0f1419"}
      />
      <path
        d="M28.5 24v-1.5a3.5 3.5 0 0 1 7 0V24"
        stroke={onDark ? "#c2f92c" : "#0f1419"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
