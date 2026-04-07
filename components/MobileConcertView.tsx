"use client";

import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";

/** Narrow screens: full viewport, same UI without the plastic shell (PRD §7). */
export function MobileConcertView() {
  return (
    <div
      className="flex h-[100dvh] flex-col bg-black"
      style={{
        background:
          "radial-gradient(ellipse at center, #2a2a2a 0%, #111 55%, #080808 100%)",
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col px-3 pt-3">
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
          <IpodScreen className="h-full min-h-0 flex-1" />
        </div>
      </div>
      <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <ClickWheel />
      </div>
    </div>
  );
}
