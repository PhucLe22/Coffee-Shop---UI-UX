import React from "react";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-auto items-center justify-center rounded-sm bg-text-inverse px-xl font-plus-jakarta text-[16px] font-bold text-text-primary transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          className,
        )}
        {...props}>
        {children}
      </button>
    );
  },
);

AppButton.displayName = "AppButton";

export { AppButton };
