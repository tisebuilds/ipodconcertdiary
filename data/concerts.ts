import type { Concert } from "@/types/concert";
import data from "./concerts.json";

/** Replace `photo` paths in concerts.json with real `/concerts/*.webp` files per show when ready. */
export const concerts: Concert[] = data as Concert[];
