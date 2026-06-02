"use client";

import { useEffect } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink/40 animate-fadeup" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-t-3xl p-5 pb-8 animate-fadeup max-h-[85dvh] overflow-y-auto">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-line mb-4" />
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
