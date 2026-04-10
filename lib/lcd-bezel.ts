import type { CSSProperties } from "react";

/** Corner radius: chassis > LCD bezel > active glass (concentric read). */
export const LCD_BEZEL_RADIUS_CLASS = "rounded-[5px]";

/**
 * LCD surround material: flat #141414 plastic with a single rim, subtle vertical
 * molding, and a minimal top-left catch light. Keeps attention on the glass UI.
 */
export const lcdBezelStyle: CSSProperties = {
  background: `linear-gradient(
    180deg,
    #151515 0%,
    #141414 38%,
    #141414 62%,
    #121212 100%
  )`,
  border: "1px solid #242424",
  boxShadow: `
    inset 1px 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(0, 0, 0, 0.22)
  `,
};
