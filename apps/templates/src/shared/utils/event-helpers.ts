import type { Event } from "@shared/types/api";

type ApiEventStatus = Event["status"];

/** Whether the event status allows booking */
export function isBookableStatus(status: ApiEventStatus): boolean {
  return status === "OPEN" || status === "WAITLIST";
}

/** Format an ISO date pair into "DD/MM – DD/MM" display string */
export function formatDateRange(
  startAt: string,
  endAt?: string | null,
): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  };
  if (!endAt) return fmt(startAt);
  return `${fmt(startAt)} – ${fmt(endAt)}`;
}
