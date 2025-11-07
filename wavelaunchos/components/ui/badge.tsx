import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/85",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/85",
        outline:
          "border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
      size: {
        sm: "h-5 min-w-5 px-1 text-[10px] font-mono tabular-nums",
        md: "h-6 px-2 text-xs",
        lg: "h-7 px-3 text-sm",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        size: "sm",
        class: "px-1.5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
