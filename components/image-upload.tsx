"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * Selector de imágenes que las convierte a data URL y las envía como
 * inputs ocultos con el mismo `name` (se reciben como getAll(name) en la acción).
 * Comprime a un ancho máximo para no saturar la base de datos.
 */
export function ImageUpload({
  name,
  max = 5,
  label = "Subir imágenes",
}: {
  name: string;
  max?: number;
  label?: string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = max - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const dataUrls = await Promise.all(toAdd.map(compressImage));
    setImages((prev) => [...prev, ...dataUrls]);
  }

  function remove(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative h-20 w-20 rounded-2xl overflow-hidden border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-ink/70 text-white grid place-items-center"
            >
              <X size={12} />
            </button>
            <input type="hidden" name={name} value={src} />
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-20 w-20 rounded-2xl border-2 border-dashed border-line grid place-items-center text-ink-faint active:scale-95 transition"
          >
            <Plus size={24} />
          </button>
        )}
      </div>
      <p className="text-xs text-ink-faint mt-1.5">
        {label} · {images.length}/{max}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgEl = new Image();
      imgEl.onload = () => {
        const maxW = 900;
        const scale = Math.min(1, maxW / imgEl.width);
        const canvas = document.createElement("canvas");
        canvas.width = imgEl.width * scale;
        canvas.height = imgEl.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      imgEl.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
