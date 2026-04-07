"use client";

import Image from "next/image";
import { formatShortDate } from "@/lib/concert-utils";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";

function concertPhotoSrc(photo: string | null): string | null {
  if (!photo) return null;
  return photo.startsWith("/") ? photo : `/concerts/${photo}`;
}

export function ConcertListView() {
  const { listIndex, currentList, yearFilter } = useIpod();

  const title =
    yearFilter === "all" ? "All Concerts" : String(yearFilter);

  const needsScroll = currentList.length > 5;

  return (
    <div className="flex h-full flex-col bg-[#c8c8c8] text-[#111]">
      <div
        className="flex shrink-0 items-center justify-between px-2 py-1 text-[11px] font-bold text-white"
        style={{
          background: "linear-gradient(180deg, #4a90d9 0%, #2770c8 100%)",
        }}
      >
        <span className="truncate">{title}</span>
        <BatteryIcon />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {currentList.map((c, i) => {
          const selected = i === listIndex;
          return (
            <div
              key={c.id}
              className="flex items-center justify-between gap-1 border-b border-black/[0.06] px-2 py-1.5 transition-colors duration-100"
              style={
                selected
                  ? {
                      background: "linear-gradient(180deg, #3a7fd4 0%, #1a5fc0 100%)",
                      color: "#fff",
                    }
                  : undefined
              }
            >
              <span className="flex min-w-0 items-center gap-1.5">
                {concertPhotoSrc(c.photo) ? (
                  <span className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-[3px] bg-black/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
                    <Image
                      src={concertPhotoSrc(c.photo)!}
                      alt={c.artist}
                      width={22}
                      height={22}
                      className="h-[22px] w-[22px] object-cover"
                      sizes="22px"
                    />
                  </span>
                ) : (
                  <span className="shrink-0 text-[13px] leading-none">
                    {c.emoji}
                  </span>
                )}
                <span
                  className="truncate text-[12px] font-medium leading-tight"
                  style={{ color: selected ? "#fff" : "#111" }}
                >
                  {c.artist}
                </span>
              </span>
              <span
                className="shrink-0 text-[10px] tabular-nums"
                style={{
                  color: selected ? "rgba(255,255,255,0.85)" : "rgba(17,17,17,0.65)",
                }}
              >
                {formatShortDate(c.date)}
              </span>
            </div>
          );
        })}
      </div>
      {needsScroll ? (
        <div className="pointer-events-none shrink-0 py-0.5 text-center text-[8px] text-[#111]/45">
          Scroll
        </div>
      ) : null}
    </div>
  );
}
