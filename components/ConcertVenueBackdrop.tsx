"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { concertPhotoSrc } from "@/lib/concert-utils";
import { cn } from "@/lib/cn";
import type { Concert } from "@/types/concert";

type Props = {
  concert: Concert | null;
  active: boolean;
};

/**
 * Full-viewport blurred concert imagery while playback is running — reads as “still at the show.”
 */
export function ConcertVenueBackdrop({ concert, active }: Props) {
  const src = concert ? concertPhotoSrc(concert.photo) : null;
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [concert?.id, src]);

  const showPhoto = Boolean(src) && !broken;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ease-out motion-reduce:transition-none",
        active ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      {showPhoto && src && concert ? (
        <>
          <Image
            key={`${concert.id}:${src}`}
            src={src}
            alt=""
            fill
            className="scale-[1.15] object-cover blur-[6px] saturate-[1.08] brightness-[0.7]"
            sizes="100vw"
            loading="eager"
            unoptimized
            onError={() => setBroken(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/5 to-black/20" />
        </>
      ) : concert && active ? (
        <>
          <div
            className="absolute inset-0 scale-110 blur-[6px]"
            style={{ background: concert.bg }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/14 via-black/5 to-black/22" />
        </>
      ) : null}
    </div>
  );
}
