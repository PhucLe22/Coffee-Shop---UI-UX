import { Coffee } from "lucide-react";
import { cn } from "@/shared/lib";

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
        "flex flex-col items-center justify-center gap-1 px-xl py-sm rounded-md transition-all border cursor-pointer min-w-[60px]",
        isActive
          ? "bg-text-primary text-inverse-text border-text-primary"
          : "bg-surface-muted text-text-primary border-text-muted",
        className,
      )}>
      <Coffee
        className={cn("size-4", isActive ? "opacity-100" : "opacity-50")}
      />
      <div className="flex flex-col items-center text-center">
        <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
        <span className="text-[10px] uppercase opacity-70">{volume}</span>
      </div>
    </div>
  );
};
