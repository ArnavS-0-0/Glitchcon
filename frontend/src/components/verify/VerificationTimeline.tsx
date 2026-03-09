"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Phase = "idle" | "request" | "routing" | "insurer" | "final";

const steps = [
  { id: "request", label: "Request Sent" },
  { id: "routing", label: "Clearinghouse Routing" },
  { id: "insurer", label: "Insurer Response" },
  { id: "final", label: "Final Decision" },
] as const;

export function VerificationTimeline({ active }: { active: Phase }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(id);
  }, []);

  function isComplete(id: (typeof steps)[number]["id"]) {
    const order: Phase[] = ["idle", "request", "routing", "insurer", "final"];
    return order.indexOf(active) >= order.indexOf(id);
  }

  return (
    <section
      aria-label="Verification activity timeline"
      className={cn(
        "mt-6 glass-card rounded-2xl px-5 py-4",
        "transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-[rgba(245,245,247,0.5)]">
          Verification Pipeline
        </p>
        <p className="text-[11px] text-[rgba(245,245,247,0.3)]">
          Visualizes request flow only
        </p>
      </div>
      <ol className="flex items-center gap-2 text-[11px] text-[rgba(245,245,247,0.45)]">
        {steps.map((step, index) => {
          const complete = isComplete(step.id);
          const last = index === steps.length - 1;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={cn(
                    "flex h-3 w-3 items-center justify-center rounded-full border transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    complete
                      ? "border-emerald-500/60 bg-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                      : "border-white/15 bg-white/[0.04]",
                  )}
                  aria-hidden="true"
                >
                  {complete && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </span>
                <span className={cn("transition-colors duration-[400ms]", complete && "text-[rgba(245,245,247,0.7)]")}>
                  {step.label}
                </span>
              </div>
              {!last && (
                <div
                  className={cn(
                    "h-px flex-1 rounded-full transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    complete
                      ? "bg-emerald-500/40"
                      : "bg-white/[0.07]",
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
