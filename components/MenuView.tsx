"use client";

import { cn } from "@/lib/cn";
import { concerts } from "@/data/concerts";
import { countForYear, MENU_YEARS } from "@/lib/concert-utils";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";

export function MenuView() {
  const { menuIndex, menuRowActivate } = useIpod();

  const rows: { label: string; count: number }[] = [
    { label: "All Concerts", count: countForYear(concerts, "all") },
    ...MENU_YEARS.map((y) => ({
      label: String(y),
      count: countForYear(concerts, y),
    })),
  ];

  return (
    <div className="flex h-full flex-col bg-[#c8c8c8] text-[#111]">
      <div
        className="flex shrink-0 items-center justify-between bg-[#2770c8] px-2 py-1 text-[11px] font-bold text-white"
      >
        <span>Music</span>
        <BatteryIcon />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, i) => {
          const selected = i === menuIndex;
          return (
            <button
              key={row.label}
              type="button"
              className={cn(
                "flex w-full cursor-pointer items-center justify-between border-b border-black/[0.06] px-2 py-1.5 text-left font-inherit transition-colors duration-100",
                selected
                  ? "bg-[#1a5fc0] text-white hover:bg-[#2568c4] active:bg-[#1f5aad]"
                  : "bg-transparent hover:bg-black/[0.07] active:bg-black/[0.11]",
              )}
              onClick={() => menuRowActivate(i)}
            >
              <span
                className="text-[12px] font-medium leading-tight"
                style={{ color: selected ? "#fff" : "#111" }}
              >
                {row.label}
              </span>
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{
                  color: selected ? "rgba(255,255,255,0.85)" : "rgba(17,17,17,0.65)",
                }}
              >
                {row.count}
                <span className="text-[11px] opacity-80">›</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
