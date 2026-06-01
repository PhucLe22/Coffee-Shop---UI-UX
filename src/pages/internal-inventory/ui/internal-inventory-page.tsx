"use client";

import React, { useState } from "react";
import { 
  Search, 
  Package, 
  ChevronRight, 
  RefreshCcw,
  Coffee,
  Leaf,
  Droplets,
  CakeSlice,
  SearchIcon
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

const INVENTORY_DATA = [
  {
    category: "THE COFFEE SERIES",
    items: [
      {
        id: 1,
        name: "Ethiopian Yirgacheffe",
        description: "Single Origin · Light Roast",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop",
        available: true
      },
      {
        id: 2,
        name: "Velvet Espresso",
        description: "House Blend · Medium Dark",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab752?w=200&h=200&fit=crop",
        available: true
      }
    ]
  },
  {
    category: "ARTISANAL BAKERY",
    items: [
      {
        id: 3,
        name: "Almond Croissant",
        description: "Freshly Baked · Twice Glazed",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
        available: false
      },
      {
        id: 4,
        name: "Pain au Chocolat",
        description: "70% Dark Chocolate · Flaky Layers",
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=200&h=200&fit=crop",
        available: true
      }
    ]
  }
];

const CATEGORIES = ["ALL", "COFFEE", "TEA", "WATER", "BAKERY"];

export default function InternalInventoryPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex flex-col gap-xs">
          <h1 className="text-h2-bold text-text-primary">Inventory Control</h1>
          <p className="text-body-md-reg text-text-secondary">Update real-time availability for the boutique floor.</p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative w-full max-w-xs hidden md:block">
            <SearchIcon className="absolute left-md top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <Input 
              placeholder="Search inventory..." 
              className="pl-xl h-10 bg-white/50 border-border-primary-50 rounded-md focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="size-10 border-border-primary-50 rounded-md bg-white">
            <RefreshCcw className="size-4 text-text-primary" />
          </Button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar pb-xs">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all",
              activeCategory === cat 
                ? "bg-text-primary text-white shadow-md" 
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="flex flex-col gap-xl">
        {INVENTORY_DATA.map((section) => (
          <div key={section.category} className="flex flex-col gap-lg">
            <h3 className="text-body-sm-bold text-brand-primary uppercase tracking-[0.2em]">{section.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-lg">
              {section.items.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Floating Search */}
      <div className="md:hidden fixed bottom-24 right-md z-40">
        <Button size="icon" className="size-14 rounded-full bg-brand-primary text-white shadow-xl">
          <Search className="size-6" />
        </Button>
      </div>
    </div>
  );
}

function InventoryCard({ item }: { item: any }) {
  const [isAvailable, setIsAvailable] = useState(item.available);

  return (
    <Card className={cn(
      "bg-[#faf2eb] border-0 shadow-sm rounded-md overflow-hidden group transition-all duration-300",
      !isAvailable ? "opacity-75 grayscale-[0.5]" : "hover:shadow-md"
    )}>
      <CardContent className="p-md flex items-center justify-between gap-md">
        <div className={cn(
          "flex items-center gap-md transition-opacity duration-300",
          !isAvailable && "opacity-60"
        )}>
          <div className="size-16 md:size-20 rounded-md overflow-hidden bg-white border border-border-primary-50/20 flex-shrink-0">
            <img src={item.image} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-body-lg-bold md:text-h5-bold text-text-primary leading-tight">{item.name}</h4>
            <p className="text-[12px] md:text-body-sm-reg text-text-secondary leading-snug">{item.description}</p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <button 
          onClick={() => setIsAvailable(!isAvailable)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-inner",
            isAvailable ? "bg-brand-primary" : "bg-text-muted/40"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              isAvailable ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </CardContent>
    </Card>
  );
}
