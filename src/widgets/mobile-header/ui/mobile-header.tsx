import { Menu } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

export interface MobileHeaderProps {
  userName?: string;
  userImage?: string;
  className?: string;
}

const MobileHeader = ({
  userName = "User",
  userImage,
  className,
}: MobileHeaderProps) => {
  return (
    <header
      className={cn(
        "flex h-[72px] w-full items-center justify-between bg-surface-muted px-md py-sm",
        className,
      )}>
      <div className="flex items-center gap-md">
        {/* Menu Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-text-primary hover:bg-transparent">
          <Menu className="size-4" />
        </Button>

        {/* Brand Text */}
        <h1 className="text-brand-mobile text-text-primary">VERDANT</h1>
      </div>

      {/* User Avatar */}
      <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-border-primary-50 bg-surface-muted">
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-9 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
