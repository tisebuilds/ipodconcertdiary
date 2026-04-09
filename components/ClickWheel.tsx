"use client";

import { cn } from "@/lib/cn";
import { useIpod } from "@/components/IpodContext";

export function ClickWheel() {
  const {
    menuButton,
    scrollUp,
    scrollDown,
    center,
    playPause,
    view,
  } = useIpod();

  const onPlayRing = () => {
    if (view === "nowPlaying") playPause();
  };

  return (
    <div className="relative mx-auto h-[172px] w-[172px] shrink-0">
      <div className="absolute inset-0 rounded-full bg-[var(--ipod-ring)]">
        <button
          type="button"
          aria-label="Menu"
          className="absolute left-1/2 top-[19px] -translate-x-1/2 text-[8px] font-semibold tracking-wide text-[#6e6e6e] transition-[transform,filter] duration-75 ease-out hover:opacity-90 active:translate-y-px active:brightness-[0.88]"
          onClick={menuButton}
        >
          MENU
        </button>

        <button
          type="button"
          aria-label="Previous"
          className="absolute left-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e] transition-[transform,filter] duration-75 ease-out hover:opacity-90 active:translate-x-px active:brightness-[0.88]"
          onClick={scrollUp}
        >
          ⏮
        </button>

        <button
          type="button"
          aria-label="Next"
          className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e] transition-[transform,filter] duration-75 ease-out hover:opacity-90 active:-translate-x-px active:brightness-[0.88]"
          onClick={scrollDown}
        >
          ⏭
        </button>

        <button
          type="button"
          aria-label="Play or pause"
          className={cn(
            "absolute bottom-[21px] left-1/2 -translate-x-1/2 text-[14px] leading-none text-[#6e6e6e] transition-[transform,filter] duration-75 ease-out hover:opacity-90 active:translate-y-px active:brightness-[0.88]",
            view !== "nowPlaying" &&
              "cursor-default opacity-35 hover:opacity-35 active:translate-y-0 active:brightness-100",
          )}
          onClick={onPlayRing}
          disabled={view !== "nowPlaying"}
        >
          ▶⏸
        </button>

        <button
          type="button"
          aria-label="Select"
          className="absolute left-1/2 top-1/2 z-10 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ipod-body)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-3px_6px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-75 ease-out active:-translate-x-1/2 active:translate-y-[calc(-50%+2px)] active:shadow-[inset_0_5px_10px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.1)]"
          onClick={center}
        />
      </div>
    </div>
  );
}
