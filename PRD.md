# Concert Diary — Product Requirements Document

**Owner:** Tise
**Status:** Draft v1.1
**Date:** April 2026
**Stack:** Next.js 14 (App Router) · Tailwind CSS · TypeScript
**Direction:** Full iPod Shell

---

## 1. Product Vision

A public-facing personal website that presents Tise's concert diary (59 concert days, 2022–present) as a CSS-rendered iPod Classic device. Visitors interact with a physical-feeling iPod — navigating the classic gray menu, scrolling through years and concerts, and landing on a cinematic Now Playing screen with a polaroid photo and progress bar.

The experience feels like holding an actual iPod loaded with memories instead of music. The device *is* the website.

---

## 2. Problem & Motivation

Concert memories live scattered across phone camera rolls, notes apps, and memory. A chronological list does them no justice. This site gives each show its moment — wrapped in the most nostalgic music device ever made, turning personal history into something you can actually play.

---

## 3. Users

**Primary:** Tise herself — to share with friends, post on socials, and use as a creative portfolio piece.
**Secondary:** Anyone who visits the link — friends, followers, fellow concert-goers who want to see her taste and journey.

No login required. Fully public. No user accounts in v1.

---

## 4. Core Features (v1)

### 4.1 The iPod Shell

The entire experience lives inside a CSS-rendered iPod Classic device, centered on a dark neutral background (like a product photograph). The shell has two main regions: the screen and the click wheel.

**Shell anatomy:**
- **Device body** — white/silver plastic aesthetic with subtle gradients, inset highlights, and a drop shadow. Rounded rectangle, ~310px wide on desktop.
- **Screen bezel** — dark inset frame around the screen, giving depth.
- **Screen** — where all content lives. Switches between two views.
- **"iPod" wordmark** — below the bezel, above the click wheel. Subtle, authentic.
- **Click wheel** — large circular control below the screen. The primary navigation input.

### 4.2 Screen Views

The screen has two distinct states, matching authentic iPod behavior:

**Menu View (Browse)**
Styled to look like the classic iPod list UI — light gray background, dark text, selected row highlighted in blue. Shows:
- Header bar with title and battery icon
- Scrollable list of years: All Concerts, 2022, 2023, 2024, 2025
- Each row shows event count and a › chevron

**Concert List View**
Same gray list aesthetic. Shows all concerts for the selected year:
- Emoji icon, artist name, date (right-aligned)
- Selected row highlights in blue
- Scroll indicator if list exceeds screen height

**Now Playing View**
Dark screen. Shows:
- Menu bar — "Now Playing" title + position counter (e.g. "1 of 14") on the right, same blue gradient bar as Menu/List views
- Album art — full-width, fills the upper portion of the screen. Uses the actual concert photo if available; falls back to a thematic color gradient + large emoji centered
- Info strip — dark semi-transparent bar anchored to the bottom of the screen containing:
  - Artist name (bold, white)
  - Highlight song (smaller, muted)
  - Progress row: elapsed time · scrubber bar · remaining time (e.g. `0:21 ──── -2:15`)
- Accent color on the progress bar changes per artist

### 4.3 The Click Wheel

The click wheel is the sole navigation control. It has five interactive zones:

| Zone | Position | Action |
|---|---|---|
| MENU | Top of ring | Go back one level (Now Playing → List → Menu) |
| ⏮ | Left of ring | Previous concert (on Now Playing); scroll up (on Menu/List) |
| ⏭ | Right of ring | Next concert (on Now Playing); scroll down (on Menu/List) |
| ▶⏸ | Bottom of ring | Play / Pause (active only on Now Playing) |
| Center button | Inner circle | Select highlighted row; confirm; play/pause on Now Playing |

The wheel ring spins subtly (CSS animation) while a concert is playing, serving as a visual "spinning" indicator.

### 4.4 Concert Data Model

Each concert entry contains:

```ts
type Concert = {
  id: string;
  artist: string;
  year: number;
  date: string | null;       // ISO date string "YYYY-MM-DD", null if unknown
  highlightSong: string;     // one song from the set
  photo: string | null;      // image path; falls back to gradient + emoji
  accentColor: string;       // hex — drives progress bar color
  emoji: string;             // fallback when no photo
  bg: string;                // CSS gradient for blurred bg / photo placeholder
  venue?: string;
  city?: string;
  notes?: string;            // e.g. "2 days", "Release party", "With Edith"
};
```

Data lives in `/data/concerts.ts` — a static TypeScript file. Tise edits this to add new concerts. No CMS or database needed in v1.

### 4.5 Photo Handling

- Photos live in `/public/concerts/` as optimized WebPs.
- Next.js `<Image>` handles lazy loading and optimization.
- If `photo` is null, the album art area renders the concert's `bg` gradient with the `emoji` centered in large type.
- When a real photo is present it fills the album art area via `object-fit: cover`.

### 4.6 "Play" Mode

When playing, a timer simulates the concert as a track (3–5 min, randomized). The progress bar fills. On completion it auto-advances to the next concert — playing through the diary like an album. The wheel ring animation runs while playing.

---

## 5. Design Specification

### 5.1 iPod Shell

| Element | Value |
|---|---|
| Device width | 310px |
| Device bg | `linear-gradient(170deg, #f2f2f2, #e0e0e0, #d4d4d4)` |
| Device border radius | 38px |
| Device shadow | `0 30px 80px rgba(0,0,0,0.6)` + inner highlights |
| Screen bg (Menu) | `#c8c8c8` (classic iPod gray) |
| Screen bg (Now Playing) | `#000000` |
| Screen height | ~185px |
| Click wheel diameter | 200px |
| Click wheel bg | `linear-gradient(145deg, #e8e8e8, #d4d4d4, #c8c8c8)` |
| Center button diameter | 72px |
| Page background | Dark radial gradient — `radial-gradient(ellipse, #2a2a2a, #111, #080808)` |

### 5.2 Menu View Typography

| Element | Style |
|---|---|
| Menu bar | Blue gradient `#4a90d9 → #2770c8`, white text, 11px bold |
| Row text | 12px, weight 500, `#111` |
| Selected row | Blue gradient `#3a7fd4 → #1a5fc0`, white text |
| Row detail | 10px, 65% opacity |

### 5.3 Now Playing Typography

| Element | Font | Style |
|---|---|---|
| Menu bar title ("Now Playing") | Inter | 11px, 700, white |
| Position counter ("1 of 14") | Inter | 9px, 40% white |
| Artist name | Inter | 12px, 700, white |
| Highlight song | Inter | 10px, 400, 50% white |
| Progress times (elapsed / remaining) | Inter | 8px, tabular-nums, 40% white |

### 5.4 Motion

| Interaction | Animation |
|---|---|
| Screen view transition | `translateX` slide, 0.3s ease |
| Album art entrance | Instant with screen slide — no separate animation needed |
| Wheel ring while playing | `rotate` infinite, 3s linear |
| Accent color change | `transition: background 0.4s` |
| Progress fill | `transition: width 0.1s linear` |
| Row selection | `transition: background 0.1s` |

---

## 6. Page Structure (Next.js App Router)

```
/app
  layout.tsx            — fonts, metadata, OG tags
  page.tsx              — renders <IpodShell /> centered on page

/components
  IpodShell.tsx         — device body, screen bezel, iPod wordmark, layout
  IpodScreen.tsx        — view switcher (menu / list / player)
  MenuView.tsx          — classic gray list, year rows
  ConcertListView.tsx   — gray list, concert rows for selected year
  NowPlayingView.tsx    — dark screen, album art, info strip, progress bar
  ClickWheel.tsx        — circular wheel, 5 zones, ring spin animation
  ProgressBar.tsx       — scrubber + timestamps

/data
  concerts.ts           — static Concert[] array (source of truth)

/public
  /concerts             — optimized concert photos (.webp)
    flo-milli-2022.webp
    amine-2022.webp
    ...
```

---

## 7. Responsive Behavior

The iPod shell is a fixed-size device designed for desktop. On smaller screens:

| Breakpoint | Behavior |
|---|---|
| ≥ 600px | Full iPod shell, centered |
| < 600px | Shell scales down via `transform: scale()` to fit viewport, maintaining proportions |
| < 400px | Shell hidden; fallback to a simplified full-screen Now Playing view (no shell, no wheel — tap-based navigation) |

The fallback mobile view is not a design priority for v1 — the iPod shell at scale looks fine on most phones in landscape.

---

## 8. Metadata & Sharing

```html
<title>Tise's Concert Diary</title>
<meta property="og:title" content="Tise's Concert Diary" />
<meta property="og:description" content="59 shows. 4 years. Every one of them a memory." />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:type" content="website" />
```

The OG image (1200×630) should show the full iPod shell device on the dark background, with the Now Playing screen showing a standout concert — making it immediately clear what the site is before anyone clicks.

---

## 9. v1 Scope — What's NOT included

- Real audio playback (no actual music)
- Backend / database / CMS
- User authentication or private mode
- Click wheel scroll gesture (wheel zones are discrete click zones only — no drag-to-scroll)
- Mobile swipe gestures
- Search or text filtering
- Share-a-concert permalink routing
- Keyboard navigation (v1 is click-wheel only; may add in polish pass)

---

## 10. v2+ Backlog

- **Real audio** — Spotify/Apple Music embed for the highlight song, triggered on Now Playing open.
- **Click wheel drag** — Implement drag-to-scroll on the wheel ring for authentic feel.
- **Keyboard shortcuts** — Arrow keys scroll list / navigate concerts; spacebar plays; Esc goes back.
- **Concert permalink** — `/concerts/ateez-2022` deep-links directly to a concert's Now Playing screen.
- **Concert detail expand** — Tap/click the polaroid to flip it and reveal diary notes, setlist, more photos.
- **Shuffle mode** — Random playback order, triggered by holding center button.
- **Stats screen** — A menu item: "My Stats" showing 59 shows, most active year, top artists. Rendered in the iPod screen in the classic gray style.
- **CMS integration** — Notion or Contentful so new concerts can be added without touching code.
- **Yearly recaps** — A "Wrapped"-style full-screen takeover per year, accessible from the menu.

---

## 11. Success Metrics (v1)

- Immediately recognizable as an iPod on first glance
- Feels tactile — clicking the wheel should feel satisfying
- Looks stunning as an OG preview image when shared
- Loads fast — target < 2s on desktop, < 4s on mobile
- Easy for Tise to add new concerts (one file, one entry)

---

## 12. Launch Checklist

- [ ] All 52 concerts entered in `concerts.ts` with accurate dates
- [ ] Photos optimized (< 200KB each as WebP) and placed in `/public/concerts/`
- [ ] Accent colors and emojis confirmed per artist
- [ ] Highlight songs confirmed
- [ ] OG image created (iPod shell on dark bg, 1200×630)
- [ ] Responsive scaling tested on iPhone Safari
- [ ] Deployed to Vercel with custom domain (optional)
- [ ] Tested on Chrome, Safari, Firefox (desktop)

---

## 13. Getting Started in Cursor

1. `npx create-next-app@latest concert-diary --typescript --tailwind --app`
2. `npm install @fontsource/inter @fontsource/playfair-display`
3. Build `IpodShell.tsx` first — get the device shape and click wheel rendering right before touching any data
4. Add `MenuView.tsx` with hard-coded year rows to validate navigation flow
5. Wire up `concerts.ts` and `ConcertListView.tsx`
6. Build `NowPlayingView.tsx` last — this is the payoff screen
7. Add photos — use emoji + gradient placeholders during development
8. Deploy: `vercel --prod`

**Design reference:** `prototype-ipod-shell.html` in this folder. Match it exactly for the shell, wheel, and screen views. The click wheel zones, ring spin animation, and screen transition directions are all implemented there.
