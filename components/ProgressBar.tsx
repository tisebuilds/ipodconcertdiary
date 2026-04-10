"use client";

import { formatTrackTime } from "@/lib/concert-utils";

type ProgressBarProps = {
  progress: number;
  elapsedMs: number;
  durationMs: number;
};

/** iOS-style skeuomorphic scrubber: glossy blue fill, light track, thin bezel. */
const scrubberFillStyle = {
  background:
    "linear-gradient(to bottom, #b8dcff 0%, #6eb4f0 38%, #3d94e0 72%, #2a7fd0 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.45)",
} as const;

export function ProgressBar({
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
      <div className="relative h-[5px] min-w-0 flex-1 overflow-hidden rounded-full border border-black/45 bg-gradient-to-b from-[#f8f8fa] to-[#c8ccd4] shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]">
        <div
          className="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${pct}%`,
            ...scrubberFillStyle,
          }}
        />
      </div>
      <span>-{formatTrackTime(remainingSec)}</span>
    </div>
  );
}
