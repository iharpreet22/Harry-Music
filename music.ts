export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export type RepeatMode = 'none' | 'one' | 'all';