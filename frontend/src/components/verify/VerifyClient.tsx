"use client";

import * as React from "react";
import { EligibilityResultCard } from "@/components/verify/EligibilityResultCard";
import { VerificationTimeline } from "@/components/verify/VerificationTimeline";
import { VerificationHistoryPreview } from "@/components/verify/VerificationHistoryPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, FieldError, Label } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Reveal } from "@/components/ui/Reveal";
import {
  verifyEligibility,
  type EligibilityResponse,
  type VerificationRequest,
  checkHealth,
} from "@/services/api";

type FormState = {
  full_name: string;
  date_of_birth: string;
  insurance_provider: string;
  policy_number: string;
  service_type: string;
  appointment_date: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const INSURERS = [
  "",
  "Aetna",
  "Blue Cross Blue Shield",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "UnitedHealthcare",
  "Other",
];

function validate(values: FormState): Errors {
  const e: Errors = {};
  if (!values.full_name.trim()) e.full_name = "Full name is required.";
  if (!values.date_of_birth) e.date_of_birth = "Date of birth is required.";
  if (!values.policy_number.trim()) e.policy_number = "Policy number is required.";
  return e;
}

export function VerifyClient() {
  const [values, setValues] = React.useState<FormState>({
    full_name: "",
    date_of_birth: "",
    insurance_provider: "",
    policy_number: "",
    service_type: "",
    appointment_date: "",
  });
  const [touched, setTouched] = React.useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<EligibilityResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [phase, setPhase] = React.useState<
    "idle" | "request" | "routing" | "insurer" | "final"
  >("idle");
  const [systemStatus, setSystemStatus] = React.useState<
    "checking" | "up" | "down"
  >("checking");

  React.useEffect(() => {
    let mounted = true;
    const runCheck = async () => {
      const res = await checkHealth();
      if (!mounted) return;
      setSystemStatus(res === "up" ? "up" : "down");
    };
    runCheck();
    const id = window.setInterval(runCheck, 15000);
    return () => { mounted = false; window.clearInterval(id); };
  }, []);

  const errors = validate(values);
  const requiredValid = Object.keys(errors).length === 0;

  function onChange<K extends keyof FormState>(key: K, next: string) {
    setValues((v) => ({ ...v, [key]: next }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    if (!requiredValid || submitting) return;

    setSubmitting(true);
    setError(null);
    setResult(null);
    setPhase("request");

    const payload: VerificationRequest = {
      full_name: values.full_name.trim(),
      date_of_birth: values.date_of_birth,
      insurance_provider: values.insurance_provider || undefined,
      policy_number: values.policy_number.trim(),
      service_type: values.service_type.trim() || undefined,
      appointment_date: values.appointment_date || undefined,
    };

    try {
      setPhase("routing");
      const data = await verifyEligibility(payload);
      setPhase("insurer");
      setResult(data);
      setPhase("final");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
      setPhase("final");
    } finally {
      setSubmitting(false);
    }
  }

  const rightState =
    submitting
      ? ({ kind: "loading" } as const)
      : error
        ? ({ kind: "error", message: error } as const)
        : result
          ? ({ kind: "result", data: result } as const)
          : ({ kind: "empty" } as const);

  const statusDot =
    systemStatus === "up"
      ? "bg-emerald-400"
      : systemStatus === "down"
        ? "bg-rose-400"
        : "bg-amber-400";

  const statusLabel =
    systemStatus === "checking"
      ? "Checking…"
      : systemStatus === "up"
        ? "Operational"
        : "Backend disconnected";

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* ── Page header ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Reveal>
                <h2 className="text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f5f5f7] sm:text-[48px]">
                  Verify coverage
                </h2>
              </Reveal>
              <Reveal delayMs={80}>
                <p className="mt-3 text-[16px] leading-relaxed text-[rgba(245,245,247,0.5)]">
                  Enter patient details to request eligibility verification.
                </p>
              </Reveal>
            </div>

            <Reveal delayMs={120}>
              {/* System status pill */}
              <div className="shrink-0 flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.06] px-3 py-1.5 text-[12px] text-[rgba(245,245,247,0.6)] backdrop-blur-xl">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot} shadow-[0_0_6px_currentColor]`} />
                {statusLabel}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <Reveal delayMs={160} className="h-full">
            <Card className="h-full">
              <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[#f5f5f7]">
                Patient Verification
              </h3>
              <p className="mt-1.5 text-[13px] text-[rgba(245,245,247,0.4)]">
                Required fields must be completed to submit.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
                <Field>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={values.full_name}
                    onChange={(e) => onChange("full_name", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, full_name: true }))}
                    required
                    aria-invalid={Boolean(errors.full_name)}
                    placeholder="Jane Smith"
                  />
                  {(touched.full_name || hasSubmitted) && errors.full_name && (
                    <FieldError>{errors.full_name}</FieldError>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={values.date_of_birth}
                    onChange={(e) => onChange("date_of_birth", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, date_of_birth: true }))}
                    required
                    aria-invalid={Boolean(errors.date_of_birth)}
                  />
                  {(touched.date_of_birth || hasSubmitted) && errors.date_of_birth && (
                    <FieldError>{errors.date_of_birth}</FieldError>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="insurance_provider">Insurance Provider</Label>
                  <Select
                    id="insurance_provider"
                    name="insurance_provider"
                    value={values.insurance_provider}
                    onChange={(e) => onChange("insurance_provider", e.target.value)}
                  >
                    <option value="">Select a provider</option>
                    {INSURERS.filter(Boolean).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </Field>

                <Field>
                  <Label htmlFor="policy_number">Policy Number</Label>
                  <Input
                    id="policy_number"
                    name="policy_number"
                    value={values.policy_number}
                    onChange={(e) => onChange("policy_number", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, policy_number: true }))}
                    required
                    aria-invalid={Boolean(errors.policy_number)}
                    placeholder="e.g. POL-00123456"
                  />
                  {(touched.policy_number || hasSubmitted) && errors.policy_number && (
                    <FieldError>{errors.policy_number}</FieldError>
                  )}
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="service_type">Service Type</Label>
                    <Input
                      id="service_type"
                      name="service_type"
                      value={values.service_type}
                      onChange={(e) => onChange("service_type", e.target.value)}
                      placeholder="e.g., MRI, PCP visit"
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="appointment_date">Appointment Date</Label>
                    <Input
                      id="appointment_date"
                      name="appointment_date"
                      type="date"
                      value={values.appointment_date}
                      onChange={(e) => onChange("appointment_date", e.target.value)}
                    />
                  </Field>
                </div>

                <Button
                  intent="primary"
                  size="lg"
                  type="submit"
                  disabled={!requiredValid || submitting}
                  aria-disabled={!requiredValid || submitting}
                  className="mt-2 w-full"
                >
                  {submitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Verifying…
                    </>
                  ) : (
                    "Verify Coverage"
                  )}
                </Button>
              </form>
            </Card>
          </Reveal>

          <Reveal delayMs={240} className="h-full">
            <EligibilityResultCard state={rightState} />
          </Reveal>
        </div>

        <VerificationTimeline active={phase} />

        <Reveal delayMs={320}>
          <VerificationHistoryPreview />
        </Reveal>
      </section>
    </main>
  );
}
