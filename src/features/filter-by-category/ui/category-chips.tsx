"use client";

import { cn } from "@/shared/lib";
import { useCategories } from "@/entities/category";
import { Skeleton } from "@/shared/ui/skeleton";

export type CategoryId = string;

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
  const { data, isLoading } = useCategories(1, 10);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-sm overflow-x-auto no-scrollbar", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const categories = data?.data.items || [];
  const allCategories = [{ id: "all", name: "ALL" }, ...categories];

  return (
    <div className={cn("flex items-center gap-sm overflow-x-auto no-scrollbar", className)}>
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cn(
            "flex items-center justify-center rounded-2xl px-6 py-2 label-badge transition-colors whitespace-nowrap",
            activeId === category.id
              ? "bg-text-primary text-inverse-text"
              : "bg-surface-muted text-text-secondary"
          )}
        >
          {category.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
