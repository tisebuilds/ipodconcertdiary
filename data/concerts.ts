import type { Concert } from "@/types/concert";
import data from "./concerts.json";

/** `photo` in concerts.json is `/concerts/{id}.png` or `null` when no official image yet. */
export const concerts: Concert[] = data as Concert[];
