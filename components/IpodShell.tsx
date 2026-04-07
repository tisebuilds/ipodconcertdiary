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
        className="relative rounded-[28px] px-3 pb-4 pt-5"
        style={{
          width: SHELL_WIDTH_PX,
          background:
            "linear-gradient(165deg, #ffc4dc 0%, #f06ba8 28%, #e03d82 58%, #b82a62 100%)",
          boxShadow:
            "0 28px 70px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -18px 32px rgba(120,20,60,0.22)",
        }}
      >
        {/* Hold switch (nano-style detail) */}
        <div
          className="pointer-events-none absolute right-5 top-2 h-[5px] w-[26px] rounded-full"
          style={{
            background: "linear-gradient(180deg, #e8e8ec, #9a9aa4)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
          aria-hidden
        />

        <div className="rounded-[12px] bg-[#141414] p-[9px] shadow-[inset_0_3px_10px_rgba(0,0,0,0.9)]">
          {/* ~3:4 portrait glass — matches nano photo area */}
          <IpodScreen className="h-[256px]" />
        </div>

        <div className="select-none py-1.5 text-center text-[9px] font-semibold tracking-[0.42em] text-white/35">
          iPod nano
        </div>

        <ClickWheel />
      </div>
    </div>
  );
}
