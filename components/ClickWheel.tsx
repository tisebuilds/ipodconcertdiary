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
    isPlaying,
  } = useIpod();

  const onPlayRing = () => {
    if (view === "nowPlaying") playPause();
  };

  const ringSpin = view === "nowPlaying" && isPlaying;

  return (
    <div className="relative mx-auto h-[172px] w-[172px] shrink-0">
      <div
        className="absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,0.65),inset_0_-5px_12px_rgba(0,0,0,0.12)]"
        style={{
          background: "linear-gradient(145deg, #f4f4f4, #dedede, #d0d0d0)",
        }}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-[8px] rounded-full border border-black/[0.06] bg-transparent",
            ringSpin && "animate-wheel-spin",
          )}
        />

        <button
          type="button"
          aria-label="Menu"
          className="absolute left-1/2 top-[8px] -translate-x-1/2 text-[8px] font-semibold tracking-wide text-[#444] hover:text-black"
          onClick={menuButton}
        >
          MENU
        </button>

        <button
          type="button"
          aria-label="Previous"
          className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[12px] text-[#444] hover:text-black"
          onClick={scrollUp}
        >
          ⏮
        </button>

        <button
          type="button"
          aria-label="Next"
          className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[12px] text-[#444] hover:text-black"
          onClick={scrollDown}
        >
          ⏭
        </button>

        <button
          type="button"
          aria-label="Play or pause"
          className={cn(
            "absolute bottom-[10px] left-1/2 -translate-x-1/2 text-[14px] leading-none text-[#444] hover:text-black",
            view !== "nowPlaying" && "cursor-default opacity-35 hover:text-[#444]",
          )}
          onClick={onPlayRing}
          disabled={view !== "nowPlaying"}
        >
          ▶⏸
        </button>

        <button
          type="button"
          aria-label="Select"
          className="absolute left-1/2 top-1/2 z-10 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/15 shadow-[inset_0_2px_5px_rgba(255,255,255,0.55),inset_0_-4px_8px_rgba(120,20,60,0.25)] active:translate-x-[-50%] active:translate-y-[-48%]"
          style={{
            background:
              "linear-gradient(165deg, #ffb0d0 0%, #e84890 45%, #c42868 100%)",
          }}
          onClick={center}
        />
      </div>
    </div>
  );
}
