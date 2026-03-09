import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main>
      {/* ── Hero – full viewport, sits on top of global video bg ── */}
      <section className="relative flex min-h-[calc(100svh-52px)] items-center justify-center overflow-hidden">

        {/* Extra radial glow behind the headline — accent layer */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[560px] max-w-[760px] -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(10,132,255,0.16)_0%,transparent_68%)]"
          style={{ animation: "glowPulse 5s ease-in-out infinite" }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
          <Reveal>
            {/* Eyebrow */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-1.5 text-[12px] uppercase tracking-widest text-[rgba(245,245,247,0.5)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              AI-powered clearinghouse verification
            </p>
          </Reveal>

          <Reveal delayMs={80}>
            <h1 className="text-balance text-[52px] font-semibold leading-[1.04] tracking-[-0.045em] text-[#f5f5f7] sm:text-[68px] md:text-[80px] lg:text-[92px]">
              Eligibility verification,
              <br />
              reimagined for operations.
            </h1>
          </Reveal>

          <Reveal delayMs={160}>
            <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-[rgba(245,245,247,0.5)] sm:text-[19px]">
              A clearinghouse-aware verification surface that feels as precise as
              the systems behind it.
            </p>
          </Reveal>

          {/* Glass CTA container */}
          <Reveal delayMs={250}>
            <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.06] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <Button asChild intent="primary" size="lg">
                <Link href="/verify">Verify coverage</Link>
              </Button>
              <Button asChild intent="secondary" size="lg">
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35 select-none">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#f5f5f7]">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>
    </main>
  );
}
