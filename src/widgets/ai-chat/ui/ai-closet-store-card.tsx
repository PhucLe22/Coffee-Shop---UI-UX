import { Store, Scissors } from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

interface AIClosetStoreCardProps {
  name: string;
  address: string;
  distance: string;
  className?: string;
  onClick: () => void;
}

export function AIClosetStoreCard({ name, address, distance, className, onClick }: AIClosetStoreCardProps) {
  return (
    <div className={cn("bg-[#ebe0d9] rounded-[16px] p-lg flex flex-col gap-md", className)}>
      <div className="flex justify-between items-center">
        <span className="bg-[#386661] text-[#f0ecec] text-[10px] font-bold px-md py-xs rounded-full">
          CLOSET TO YOU
        </span>
        <span className="text-[12px] font-bold text-[#594237]">{distance}</span>
      </div>
      
      <div className="flex items-center gap-md">
        <div className="bg-[#9d3f00]/10 p-md rounded-full">
          <Store size={24} className="text-[#9d3f00]" />
        </div>
        <h3 className="text-[20px] font-bold text-[#1f1b16]">{name}</h3>
      </div>
      
      <p className="text-[11px] text-[#330f00]">{address}</p>
      
      <Button onClick={onClick} className="w-full bg-[#f0660a] text-[#f0ecec] rounded-full hover:bg-[#f0660a]/90">
        <Scissors size={16} className="mr-sm" />
        Chỉ đường
      </Button>
    </div>
  );
}
