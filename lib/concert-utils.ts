import type { Concert } from "@/types/concert";

export const MENU_YEARS = [2022, 2023, 2024, 2025] as const;

/**
 * Public URL for a concert photo under `public/`, or `null` if none.
 * Accepts `/concerts/foo.png`, `foo.png`, or `concerts/foo.png` (normalized).
 */
export function concertPhotoSrc(photo: string | null): string | null {
  if (photo == null) return null;
  const trimmed = photo.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("concerts/")) return `/${trimmed}`;
  return `/concerts/${trimmed}`;
}

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

/** Uniform random index in `[0, length)`, or `0` if `length <= 0`. */
export function randomConcertIndex(length: number): number {
  if (length <= 0) return 0;
  return Math.floor(Math.random() * length);
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

const YT_ID_RE = /^[\w-]{11}$/;

/**
 * Accepts a bare 11-char id, youtu.be/…, or youtube.com watch / embed / shorts URLs.
 */
export function parseYoutubeVideoId(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  const s = raw.trim();
  if (!s) return null;
  if (YT_ID_RE.test(s)) return s;

  try {
    const u = new URL(s, "https://example.com");
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return YT_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v && YT_ID_RE.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        const id = parts[embedIdx + 1];
        return YT_ID_RE.test(id) ? id : null;
      }
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) {
        const id = parts[shortsIdx + 1];
        const base = id.split("?")[0];
        return YT_ID_RE.test(base) ? base : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}
