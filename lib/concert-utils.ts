import type { Concert } from "@/types/concert";

export const MENU_YEARS = [2022, 2023, 2024, 2025] as const;

export function compareConcerts(a: Concert, b: Concert): number {
  if (a.date && b.date) return a.date.localeCompare(b.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.id.localeCompare(b.id);
}

export function getConcertsForYear(
  all: Concert[],
  year: number | "all",
): Concert[] {
  const filtered =
    year === "all" ? [...all] : all.filter((c) => c.year === year);
  return filtered.sort(compareConcerts);
}

export function countForYear(all: Concert[], year: number | "all"): number {
  return getConcertsForYear(all, year).length;
}

export function formatShortDate(date: string | null): string {
  if (!date) return "—";
  const [y, m, d] = date.split("-");
  if (!m || !d) return date;
  return `${Number(m)}/${Number(d)}/${y.slice(2)}`;
}

/** Random duration between 3 and 5 minutes (ms). */
export function randomTrackDurationMs(): number {
  const min = 3 * 60 * 1000;
  const max = 5 * 60 * 1000;
  return min + Math.random() * (max - min);
}

export function formatTrackTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
