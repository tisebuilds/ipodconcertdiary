"use client";

import { cn } from "@/lib/cn";
import { concerts } from "@/data/concerts";
import { countForYear, MENU_YEARS } from "@/lib/concert-utils";
import { AudioMuteButton } from "@/components/AudioMuteButton";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";

/** Filled shuffle (Material-style) — reads clearly at ~14px; avoids stacked strokes muddying the crossing. */
function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="currentColor"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M14.83 13.41L13.42 14.82L16.55 17.95L14.5 20H20V14.5L17.96 16.54L14.83 13.41M14.5 4L16.54 6.04L4 18.59L5.41 20L17.96 7.46L20 9.5V4M10.59 9.17L5.41 4L4 5.41L9.17 10.58L10.59 9.17Z" />
    </svg>
  );
}

export function MenuView() {
  const { menuIndex, menuRowActivate } = useIpod();

  const rows: { label: string; count: number | null }[] = [
    { label: "All Concerts", count: countForYear(concerts, "all") },
    ...MENU_YEARS.map((y) => ({
      label: String(y),
      count: countForYear(concerts, y),
    })),
    { label: "Shuffle", count: null },
  ];

  return (
    <div className="flex h-full flex-col bg-[#F5F7FA] text-[#111]">
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-[#2a2a2a] bg-gradient-to-b from-[#D1D7E2] to-[#BCC5D3] px-2 py-[5px] text-[11px] font-bold leading-none text-black">
        <span className="flex justify-start">
          <AudioMuteButton />
        </span>
        <span className="text-center tracking-tight">
          {"Tise's iPod"}
        </span>
        <span className="flex justify-end">
          <BatteryIcon className="text-[#1E8E3E]" />
        </span>
      </div>
      <div className="ipod-screen-scroll min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, i) => {
          const selected = i === menuIndex;
          return (
            <button
              key={row.label === "Shuffle" ? "shuffle" : row.label}
              type="button"
              className={cn(
                "flex w-full cursor-pointer items-center justify-between border-b border-black/[0.07] px-2.5 py-1.5 text-left font-inherit transition-[background,filter,box-shadow] duration-150 ease-out max-[399px]:min-h-[48px] max-[399px]:py-2.5",
                selected
                  ? "bg-gradient-to-b from-[#4B89D6] to-[#245DB3] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_0_0_1px_rgba(255,255,255,0.12),0_2px_10px_rgba(36,93,179,0.28)] hover:brightness-[1.03] active:brightness-[0.97]"
                  : "bg-transparent shadow-none hover:bg-black/[0.04] active:bg-black/[0.07]",
              )}
              onClick={() => menuRowActivate(i)}
            >
              <span className="text-[12px] font-bold leading-tight tracking-tight">
                {row.label}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-[11px] font-bold tabular-nums",
                  selected ? "text-white" : "text-[#111]",
                )}
              >
                {row.label === "Shuffle" ? (
                  <ShuffleIcon className="shrink-0" />
                ) : row.count !== null ? (
                  <>
                    {row.count}
                    <span className="text-[12px] font-normal leading-none">
                      &gt;
                    </span>
                  </>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
