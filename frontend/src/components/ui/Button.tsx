"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Intent = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl border text-[15px] font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e10] disabled:cursor-not-allowed disabled:opacity-50 select-none";

const intents: Record<Intent, string> = {
  primary:
    "border-[#0a84ff]/60 bg-[#0a84ff] text-white shadow-[0_4px_24px_rgba(10,132,255,0.28)] hover:bg-[#409cff] hover:border-[#409cff] hover:shadow-[0_6px_32px_rgba(10,132,255,0.38)] active:scale-[0.97]",
  secondary:
    "border-white/10 bg-white/6 text-[#f5f5f7] backdrop-blur-xl hover:bg-white/10 hover:border-white/15 active:scale-[0.97]",
  ghost:
    "border-transparent bg-transparent text-[rgba(245,245,247,0.7)] hover:bg-white/5 hover:text-[#f5f5f7] active:scale-[0.97]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4",
  lg: "h-11 px-6 text-[16px]",
};

export function Button({
  intent = "secondary",
  size = "md",
  className,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: Intent;
  size?: Size;
  asChild?: boolean;
}) {
  const classes = cn(base, intents[intent], sizes[size], className);

  if (asChild) {
    const child = React.Children.only(props.children);
    if (!React.isValidElement<{ className?: string }>(child)) return null;
    return React.cloneElement(child, { className: cn(child.props.className, classes) });
  }

  return <button className={classes} {...props} />;
}
