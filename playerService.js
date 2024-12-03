// Player state management
let currentTrack = null;
let playlist = [];
let currentIndex = 0;
let isPlaying = false;
let duration = 0;
let currentTime = 0;

export function updateProgress(time) {
    currentTime = time;
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    
    if (progressBar && duration > 0) {
        const percentage = (time / duration) * 100;
        progressBar.style.width = `${percentage}%`;
        currentTimeSpan.textContent = formatTime(time);
        durationSpan.textContent = formatTime(duration);
    }
}

export function setDuration(newDuration) {
    duration = newDuration;
}

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getCurrentTrack() {
    return currentTrack;
}

export function setCurrentTrack(track) {
    currentTrack = track;
}

export function getPlaylist() {
    return playlist;
}

export function setPlaylist(newPlaylist) {
    playlist = newPlaylist;
}

export function getCurrentIndex() {
    return currentIndex;
}

export function setCurrentIndex(index) {
    currentIndex = index;
}

export function getIsPlaying() {
    return isPlaying;
}

export function setIsPlaying(state) {
    isPlaying = state;
    updatePlayPauseButton();
}

export function getNextTrack() {
    if (!playlist.length) return null;
    currentIndex = (currentIndex + 1) % playlist.length;
    return playlist[currentIndex];
}

export function getPreviousTrack() {
    if (!playlist.length) return null;
    currentIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    return playlist[currentIndex];
}

function updatePlayPauseButton() {
    const playPauseButton = document.getElementById('play-pause');
    if (playPauseButton) {
        playPauseButton.innerHTML = isPlaying ? 
            '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>' :
            '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
}