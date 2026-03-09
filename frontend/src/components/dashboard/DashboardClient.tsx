"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { getDashboard, type DashboardResponse } from "@/services/api";
import { statusTone } from "@/components/dashboard/statusTone";

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}
function formatPct(n: number) {
  return `${n.toFixed(1)}%`;
}
function formatMs(n: number) {
  return `${Math.round(n)} ms`;
}

function buildSparklinePoints(values: number[]): string {
  if (!values.length) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const width = 48;
  const height = 16;
  return values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * width;
      const norm = (v - min) / span;
      const y = height - norm * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function DashboardClient() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<DashboardResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [insurerFilter, setInsurerFilter] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getDashboard()
      .then((d) => { if (!mounted) return; setData(d); })
      .catch((e) => { if (!mounted) return; setError(e instanceof Error ? e.message : "Unknown error."); })
      .finally(() => { if (!mounted) return; setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredRows = React.useMemo(() => {
    if (!data?.verifications) return [];
    return data.verifications.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (insurerFilter && row.insurer !== insurerFilter) return false;
      const ts = new Date(row.timestamp).getTime();
      if (fromDate && ts < new Date(fromDate).getTime()) return false;
      if (toDate && ts > new Date(toDate).getTime()) return false;
      return true;
    });
  }, [data, statusFilter, insurerFilter, fromDate, toDate]);

  const responseBuckets = React.useMemo(() => {
    const rows = data?.verifications ?? [];
    const total = rows.length || 1;
    const lt1 = rows.filter((r) => r.response_time_ms < 1000).length;
    const bt1and3 = rows.filter((r) => r.response_time_ms >= 1000 && r.response_time_ms <= 3000).length;
    const gt3 = rows.filter((r) => r.response_time_ms > 3000).length;
    return {
      lt1: (lt1 / total) * 100,
      bt1and3: (bt1and3 / total) * 100,
      gt3: (gt3 / total) * 100,
    };
  }, [data]);

  const statusBuckets = React.useMemo(() => {
    const rows = data?.verifications ?? [];
    const total = rows.length || 1;
    const eligible = rows.filter((r) => r.status.toLowerCase().includes("eligible")).length;
    const notEligible = rows.filter((r) => r.status.toLowerCase().includes("not")).length;
    const failed = rows.filter((r) => r.status.toLowerCase().includes("fail")).length;
    return {
      eligible: (eligible / total) * 100,
      notEligible: (notEligible / total) * 100,
      failed: (failed / total) * 100,
    };
  }, [data]);

  const uniqueStatuses = React.useMemo(
    () => Array.from(new Set(data?.verifications.map((r) => r.status) ?? [])).sort(),
    [data],
  );
  const uniqueInsurers = React.useMemo(
    () => Array.from(new Set(data?.verifications.map((r) => r.insurer) ?? [])).sort(),
    [data],
  );
  const sparklineValues = React.useMemo(
    () => (data?.verifications ?? []).slice(0, 12).map((r) => r.response_time_ms),
    [data],
  );

  const [animatedMetrics, setAnimatedMetrics] = React.useState({ total: 0, active: 0, avg: 0, failure: 0 });

  React.useEffect(() => {
    if (!data?.metrics) return;
    const start = performance.now();
    const duration = 600;
    const to = {
      total: data.metrics.total_verifications,
      active: data.metrics.active_percent,
      avg: data.metrics.avg_response_time_ms,
      failure: data.metrics.failure_rate_percent,
    };
    let frame: number;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-cubic
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimatedMetrics({
        total: to.total * ease,
        active: to.active * ease,
        avg: to.avg * ease,
        failure: to.failure * ease,
      });
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [data]);

  // Shared filter input style
  const filterInput = "h-8 rounded-lg border border-white/[0.09] bg-white/[0.05] px-2.5 text-[12px] text-[rgba(245,245,247,0.75)] outline-none transition-all duration-[400ms] focus:border-[rgba(10,132,255,0.5)] focus:ring-2 focus:ring-[rgba(10,132,255,0.12)] backdrop-blur-sm";

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Ambient blur blobs for depth */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.07),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.05),transparent_70%)] blur-3xl" />
      </div>

      <section className="relative z-10 py-14">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-12">
          <Reveal>
            <h2 className="text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f5f5f7] sm:text-[52px]">
              Dashboard
            </h2>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="mt-3 text-[16px] text-[rgba(245,245,247,0.45)]">
              Operational overview for eligibility verification activity.
            </p>
          </Reveal>
        </div>

        {/* ── Error banner ───────────────────────────────────── */}
        {error && (
          <div className="mb-10">
            <Card className="border-rose-500/20 bg-rose-500/[0.06]">
              <p className="text-[14px] font-medium text-rose-300">Dashboard data unavailable</p>
              <p className="mt-1.5 text-[13px] text-[rgba(245,245,247,0.4)]">{error}</p>
            </Card>
          </div>
        )}

        <div className="grid gap-6">
          {/* ── Metric cards ───────────────────────────────────── */}
          <Reveal delayMs={160}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total verifications", value: animatedMetrics.total, fmt: (n: number) => formatNumber(Math.round(n)) },
                { label: "Active coverage",     value: animatedMetrics.active,  fmt: formatPct },
                { label: "Avg response time",   value: animatedMetrics.avg,     fmt: formatMs },
                { label: "Failure rate",         value: animatedMetrics.failure, fmt: formatPct },
              ].map((m) => (
                <Card key={m.label} className="flex flex-col gap-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-10 w-28" />
                      <Skeleton className="h-3.5 w-36 rounded-md" />
                    </>
                  ) : (
                    <>
                      <div
                        className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-[#f5f5f7]"
                        style={{ animation: "countUp 500ms cubic-bezier(0.22,1,0.36,1) both" }}
                      >
                        {m.fmt(m.value)}
                      </div>
                      <div className="text-[12px] uppercase tracking-wider text-[rgba(245,245,247,0.4)]">
                        {m.label}
                      </div>
                      <div className="h-10 mt-auto">
                        {sparklineValues.length ? (
                          <svg viewBox="0 0 48 16" className="h-full w-full" aria-hidden="true">
                            <polyline
                              fill="none"
                              stroke="rgba(245,245,247,0.2)"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={buildSparklinePoints(sparklineValues)}
                            />
                          </svg>
                        ) : (
                          <div className="h-full rounded-lg bg-white/[0.04]" />
                        )}
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </Reveal>

          {/* ── Recent Verifications table ──────────────────────── */}
          <Reveal delayMs={220}>
            <Card>
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f7]">
                    Recent Verifications
                  </h3>
                  <p className="mt-1.5 text-[13px] text-[rgba(245,245,247,0.4)]">
                    Patient verification activity and response performance.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(245,245,247,0.35)]">Status</span>
                    <select className={filterInput} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="">All</option>
                      {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-[rgba(245,245,247,0.35)]">Insurer</span>
                    <select className={filterInput} value={insurerFilter} onChange={(e) => setInsurerFilter(e.target.value)}>
                      <option value="">All</option>
                      {uniqueInsurers.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-[rgba(245,245,247,0.35)]">Date</span>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={filterInput} />
                  <span className="text-[rgba(245,245,247,0.25)]">–</span>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={filterInput} />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                <div className="max-h-[460px] overflow-auto">
                  <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
                    <thead className="sticky top-0 bg-[rgba(14,14,16,0.95)] backdrop-blur-sm">
                      <tr className="text-[11px] font-medium uppercase tracking-wider text-[rgba(245,245,247,0.35)]">
                        {["Patient Name", "Insurer", "Service Type", "Status", "Response Time", "Timestamp"].map((h) => (
                          <th key={h} className="border-b border-white/[0.07] px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[13px] text-[rgba(245,245,247,0.7)]">
                      {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <tr key={i} className="border-b border-white/[0.05]">
                            {Array.from({ length: 6 }).map((__, j) => (
                              <td key={j} className="px-4 py-4">
                                <Skeleton className="h-3.5 w-full rounded-md" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : filteredRows.length ? (
                        filteredRows.map((row, idx) => (
                          <tr
                            key={`${row.patient_name}-${row.timestamp}-${idx}`}
                            className="transition-colors duration-[350ms] hover:bg-white/[0.03]"
                          >
                            <td className="border-b border-white/[0.05] px-4 py-4 text-[#f5f5f7]">{row.patient_name}</td>
                            <td className="border-b border-white/[0.05] px-4 py-4 text-[rgba(245,245,247,0.45)]">{row.insurer}</td>
                            <td className="border-b border-white/[0.05] px-4 py-4 text-[rgba(245,245,247,0.45)]">{row.service_type}</td>
                            <td className="border-b border-white/[0.05] px-4 py-4">
                              <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                            </td>
                            <td className="border-b border-white/[0.05] px-4 py-4 text-[rgba(245,245,247,0.45)]">{formatMs(row.response_time_ms)}</td>
                            <td className="border-b border-white/[0.05] px-4 py-4 text-[rgba(245,245,247,0.4)]">{new Date(row.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-14 text-center text-[13px] text-[rgba(245,245,247,0.35)]">
                            No verifications match the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* ── Breakdown cards ────────────────────────────────── */}
          <Reveal delayMs={280}>
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Response time */}
              <Card>
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#f5f5f7]">
                  Response time breakdown
                </h3>
                <p className="mt-1 text-[12px] text-[rgba(245,245,247,0.4)]">
                  Distribution across recent verifications.
                </p>
                <dl className="mt-6 space-y-5 text-[12px]">
                  {[
                    { label: "< 1s",  value: responseBuckets.lt1 },
                    { label: "1–3s",  value: responseBuckets.bt1and3 },
                    { label: "> 3s",  value: responseBuckets.gt3 },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <dt className="text-[rgba(245,245,247,0.55)]">{b.label}</dt>
                        <dd className="text-[rgba(245,245,247,0.4)]">{b.value.toFixed(0)}%</dd>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-[rgba(245,245,247,0.35)] transition-[width] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{ width: `${Math.min(100, b.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </Card>

              {/* Status distribution */}
              <Card>
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#f5f5f7]">
                  Verification status distribution
                </h3>
                <p className="mt-1 text-[12px] text-[rgba(245,245,247,0.4)]">
                  Share of outcomes across recent checks.
                </p>
                <dl className="mt-6 space-y-5 text-[12px]">
                  {[
                    { label: "Eligible",     value: statusBuckets.eligible,     color: "bg-emerald-400/50" },
                    { label: "Not eligible", value: statusBuckets.notEligible,  color: "bg-rose-400/50" },
                    { label: "Failed",        value: statusBuckets.failed,       color: "bg-amber-400/50" },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <dt className="text-[rgba(245,245,247,0.55)]">{b.label}</dt>
                        <dd className="text-[rgba(245,245,247,0.4)]">{b.value.toFixed(0)}%</dd>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full ${b.color} transition-[width] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
                          style={{ width: `${Math.min(100, b.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
