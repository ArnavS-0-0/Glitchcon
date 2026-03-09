"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "premium-input h-11 w-full appearance-none rounded-xl px-3.5 pr-10 text-[15px]",
        "bg-[linear-gradient(45deg,transparent_50%,rgba(245,245,247,0.4)_50%),linear-gradient(135deg,rgba(245,245,247,0.4)_50%,transparent_50%)] bg-[position:calc(100%-18px)_50%,calc(100%-13px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
