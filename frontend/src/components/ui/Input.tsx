"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "premium-input h-11 w-full rounded-xl px-3.5 text-[15px]",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
