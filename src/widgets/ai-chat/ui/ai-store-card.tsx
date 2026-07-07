import { MapPin } from "lucide-react";
import { cn } from "@/shared/lib";

interface AIStoreCardProps {
  name: string;
  address: string;
  className?: string;
}

export function AIStoreCard({ name, address, className }: AIStoreCardProps) {
  return (
    <div className={cn("bg-[#ebe0d9] rounded-[16px] p-md flex flex-col gap-xs", className)}>
      <h3 className="text-[16px] font-bold text-[#330f00] leading-tight">{name}</h3>
      <div className="flex items-center gap-sm bg-white/40 border border-[#DDCBC3]/60 rounded-lg p-sm">
        <MapPin size={14} className="text-[#330f00] shrink-0" />
        <p className="text-[12px] text-[#330f00] leading-tight">{address}</p>
      </div>
    </div>
  );
}
