export interface EligibilityResponse {
  final_status: string;
  coverage_status: string;
  copay: number;
  deductible_remaining: number;
  in_network: boolean;
  risk_score: number;
  timestamp: string;
}

export interface VerificationRequest {
  full_name: string;
  date_of_birth: string;
  insurance_provider?: string;
  policy_number: string;
  service_type?: string;
  appointment_date?: string;
}

export interface DashboardMetrics {
  total_verifications: number;
  active_percent: number;
  avg_response_time_ms: number;
  failure_rate_percent: number;
}

export interface VerificationRow {
  patient_name: string;
  insurer: string;
  service_type: string;
  status: string;
  response_time_ms: number;
  timestamp: string;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  verifications: VerificationRow[];
}

const DEFAULT_BASE_URL = "http://localhost:8000";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

async function fetchJson<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const timeoutMs = init?.timeoutMs ?? 15000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Request failed (${res.status}). ${text ? text.slice(0, 240) : ""}`.trim(),
      );
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

export async function verifyEligibility(body: VerificationRequest) {
  return fetchJson<EligibilityResponse>("/verify", {
    method: "POST",
    body: JSON.stringify(body),
    timeoutMs: 30000,
  });
}

export async function getDashboard() {
  return fetchJson<DashboardResponse>("/dashboard", { method: "GET" });
}

export async function checkHealth(): Promise<"up" | "down"> {
  try {
    const res = await fetch(`${getBaseUrl()}/health`, { method: "GET" });
    if (!res.ok) return "down";
    return "up";
  } catch {
    return "down";
  }
}


