"use client";

import { useState } from "react";
import { Field, Select } from "./ui";

type Cat = { id: string; name: string; icon: string; subcategories: { id: string; name: string }[] };

export function CategorySelect({ categories }: { categories: Cat[] }) {
  const [catId, setCatId] = useState(categories[0]?.id || "");
  const subs = categories.find((c) => c.id === catId)?.subcategories || [];

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Categoría" required>
        <Select name="categoryId" value={catId} onChange={(e) => setCatId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Subcategoría">
        <Select name="subcategoryId">
          <option value="">Seleccionar</option>
          {subs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}
