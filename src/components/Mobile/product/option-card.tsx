import React from "react";
import { Box, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  name: string;
  price: string;
  icon?: React.ElementType;
  isSelected?: boolean;
  onToggle?: () => void;
  className?: string;
}

const OptionCard = ({
  name,
  price,
  icon: Icon = Box,
  isSelected = false,
  onToggle,
  className,
}: OptionCardProps) => {
  return (
    <div
      className={cn(
        "flex h-[72px] w-full items-center justify-between rounded-md p-4 transition-all",
        isSelected
          ? "bg-surface-inverse"
          : "bg-surface-accent border border-surface-muted",
        className
      )}
    >
      <div className="flex items-center gap-md">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-sm transition-colors",
            isSelected ? "bg-text-secondary" : "bg-surface-muted"
          )}
        >
          <Icon
            className={cn(
              "size-6",
              isSelected ? "text-text-inverse" : "text-text-secondary"
            )}
          />
        </div>
        <div className="flex flex-col">
          <span
            className={cn(
              "text-body-sm-semibold",
              isSelected ? "text-text-inverse" : "text-text-secondary"
            )}
          >
            {name}
          </span>
          <span
            className={cn(
              "label-overline",
              isSelected ? "text-text-inverse" : "text-text-secondary"
            )}
          >
            {price}
          </span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "flex size-10 items-center justify-center rounded-md transition-all",
          isSelected
            ? "text-text-inverse hover:bg-white/10"
            : "text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 active:scale-90"
        )}
        aria-label={isSelected ? "Remove option" : "Add option"}
      >
        {isSelected ? (
          <X className="size-6" />
        ) : (
          <Plus className="size-6" />
        )}
      </button>
    </div>
  );
};

export { OptionCard };
