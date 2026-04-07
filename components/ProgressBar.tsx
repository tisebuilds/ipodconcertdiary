"use client";

import { formatTrackTime } from "@/lib/concert-utils";

type ProgressBarProps = {
  accentColor: string;
  progress: number;
  elapsedMs: number;
  durationMs: number;
};

export function ProgressBar({
  accentColor,
  progress,
  elapsedMs,
  durationMs,
}: ProgressBarProps) {
  const elapsedSec = elapsedMs / 1000;
  const totalSec = durationMs / 1000;
  const remainingSec = Math.max(0, totalSec - elapsedSec);
  const pct = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className="flex items-center gap-1.5 text-[8px] tabular-nums text-white/40">
      <span>{formatTrackTime(elapsedSec)}</span>
      <div className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${pct}%`,
            backgroundColor: accentColor,
            transitionProperty: "width, background-color",
            transitionDuration: "100ms, 400ms",
            transitionTimingFunction: "linear, ease",
          }}
        />
      </div>
      <span>-{formatTrackTime(remainingSec)}</span>
    </div>
  );
}
