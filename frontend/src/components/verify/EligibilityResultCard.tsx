"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { EligibilityResponse } from "@/services/api";

type ViewState =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "result"; data: EligibilityResponse };

function toneFromStatus(status: string) {
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending" as const;
  if (s.includes("not")) return "bad" as const;
  if (s.includes("eligible") || s.includes("active")) return "good" as const;
  return "neutral" as const;
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-colors duration-[400ms] hover:bg-white/[0.06]">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-[rgba(245,245,247,0.4)]">
        {label}
      </dt>
      <dd className="mt-1.5 text-[15px] font-medium text-[#f5f5f7]">{value}</dd>
    </div>
  );
}

export function EligibilityResultCard({ state }: { state: ViewState }) {
  return (
    <Card
      className="h-full"
      data-state={state.kind}
      style={{
        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms cubic-bezier(0.22,1,0.36,1)",
        ...(state.kind === "result" ? { transform: "scale(1.015)" } : {}),
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f7]">
            Eligibility Result
          </h3>
          <p className="mt-1.5 text-[13px] text-[rgba(245,245,247,0.4)]">
            Normalized response returned by the backend.
          </p>
        </div>
        {state.kind === "result" ? (
          <Badge tone={toneFromStatus(state.data.final_status)}>
            {state.data.final_status}
          </Badge>
        ) : state.kind === "loading" ? (
          <Badge tone="pending">Processing</Badge>
        ) : (
          <Badge tone="neutral">—</Badge>
        )}
      </div>

      <div className="mt-8">
        {state.kind === "empty" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.08] px-8 py-14 text-center">
            {/* Minimal placeholder icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(245,245,247,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-[rgba(245,245,247,0.4)]">
              Submit patient details to view eligibility.
            </p>
          </div>
        )}

        {state.kind === "loading" && (
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[72px] rounded-xl" />
              <Skeleton className="h-[72px] rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[72px] rounded-xl" />
              <Skeleton className="h-[72px] rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[72px] rounded-xl" />
              <Skeleton className="h-[72px] rounded-xl" />
            </div>
          </div>
        )}

        {state.kind === "error" && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] p-5">
            <p className="text-[14px] font-medium text-rose-300">Verification failed</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[rgba(245,245,247,0.5)]">
              {state.message}
            </p>
          </div>
        )}

        {state.kind === "result" && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DataRow label="Coverage Status" value={state.data.coverage_status} />
            <DataRow label="Copay" value={`$${state.data.copay.toFixed(2)}`} />
            <DataRow label="Deductible Remaining" value={`$${state.data.deductible_remaining.toFixed(2)}`} />
            <DataRow label="Network Status" value={state.data.in_network ? "In-network" : "Out-of-network"} />
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-[rgba(245,245,247,0.4)]">
                Risk Score
              </dt>
              <dd className="mt-2.5 space-y-2">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-[rgba(245,245,247,0.4)] transition-[width] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${Math.max(0, Math.min(100, state.data.risk_score))}%` }}
                  />
                </div>
                <p className="text-[11px] text-[rgba(245,245,247,0.4)]">
                  {state.data.risk_score <= 33
                    ? "Low risk"
                    : state.data.risk_score <= 66
                      ? "Moderate risk"
                      : "Elevated risk"}
                </p>
              </dd>
            </div>
            <DataRow label="Timestamp" value={formatTimestamp(state.data.timestamp)} />
          </dl>
        )}
      </div>
    </Card>
  );
}
