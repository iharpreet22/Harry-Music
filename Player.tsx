import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { formatTime } from '../utils/audioUtils';

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    previousTrack
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      seek(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      seek(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={currentTrack.preview_url}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <div className="now-playing">
        <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
        <div className="track-info">
          <div className="track-name">{currentTrack.name}</div>
          <div className="track-artist">{currentTrack.artists[0].name}</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button onClick={previousTrack}>Previous</button>
          <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={nextTrack}>Next</button>
        </div>

        <div className="progress-bar">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            value={currentTime}
            max={audioRef.current?.duration || 0}
            onChange={handleSeek}
          />
          <span>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};