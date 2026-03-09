export function statusTone(status: string) {
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending" as const;
  if (s.includes("not") || s.includes("fail") || s.includes("error"))
    return "bad" as const;
  if (s.includes("eligible") || s.includes("active") || s.includes("ok"))
    return "good" as const;
  return "neutral" as const;
}

