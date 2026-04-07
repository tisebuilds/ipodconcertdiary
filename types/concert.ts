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
};
