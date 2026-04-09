"use client";

import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";
import { cn } from "@/lib/cn";

/** Narrow screens: full viewport, same UI without the plastic shell (PRD §7). */
export function MobileConcertView({
  className,
}: {
  className?: string;
} = {}) {
  return (
    <div
      className={cn(
        "flex min-h-[100dvh] w-full flex-col bg-white [color-scheme:light]",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col px-3 pt-3">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden rounded-2xl border border-black/25 bg-black">
          <IpodScreen embedded className="h-full min-h-0 flex-1" />
        </div>
      </div>
      <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 [--ipod-body:#ffffff]">
        <ClickWheel />
      </div>
    </div>
  );
}
