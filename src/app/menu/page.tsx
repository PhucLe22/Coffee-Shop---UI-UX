"use client";

import { useState } from "react";
import { ProductCardDetailed } from "@/entities/product";
import { CategoryChips, CategoryId } from "@/features/filter-by-category";

const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "Velvet Flat White",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "velvet-flat-white",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "coffee"
  },
  {
    id: "2",
    name: "Nitro Reserve",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "nitro-reserve",
    imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "coffee"
  },
  {
    id: "3",
    name: "Caramel Macchiato",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "caramel-macchiato",
    imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "coffee"
  },
  {
    id: "4",
    name: "Iced Latte",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "iced-latte",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    badge: "HOT",
    category: "coffee"
  },
  {
    id: "5",
    name: "Classic Croissant",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "classic-croissant",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    badge: "NEW",
    category: "bakery"
  },
  {
    id: "6",
    name: "Matcha Latte",
    price: "$5.50",
    description: "Double shot of espresso with micro-foamed milk, creating a silky texture.",
    calories: "120",
    size: "8",
    slug: "matcha-latte",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    badge: "HOT",
    category: "tea"
  }
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filteredProducts = activeCategory === "all" 
    ? DUMMY_PRODUCTS 
    : DUMMY_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col gap-8 bg-surface-accent px-6 py-12 pb-24 min-h-full">
      {/* Hero Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-h2-bold text-text-primary whitespace-pre-line">
          The Brew{"\n"}Catalogue
        </h2>
        <p className="text-body-md-reg text-text-secondary whitespace-pre-line">
          Sourced from volcanic soils, roasted in{"\n"}small batches for the ultimate profile.
        </p>
      </div>

      {/* Filter Chips */}
      <CategoryChips 
        activeId={activeCategory} 
        onChange={setActiveCategory} 
      />

      {/* Product List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCardDetailed
            key={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            calories={product.calories}
            size={product.size}
            slug={product.slug}
            imageUrl={product.imageUrl}
            badge={product.badge}
          />
        ))}
      </div>
    </div>
  );
}
