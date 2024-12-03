import { useEffect, useRef } from 'react';
import { useMusicStore } from '../store/musicStore';
import { calculateAudioDuration } from '../utils/audioUtils';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, playerState, updatePlayerState } = useMusicStore();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      calculateAudioDuration(currentSong.audioUrl).then((duration) => {
        updatePlayerState({ duration });
      });
    }
  }, [currentSong]);

  const play = async () => {
    if (audioRef.current) {
      await audioRef.current.play();
      updatePlayerState({ isPlaying: true });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      updatePlayerState({ isPlaying: false });
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      updatePlayerState({ currentTime: time });
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      updatePlayerState({ volume });
    }
  };

  return {
    audioRef,
    play,
    pause,
    seek,
    setVolume,
    isPlaying: playerState.isPlaying,
    currentTime: playerState.currentTime,
    duration: playerState.duration,
    volume: playerState.volume
  };
};