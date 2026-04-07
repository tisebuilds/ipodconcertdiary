"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { concerts } from "@/data/concerts";
import {
  getConcertsForYear,
  MENU_YEARS,
  randomTrackDurationMs,
} from "@/lib/concert-utils";
import type { Concert } from "@/types/concert";

export type IpodView = "menu" | "list" | "nowPlaying";

export type MenuSelection = "all" | (typeof MENU_YEARS)[number];

const MENU_ROW_COUNT = 1 + MENU_YEARS.length;

export function menuIndexToYear(index: number): MenuSelection {
  if (index === 0) return "all";
  return MENU_YEARS[index - 1];
}

interface IpodContextValue {
  view: IpodView;
  transitionDir: "forward" | "back";
  menuIndex: number;
  listIndex: number;
  yearFilter: MenuSelection;
  currentList: Concert[];
  currentConcert: Concert | null;
  positionLabel: string;
  isPlaying: boolean;
  elapsedMs: number;
  durationMs: number;
  progress: number;
  menuButton: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  center: () => void;
  playPause: () => void;
  /** Same as scroll-to row + center — for mouse/touch on the menu list. */
  menuRowActivate: (index: number) => void;
  /** Same as scroll-to row + center — for mouse/touch on the concert list. */
  listRowActivate: (index: number) => void;
}

const IpodContext = createContext<IpodContextValue | null>(null);

export function IpodProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<IpodView>("menu");
  const [transitionDir, setTransitionDir] = useState<"forward" | "back">(
    "forward",
  );
  const [menuIndex, setMenuIndex] = useState(0);
  const [listIndex, setListIndex] = useState(0);
  const [yearFilter, setYearFilter] = useState<MenuSelection>("all");
  const [nowIndex, setNowIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [durationMs, setDurationMs] = useState(() => randomTrackDurationMs());

  const currentList = useMemo(
    () => getConcertsForYear(concerts, yearFilter),
    [yearFilter],
  );

  const currentConcert = currentList[nowIndex] ?? null;

  const positionLabel =
    currentList.length > 0
      ? `${nowIndex + 1} of ${currentList.length}`
      : "0 of 0";

  const progress =
    durationMs > 0 ? Math.min(1, elapsedMs / durationMs) : 0;

  const goForward = useCallback((fn: () => void) => {
    setTransitionDir("forward");
    fn();
  }, []);

  const goBack = useCallback((fn: () => void) => {
    setTransitionDir("back");
    fn();
  }, []);

  const resetPlaybackForConcert = useCallback(() => {
    setElapsedMs(0);
    setDurationMs(randomTrackDurationMs());
  }, []);

  const playPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const menuButton = useCallback(() => {
    if (view === "nowPlaying") {
      goBack(() => {
        setView("list");
        setListIndex(nowIndex);
        setIsPlaying(false);
      });
    } else if (view === "list") {
      goBack(() => {
        setView("menu");
      });
    }
  }, [view, goBack, nowIndex]);

  const scrollUp = useCallback(() => {
    if (view === "menu") {
      setMenuIndex((i) => Math.max(0, i - 1));
    } else if (view === "list") {
      setListIndex((i) => Math.max(0, i - 1));
    } else if (view === "nowPlaying" && currentList.length > 0) {
      const next = (nowIndex - 1 + currentList.length) % currentList.length;
      setNowIndex(next);
      setListIndex(next);
      resetPlaybackForConcert();
      setIsPlaying(false);
    }
  }, [view, currentList.length, nowIndex, resetPlaybackForConcert]);

  const scrollDown = useCallback(() => {
    if (view === "menu") {
      setMenuIndex((i) => Math.min(MENU_ROW_COUNT - 1, i + 1));
    } else if (view === "list") {
      setListIndex((i) => Math.min(currentList.length - 1, i + 1));
    } else if (view === "nowPlaying" && currentList.length > 0) {
      const next = (nowIndex + 1) % currentList.length;
      setNowIndex(next);
      setListIndex(next);
      resetPlaybackForConcert();
      setIsPlaying(false);
    }
  }, [view, currentList.length, nowIndex, resetPlaybackForConcert]);

  const center = useCallback(() => {
    if (view === "menu") {
      const y = menuIndexToYear(menuIndex);
      goForward(() => {
        setYearFilter(y);
        setListIndex(0);
        setView("list");
      });
    } else if (view === "list") {
      if (currentList.length === 0) return;
      goForward(() => {
        setNowIndex(listIndex);
        setView("nowPlaying");
        resetPlaybackForConcert();
        setIsPlaying(true);
      });
    } else if (view === "nowPlaying") {
      playPause();
    }
  }, [
    view,
    menuIndex,
    listIndex,
    currentList.length,
    goForward,
    resetPlaybackForConcert,
    playPause,
  ]);

  const menuRowActivate = useCallback(
    (index: number) => {
      if (index < 0 || index >= MENU_ROW_COUNT) return;
      const y = menuIndexToYear(index);
      goForward(() => {
        setMenuIndex(index);
        setYearFilter(y);
        setListIndex(0);
        setView("list");
      });
    },
    [goForward],
  );

  const listRowActivate = useCallback(
    (index: number) => {
      if (view !== "list" || currentList.length === 0) return;
      if (index < 0 || index >= currentList.length) return;
      goForward(() => {
        setListIndex(index);
        setNowIndex(index);
        setView("nowPlaying");
        resetPlaybackForConcert();
        setIsPlaying(true);
      });
    },
    [view, currentList.length, goForward, resetPlaybackForConcert],
  );

  useEffect(() => {
    if (!isPlaying || view !== "nowPlaying") return;
    const id = window.setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
    return () => window.clearInterval(id);
  }, [isPlaying, view]);

  useEffect(() => {
    if (!isPlaying || view !== "nowPlaying") return;
    if (elapsedMs < durationMs) return;
    const list = getConcertsForYear(concerts, yearFilter);
    if (list.length === 0) return;
    setNowIndex((ni) => {
      const n = (ni + 1) % list.length;
      setListIndex(n);
      return n;
    });
    setElapsedMs(0);
    setDurationMs(randomTrackDurationMs());
  }, [elapsedMs, durationMs, isPlaying, view, yearFilter]);

  const value: IpodContextValue = {
    view,
    transitionDir,
    menuIndex,
    listIndex,
    yearFilter,
    currentList,
    currentConcert,
    positionLabel,
    isPlaying,
    elapsedMs,
    durationMs,
    progress,
    menuButton,
    scrollUp,
    scrollDown,
    center,
    playPause,
    menuRowActivate,
    listRowActivate,
  };

  return (
    <IpodContext.Provider value={value}>{children}</IpodContext.Provider>
  );
}

export function useIpod() {
  const ctx = useContext(IpodContext);
  if (!ctx) throw new Error("useIpod must be used within IpodProvider");
  return ctx;
}
