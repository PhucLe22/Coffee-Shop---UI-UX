import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const appButtonVariants = cva(
  "inline-flex items-center justify-center gap-md whitespace-nowrap text-body-md-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-text-inverse rounded-2xl hover:bg-brand-accent active:bg-brand-primary/80 shadow-smeffect",
        secondary:
          "bg-surface-main text-text-secondary rounded-sm hover:bg-surface-accent active:bg-surface-muted/80 shadow-smeffect",
        ghost:
          "bg-transparent text-text-primary rounded-2xl hover:bg-black/10 active:bg-black/20",
        danger:
          "bg-error text-text-inverse rounded-2xl hover:bg-error/90 active:bg-error/80 shadow-smeffect",
        outline:
          "border border-text-primary/10 bg-transparent text-text-primary rounded-2xl hover:bg-surface-accent active:bg-surface-accent/80",
      },
      size: {
        default: "h-[54px] px-xl",
        sm: "h-10 px-md text-body-sm-semibold",
        lg: "h-16 px-2xl text-body-lg-bold",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface AppButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof appButtonVariants> {
  isLoading?: boolean;
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(appButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}>
        {isLoading && <Loader2 className="size-5 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  },
);

AppButton.displayName = "AppButton";

export { AppButton, appButtonVariants };
