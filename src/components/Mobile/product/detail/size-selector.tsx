import { Coffee, Box, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  label: string;
  volume: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SizeSelector = ({
  label,
  volume,
  isActive = false,
  onClick,
  className,
}: SizeSelectorProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-md transition-all border cursor-pointer w-full min-w-[80px]",
        isActive
          ? "bg-text-primary text-text-inverse border-text-primary"
          : "bg-surface-muted text-text-primary border-text-muted",
        className,
      )}>
      <Coffee
        className={cn("size-5", isActive ? "opacity-100" : "opacity-50")}
      />
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
        <span className="text-[10px] uppercase opacity-70">{volume}</span>
      </div>
    </div>
  );
};

interface OptionButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const OptionButton = ({
  label,
  isSelected = false,
  onClick,
  className,
}: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-fit py-sm px-lg rounded-full border transition-all text-body-md-bold whitespace-nowrap",
        isSelected
          ? "bg-text-primary text-text-inverse border-text-primary shadow-sm"
          : "bg-text-inverse text-text-secondary border-text-muted/50 hover:bg-surface-muted",
        className,
      )}>
      {label}
    </button>
  );
};

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
