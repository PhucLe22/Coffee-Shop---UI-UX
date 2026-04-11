"use client";

import React from "react";
import { CreditCard, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui";

interface PaymentCardProps {
  brand: string;
  last4: string;
  expiry: string;
  isPrimary?: boolean;
}

const PaymentCard = ({ brand, last4, expiry, isPrimary }: PaymentCardProps) => (
  <div className="flex items-center justify-between rounded-sm bg-surface-accent border border-black/5 p-4 transition-all hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-12 items-center justify-center rounded-sm bg-surface-muted text-xs font-bold text-text-muted">
        {brand}
      </div>
      <div className="flex flex-col">
        <span className="text-body-sm-semibold text-text-primary">•••• {last4}</span>
        <span className="text-[11px] uppercase tracking-wider text-text-muted">EXPIRES {expiry}</span>
      </div>
    </div>
    {isPrimary && (
      <Badge className="bg-text-secondary text-text-inverse border-none font-bold">
        PRIMARY
      </Badge>
    )}
  </div>
);

export function PaymentSection() {
  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-6 py-4">
        <h3 className="text-body-md-bold text-text-primary">Payment Methods</h3>
        <button className="text-text-primary hover:scale-110 transition-transform">
          <Plus className="size-5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-4 p-6">
        <PaymentCard 
          brand="VISA" 
          last4="4242" 
          expiry="12/26" 
          isPrimary 
        />
        <PaymentCard 
          brand="VISA" 
          last4="8888" 
          expiry="08/25" 
        />
      </div>
    </section>
  );
}
