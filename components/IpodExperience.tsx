"use client";

import { useEffect, useState } from "react";
import { IpodShell } from "@/components/IpodShell";
import { MobileConcertView } from "@/components/MobileConcertView";

export function IpodExperience() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 399px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (narrow) {
    return <MobileConcertView />;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-3 py-10"
      style={{
        background:
          "radial-gradient(ellipse at center, #2a2a2a 0%, #111 55%, #080808 100%)",
      }}
    >
      <IpodShell />
    </div>
  );
}
