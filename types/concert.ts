export type Concert = {
  id: string;
  artist: string;
  year: number;
  date: string | null;
  highlightSong: string;
  photo: string | null;
  accentColor: string;
  emoji: string;
  bg: string;
  venue?: string;
  city?: string;
  notes?: string;
  /** YouTube watch URL, youtu.be link, or 11-character video id (optional). */
  youtubeVideoId?: string | null;
};
