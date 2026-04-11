import React from "react";
import { Coffee, Tag } from "lucide-react";
import { cn } from "@/shared/lib";

interface SuggestionCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  className?: string;
}

const SuggestionCard = ({
  icon: Icon,
  title,
  subtitle,
  backgroundColor,
  textColor,
  className,
}: SuggestionCardProps) => (
  <div
    className={cn(
      "flex h-[160px] flex-1 flex-col justify-between rounded-[24px] p-4",
      className
    )}
    style={{ backgroundColor }}
  >
    <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
      <Icon className="size-5" style={{ color: textColor }} />
    </div>
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-semibold" style={{ color: textColor }}>
        {title}
      </span>
      <span className="font-plus-jakarta text-[11px] font-normal" style={{ color: textColor }}>
        {subtitle}
      </span>
    </div>
  </div>
);

export const OrderSuggestions = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-md", className)}>
      <h2 className="font-plus-jakarta text-[20px] font-bold text-surface-inverse px-1">
        Gợi ý cho bạn
      </h2>
      <div className="flex gap-4">
        <SuggestionCard
          icon={Coffee}
          title="Thử món mới"
          subtitle="Salted Caramel Latte"
          backgroundColor="rgba(196, 80, 0, 0.2)"
          textColor="rgb(56, 102, 97)"
        />
        <SuggestionCard
          icon={Tag}
          title="Ưu đãi 20%"
          subtitle="Cho đơn hàng tiếp theo"
          backgroundColor="rgba(185, 233, 225, 0.3)"
          textColor="rgb(56, 102, 97)"
        />
      </div>
    </div>
  );
};
