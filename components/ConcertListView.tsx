"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { concertPhotoSrc, formatShortDate } from "@/lib/concert-utils";
import { AudioMuteButton } from "@/components/AudioMuteButton";
import { BatteryIcon } from "@/components/BatteryIcon";
import { useIpod } from "@/components/IpodContext";
import type { Concert } from "@/types/concert";

function ListRowArt({ concert }: { concert: Concert }) {
  const src = concertPhotoSrc(concert.photo);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [concert.id, src]);

  if (!src || broken) {
    return (
      <span className="shrink-0 text-[13px] leading-none max-[399px]:text-[16px]">
        {concert.emoji}
      </span>
    );
  }

  return (
    <span className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-[3px] border border-black/15 bg-black/10 max-[399px]:h-[30px] max-[399px]:w-[30px]">
      <Image
        key={`${concert.id}:${src}`}
        src={src}
        alt={concert.artist}
        width={30}
        height={30}
        className="h-[22px] w-[22px] max-[399px]:h-[30px] max-[399px]:w-[30px] object-cover"
        sizes="(max-width: 399px) 30px, 22px"
        unoptimized
        onError={() => setBroken(true)}
      />
    </span>
  );
}

export function ConcertListView() {
  const { listIndex, currentList, yearFilter, listRowActivate } = useIpod();

  const title =
    yearFilter === "all" ? "All Concerts" : String(yearFilter);

  return (
    <div className="flex h-full flex-col bg-[#F5F7FA] text-[#111]">
      <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-[#2a2a2a] bg-gradient-to-b from-[#D1D7E2] to-[#BCC5D3] px-2 py-[5px] text-[11px] font-bold leading-none text-black">
        <span className="flex justify-start">
          <AudioMuteButton />
        </span>
        <span className="truncate text-center tracking-tight">
          {title}
        </span>
        <span className="flex justify-end">
          <BatteryIcon className="text-[#1E8E3E]" />
        </span>
      </div>
      <div className="ipod-screen-scroll relative min-h-0 flex-1 overflow-y-auto">
        {currentList.map((c, i) => {
          const selected = i === listIndex;
          return (
            <button
              key={c.id}
              type="button"
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-1 border-b border-black/[0.07] px-2.5 py-1.5 text-left font-inherit transition-[background,filter,box-shadow] duration-150 ease-out max-[399px]:min-h-[48px] max-[399px]:py-2.5 max-[399px]:gap-1.5",
                selected
                  ? "bg-gradient-to-b from-[#4B89D6] to-[#245DB3] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_0_0_1px_rgba(255,255,255,0.12),0_2px_10px_rgba(36,93,179,0.28)] hover:brightness-[1.03] active:brightness-[0.97]"
                  : "bg-transparent shadow-none hover:bg-black/[0.04] active:bg-black/[0.07]",
              )}
              onClick={() => listRowActivate(i)}
            >
              <span className="flex min-w-0 items-center gap-1.5 max-[399px]:gap-2">
                <ListRowArt concert={c} />
                <span
                  className={cn(
                    "truncate text-[12px] font-bold leading-tight tracking-tight",
                    selected ? "text-white" : "text-[#111]",
                  )}
                >
                  {c.artist}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 text-[10px] font-bold tabular-nums",
                  selected ? "text-white/90" : "text-[#111]/75",
                )}
              >
                {formatShortDate(c.date)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
