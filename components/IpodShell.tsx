"use client";

import { useEffect, useState } from "react";
import { ClickWheel } from "@/components/ClickWheel";
import { IpodScreen } from "@/components/IpodScreen";

/** Fixed layout width for iPod nano–style shell (narrow + tall). */
const SHELL_WIDTH_PX = 236;

function useShellScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 600) {
        setScale(1);
        return;
      }
      const padded = Math.max(280, w - 24);
      setScale(Math.min(1, padded / SHELL_WIDTH_PX));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

export function IpodShell() {
  const scale = useShellScale();

  return (
    <div
      className="origin-center will-change-transform"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        className="relative rounded-[28px] border border-black/[0.09] px-3 pb-4 pt-5"
        style={{
          width: SHELL_WIDTH_PX,
          /* Solid base + subtle edge vignette (matte plastic, not glossy) */
          background:
            "radial-gradient(ellipse 125% 120% at 50% 38%, var(--ipod-body) 0%, color-mix(in srgb, var(--ipod-body) 92%, #000) 100%)",
          boxShadow:
            "inset 0 0 72px rgba(0,0,0,0.055), 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* Hold switch (nano-style detail) */}
        <div
          className="pointer-events-none absolute right-5 top-2 h-[5px] w-[26px] rounded-full border border-black/20"
          style={{ background: "#b8b8c0" }}
          aria-hidden
        />

        <div className="rounded-[12px] border border-[#2a2a2a] bg-[#141414] p-[9px]">
          {/* ~3:4 portrait glass — matches nano photo area */}
          <IpodScreen className="h-[256px]" />
        </div>

        <div className="mt-6 shrink-0">
          <ClickWheel />
        </div>
      </div>
    </div>
  );
}
