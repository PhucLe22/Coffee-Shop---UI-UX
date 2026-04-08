import React from "react";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const OptionButton = ({
  label,
  isSelected = false,
  onClick,
  className,
}: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 min-w-[77px] items-center justify-center rounded-full border px-4 transition-all",
        isSelected
          ? "bg-text-primary text-text-inverse border-text-primary"
          : "bg-surface-muted text-text-secondary border-text-muted hover:border-text-primary/50",
        className
      )}
    >
      <span className="text-body-md-bold">{label}</span>
    </button>
  );
};

export { OptionButton };
