import { create } from 'zustand';
import { spotifyService } from '../services/spotifyService';

interface PlayerState {
  currentTrack: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: any[];
  currentGenre: string | null;
  
  // Actions
  setTrack: (track: any) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setGenre: (genre: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  queue: [],
  currentGenre: null,

  setTrack: (track) => set({ currentTrack: track }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  seek: (time) => set({ currentTime: time }),
  
  setVolume: (volume) => set({ volume }),
  
  nextTrack: () => {
    const { queue, currentTrack } = get();
    const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1] });
    }
  },
  
  previousTrack: () => {
    const { queue, currentTrack } = get();
    const currentIndex = queue.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1] });
    }
  },
  
  setGenre: async (genre) => {
    try {
      const tracks = await spotifyService.getGenreTracks(genre);
      set({ 
        currentGenre: genre,
        queue: tracks,
        currentTrack: tracks[0] || null
      });
    } catch (error) {
      console.error(`Error setting genre ${genre}:`, error);
    }
  }
}));