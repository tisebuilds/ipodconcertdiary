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

  const ringEaseRelease = "duration-[200ms] ease-[cubic-bezier(0.34,1.45,0.64,1)]";

  const segmentPress =
    "select-none touch-manipulation transition-[transform,filter] hover:opacity-90 " +
    "duration-[200ms] ease-[cubic-bezier(0.34,1.45,0.64,1)] " +
    "active:duration-[60ms] active:ease-out active:brightness-[0.82]";

  return (
    <div className="relative mx-auto h-[172px] w-[172px] shrink-0">
      <div
        className={cn(
          "absolute inset-0 origin-center rounded-full bg-[var(--ipod-ring)] transition-transform",
          ringEaseRelease,
          "has-[button:active]:scale-[0.981] has-[button:active]:duration-[60ms] has-[button:active]:ease-out",
        )}
        style={{
          boxShadow: `
            inset -3px -4px 11px rgba(255, 255, 255, 0.42),
            inset 1px 2px 0 rgba(255, 255, 255, 0.22),
            inset 5px 7px 18px rgba(0, 0, 0, 0.16),
            inset 8px 12px 32px rgba(0, 0, 0, 0.11)
          `,
        }}
      >
        <button
          type="button"
          aria-label="Menu"
          className={cn(
            segmentPress,
            "absolute left-1/2 top-[19px] -translate-x-1/2 text-[8px] font-semibold tracking-wide text-[#6e6e6e]",
            "active:-translate-x-1/2 active:translate-y-[3px]",
          )}
          onClick={menuButton}
        >
          MENU
        </button>

        <button
          type="button"
          aria-label="Previous"
          className={cn(
            segmentPress,
            "absolute left-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e]",
            "active:translate-x-[3px] active:-translate-y-1/2",
          )}
          onClick={scrollUp}
        >
          ⏮
        </button>

        <button
          type="button"
          aria-label="Next"
          className={cn(
            segmentPress,
            "absolute right-[22px] top-1/2 -translate-y-1/2 text-[12px] text-[#6e6e6e]",
            "active:-translate-x-[3px] active:-translate-y-1/2",
          )}
          onClick={scrollDown}
        >
          ⏭
        </button>

        <button
          type="button"
          aria-label="Play or pause"
          className={cn(
            segmentPress,
            "absolute bottom-[21px] left-1/2 -translate-x-1/2 text-[14px] leading-none text-[#6e6e6e]",
            "active:-translate-x-1/2 active:translate-y-[3px]",
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
          className={cn(
            "select-none touch-manipulation absolute left-1/2 top-1/2 z-10 h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ipod-body)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.22),inset_0_-3px_6px_rgba(0,0,0,0.18)] transition-[transform,box-shadow]",
            ringEaseRelease,
            "active:duration-[60ms] active:ease-out",
            "active:scale-[0.94] active:-translate-x-1/2 active:translate-y-[calc(-50%+4px)] active:shadow-[inset_0_8px_14px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(255,255,255,0.08)]",
          )}
          onClick={center}
        />
      </div>
    </div>
  );
}
