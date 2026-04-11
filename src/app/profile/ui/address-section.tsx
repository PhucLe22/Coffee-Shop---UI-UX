"use client";

import React from "react";
import { MapPin, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface AddressCardProps {
  label: string;
  address: string;
  isPrimary?: boolean;
}

const AddressCard = ({ label, address, isPrimary }: AddressCardProps) => (
  <div
    className={cn(
      "flex flex-col gap-2 rounded-sm p-4 transition-all",
      isPrimary
        ? "bg-text-secondary text-inverse-text shadow-md"
        : "bg-surface-accent text-text-primary border border-black/5"
    )}
  >
    <div className="flex items-center gap-2">
      <MapPin className={cn("size-4", isPrimary ? "text-inverse-text" : "text-text-secondary")} />
      <span className="text-body-sm-semibold">{label}</span>
    </div>
    <p className={cn("text-body-sm-reg", isPrimary ? "text-inverse-text/80" : "text-text-muted")}>
      {address}
    </p>
  </div>
);

export function AddressSection() {
  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-6 py-4">
        <h3 className="text-body-md-bold text-text-primary">Saved Addresses</h3>
        <button className="text-text-primary hover:scale-110 transition-transform">
          <Plus className="size-5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-4 p-6">
        <AddressCard 
          label="Home" 
          address="123 Espresso Lane, Highland Park Seattle, WA 98101" 
          isPrimary 
        />
        <AddressCard 
          label="Office" 
          address="456 Arabica Way, Downtown Seattle, WA 98104" 
        />
      </div>
    </section>
  );
}
