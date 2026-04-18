"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface ToggleItemProps {
  title: string;
  description: string;
  defaultEnabled?: boolean;
}

const ToggleItem = ({ title, description, defaultEnabled = false }: ToggleItemProps) => {
  const [enabled, setEnabled] = React.useState(defaultEnabled);
  
  return (
    <div className="flex items-center justify-between p-4 transition-all hover:bg-black/5 rounded-sm">
      <div className="flex flex-col gap-1">
        <span className="text-body-sm-semibold text-text-primary">{title}</span>
        <span className="text-xs text-text-muted max-w-[400px]">{description}</span>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          enabled ? "bg-text-secondary" : "bg-text-muted"
        )}
      >
        <span
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
};

export function NotificationSettingsSection() {
  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="border-b border-black/5 bg-black/5 px-8 py-6">
        <h3 className="text-h5-bold text-text-primary">Notification Settings</h3>
      </div>
      
      <div className="flex flex-col gap-2 p-4">
        <ToggleItem 
          title="Order Status Updates" 
          description="Get notified when your coffee is roasted and shipped." 
          defaultEnabled
        />
        <ToggleItem 
          title="Promotional Offers" 
          description="Receive exclusive discounts and new product reveals." 
        />
        <ToggleItem 
          title="Brewing Workshops" 
          description="Alerts for upcoming local events and digital brew classes." 
          defaultEnabled
        />
      </div>
    </section>
  );
}
