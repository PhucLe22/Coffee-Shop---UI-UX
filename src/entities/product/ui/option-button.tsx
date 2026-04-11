import { cn } from "@/shared/lib";

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
          ? "bg-text-primary text-inverse-text border-text-primary shadow-sm"
          : "bg-inverse-text text-text-secondary border-text-muted/50 hover:bg-surface-muted",
        className,
      )}>
      {label}
    </button>
  );
};
