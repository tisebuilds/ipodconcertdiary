"use client";

import { concerts } from "@/data/concerts";
import { countForYear, MENU_YEARS } from "@/lib/concert-utils";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";

export function MenuView() {
  const { menuIndex } = useIpod();

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
        className="flex shrink-0 items-center justify-between px-2 py-1 text-[11px] font-bold text-white"
        style={{
          background: "linear-gradient(180deg, #4a90d9 0%, #2770c8 100%)",
        }}
      >
        <span>Music</span>
        <BatteryIcon />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, i) => {
          const selected = i === menuIndex;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-black/[0.06] px-2 py-1.5 transition-colors duration-100"
              style={
                selected
                  ? {
                      background: "linear-gradient(180deg, #3a7fd4 0%, #1a5fc0 100%)",
                      color: "#fff",
                    }
                  : undefined
              }
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
