"use client";

import { useEffect, useState } from "react";
import { ConcertVenueBackdrop } from "@/components/ConcertVenueBackdrop";
import { useIpod } from "@/components/IpodContext";
import { IpodBootChime } from "@/components/IpodBootChime";
import { IpodShell } from "@/components/IpodShell";
import { MobileConcertView } from "@/components/MobileConcertView";
import { cn } from "@/lib/cn";

export function IpodExperience() {
  const [narrow, setNarrow] = useState(false);
  const { isPlaying, currentConcert } = useIpod();
  const venueBackdrop = isPlaying && currentConcert !== null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 399px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (narrow) {
    return (
      <>
        <IpodBootChime />
        <ConcertVenueBackdrop concert={currentConcert} active={venueBackdrop} />
        <div className="relative z-10 flex h-[100dvh] flex-col bg-transparent">
          <MobileConcertView
            className={venueBackdrop ? "bg-transparent" : undefined}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ConcertVenueBackdrop concert={currentConcert} active={venueBackdrop} />
      <div
        className={cn(
          "relative z-10 flex min-h-screen items-center justify-center px-3 py-10",
          venueBackdrop ? "bg-transparent" : "bg-white",
        )}
      >
        <IpodBootChime />
        <IpodShell />
      </div>
    </>
  );
}
