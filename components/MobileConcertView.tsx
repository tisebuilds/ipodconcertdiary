"use client";

import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";
import { cn } from "@/lib/cn";
import { MOBILE_SCREEN_OUTER_RADIUS_CLASS } from "@/lib/mobile-screen-frame";

/** Narrow screens: full viewport, same UI without the plastic shell (PRD §7). */
export function MobileConcertView({
  className,
}: {
  className?: string;
} = {}) {
  return (
    <div
      className={cn(
        "flex min-h-[100dvh] w-full flex-col bg-white pt-[max(0.75rem,env(safe-area-inset-top))] [color-scheme:light]",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div
          className={cn(
            "mx-auto w-full max-w-md shrink-0 overflow-hidden border border-black/25 bg-black",
            MOBILE_SCREEN_OUTER_RADIUS_CLASS,
          )}
        >
          <IpodScreen
            embedded
            className="h-[min(377px,max(279px,63dvh))] min-h-0"
          />
        </div>
        {/* Fills space below the capped screen so the clickwheel sits lower with visible gap */}
        <div className="min-h-5 flex-1" aria-hidden />
      </div>
      <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-5 [--ipod-body:#ffffff]">
        <ClickWheel />
      </div>
    </div>
  );
}
