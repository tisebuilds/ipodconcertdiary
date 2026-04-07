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
          className="absolute left-1/2 top-[19px] -translate-x-1/2 text-[8px] font-semibold tracking-wide text-[#6e6e6e] hover:opacity-90"
          onClick={menuButton}
        >
          MENU
        </button>

        <button
          type="button"
          aria-label="Previous"
          className="absolute left-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e] hover:opacity-90"
          onClick={scrollUp}
        >
          ⏮
        </button>

        <button
          type="button"
          aria-label="Next"
          className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e] hover:opacity-90"
          onClick={scrollDown}
        >
          ⏭
        </button>

        <button
          type="button"
          aria-label="Play or pause"
          className={cn(
            "absolute bottom-[21px] left-1/2 -translate-x-1/2 text-[14px] leading-none text-[#6e6e6e] hover:opacity-90",
            view !== "nowPlaying" && "cursor-default opacity-35 hover:opacity-35",
          )}
          onClick={onPlayRing}
          disabled={view !== "nowPlaying"}
        >
          ▶⏸
        </button>

        <button
          type="button"
          aria-label="Select"
          className="absolute left-1/2 top-1/2 z-10 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ipod-body)] active:translate-x-[-50%] active:translate-y-[-48%]"
          onClick={center}
        />
      </div>
    </div>
  );
}
