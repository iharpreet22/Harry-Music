import { create } from 'zustand';
import { Song, Playlist, AudioPlayerState, RepeatMode } from '../types/music';

interface MusicStore {
  currentSong: Song | null;
  queue: Song[];
  playlists: Playlist[];
  playerState: AudioPlayerState;
  repeatMode: RepeatMode;
  
  // Actions
  setCurrentSong: (song: Song) => void;
  updatePlayerState: (state: Partial<AudioPlayerState>) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  currentSong: null,
  queue: [],
  playlists: [],
  playerState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  },
  repeatMode: 'none',

  setCurrentSong: (song) => set({ currentSong: song }),
  
  updatePlayerState: (state) => 
    set((prev) => ({
      playerState: { ...prev.playerState, ...state }
    })),
  
  addToQueue: (song) =>
    set((state) => ({ queue: [...state.queue, song] })),
  
  removeFromQueue: (songId) =>
    set((state) => ({
      queue: state.queue.filter((song) => song.id !== songId)
    })),
  
  createPlaylist: (name) =>
    set((state) => ({
      playlists: [
        ...state.playlists,
        {
          id: crypto.randomUUID(),
          name,
          songs: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    })),
  
  addToPlaylist: (playlistId, song) =>
    set((state) => ({
      playlists: state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: [...playlist.songs, song],
              updatedAt: new Date()
            }
          : playlist
      )
    }))
}));