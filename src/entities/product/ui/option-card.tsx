import { Box, Plus, X } from "lucide-react";
import { cn } from "@/shared/lib";

interface OptionCardProps {
  name: string;
  price: string;
  isSelected?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const OptionCard = ({
  name,
  price,
  isSelected = false,
  onToggle,
  className,
}: OptionCardProps) => {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between rounded-md p-md transition-all border cursor-pointer w-full",
        isSelected
          ? "bg-surface-inverse text-surface-accent border-surface-inverse shadow-md"
          : "bg-surface-accent text-text-secondary border-surface-muted hover:border-brand-primary/20",
        className,
      )}>
      <div className="flex items-center gap-sm">
        <div
          className={cn(
            "p-2 rounded-sm flex items-center justify-center",
            isSelected ? "bg-text-secondary" : "bg-surface-muted",
          )}>
          <Box className="size-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-body-sm-semibold leading-tight">{name}</span>
          <span className="label-overline-inter leading-tight">{price}</span>
        </div>
      </div>
      <div
        className={cn(
          "p-2 flex items-center justify-center rounded-md transition-colors",
          isSelected
            ? "bg-text-inverse/10 text-surface-accent"
            : "bg-surface-muted text-text-secondary",
        )}>
        {isSelected ? <X className="size-6" /> : <Plus className="size-6" />}
      </div>
    </div>
  );
};
