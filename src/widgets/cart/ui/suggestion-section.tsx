"use client";

import { SuggestionCard } from "./suggestion-card";
import { cn } from "@/shared/lib";

interface SuggestionSectionProps {
  className?: string;
}

const SUGGESTIONS = [
  {
    id: "1",
    name: "ELECTRIC POUR KETTLE",
    price: 149.00,
    slug: "electric-pour-kettle",
    imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "ELECTRIC POUR KETTLE",
    price: 149.00,
    slug: "electric-pour-kettle-2",
    imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "ELECTRIC POUR KETTLE",
    price: 149.00,
    slug: "electric-pour-kettle-3",
    imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "ELECTRIC POUR KETTLE",
    price: 149.00,
    slug: "electric-pour-kettle-4",
    imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
  },
];

export function SuggestionSection({ className }: SuggestionSectionProps) {
  return (
    <section className={cn("flex flex-col gap-xl", className)}>
      <h2 className="text-h3-bold text-text-primary">Complete the Ritual</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
        {SUGGESTIONS.map((item) => (
          <SuggestionCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
