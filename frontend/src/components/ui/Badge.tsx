import { cn } from "@/lib/cn";

type Tone = "neutral" | "good" | "bad" | "pending";

const tones: Record<Tone, string> = {
  neutral: "border-white/10 bg-white/5 text-[rgba(245,245,247,0.65)]",
  good:    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  bad:     "border-rose-500/30 bg-rose-500/10 text-rose-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
