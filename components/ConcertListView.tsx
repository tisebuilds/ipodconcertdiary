"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/concert-utils";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";

function concertPhotoSrc(photo: string | null): string | null {
  if (!photo) return null;
  return photo.startsWith("/") ? photo : `/concerts/${photo}`;
}

export function ConcertListView() {
  const { listIndex, currentList, yearFilter, listRowActivate } = useIpod();

  const title =
    yearFilter === "all" ? "All Concerts" : String(yearFilter);

  const needsScroll = currentList.length > 5;

  return (
    <div className="flex h-full flex-col bg-[#c8c8c8] text-[#111]">
      <div
        className="flex shrink-0 items-center justify-between bg-[#2770c8] px-2 py-1 text-[11px] font-bold text-white"
      >
        <span className="truncate">{title}</span>
        <BatteryIcon />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        {currentList.map((c, i) => {
          const selected = i === listIndex;
          return (
            <button
              key={c.id}
              type="button"
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-1 border-b border-black/[0.06] px-2 py-1.5 text-left font-inherit transition-colors duration-100",
                selected
                  ? "bg-[#1a5fc0] text-white hover:bg-[#2568c4] active:bg-[#1f5aad]"
                  : "bg-transparent hover:bg-black/[0.07] active:bg-black/[0.11]",
              )}
              onClick={() => listRowActivate(i)}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                {concertPhotoSrc(c.photo) ? (
                  <span className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-[3px] border border-black/15 bg-black/10">
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
            </button>
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
