// Audio processing and manipulation utilities
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateAudioDuration = async (audioUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
};

export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};