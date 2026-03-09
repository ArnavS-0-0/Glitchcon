"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Home" },
  { href: "/verify", label: "Verify" },
  { href: "/dashboard", label: "Dashboard" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(14,14,16,0.72)] backdrop-blur-[20px] backdrop-saturate-150">
      <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-[14px] font-semibold tracking-[-0.01em] text-[#f5f5f7] transition-opacity duration-[400ms] hover:opacity-70 focus-visible:outline-none"
        >
          Eligibility Verification
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none",
                  active
                    ? "bg-white/10 border border-white/[0.08] text-[#f5f5f7] shadow-sm"
                    : "text-[rgba(245,245,247,0.45)] hover:text-[rgba(245,245,247,0.85)] hover:bg-white/[0.06]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
