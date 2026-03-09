"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { getDashboard, type VerificationRow } from "@/services/api";
import { statusTone } from "@/components/dashboard/statusTone";

export function VerificationHistoryPreview() {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<VerificationRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getDashboard()
      .then((d) => { if (!mounted) return; setRows(d.verifications.slice(0, 5)); })
      .catch((e) => { if (!mounted) return; setError(e instanceof Error ? e.message : "Unable to load history."); })
      .finally(() => { if (!mounted) return; setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="mt-8">
      <Card>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#f5f5f7]">
              Recent verifications
            </h3>
            <p className="mt-1 text-[12px] text-[rgba(245,245,247,0.4)]">
              Snapshot of the last few eligibility checks.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <div className="max-h-[260px] overflow-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left">
              <thead className="sticky top-0 bg-[rgba(14,14,16,0.9)] backdrop-blur-sm">
                <tr className="text-[11px] font-medium uppercase tracking-wider text-[rgba(245,245,247,0.35)]">
                  {["Patient", "Insurer", "Status", "Time"].map((h) => (
                    <th key={h} className="border-b border-white/[0.07] px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px] text-[rgba(245,245,247,0.75)]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.05]">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <Skeleton className="h-3.5 w-full rounded-md" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-[13px] text-[rgba(245,245,247,0.35)]">
                      {error}
                    </td>
                  </tr>
                ) : rows.length ? (
                  rows.map((row, idx) => (
                    <tr
                      key={`${row.patient_name}-${row.timestamp}-${idx}`}
                      className="transition-colors duration-[350ms] hover:bg-white/[0.03]"
                    >
                      <td className="border-b border-white/[0.05] px-4 py-3.5">{row.patient_name}</td>
                      <td className="border-b border-white/[0.05] px-4 py-3.5 text-[rgba(245,245,247,0.45)]">{row.insurer}</td>
                      <td className="border-b border-white/[0.05] px-4 py-3.5">
                        <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                      </td>
                      <td className="border-b border-white/[0.05] px-4 py-3.5 text-[rgba(245,245,247,0.45)]">
                        {new Date(row.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-[rgba(245,245,247,0.35)]">
                      No verification history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </section>
  );
}
