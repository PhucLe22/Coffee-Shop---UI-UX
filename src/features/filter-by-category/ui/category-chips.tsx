"use client";

import { cn } from "@/shared/lib";

export const CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "coffee", label: "COFFEE" },
  { id: "tea", label: "TEA" },
  { id: "bakery", label: "BAKERY" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

interface CategoryChipsProps {
  activeId: CategoryId;
  onChange: (id: CategoryId) => void;
  className?: string;
}

export const CategoryChips = ({
  activeId,
  onChange,
  className,
}: CategoryChipsProps) => {
  return (
    <div className={cn("flex items-center gap-sm overflow-x-auto no-scrollbar", className)}>
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn(
            "flex items-center justify-center rounded-2xl px-6 py-2 label-badge transition-colors",
            activeId === category.id
              ? "bg-text-primary text-text-inverse"
              : "bg-surface-muted text-text-secondary"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
