const audioPlayer = new Audio();

export function initAudioPlayer(onTimeUpdate, onEnded, onPlay, onPause) {
    audioPlayer.addEventListener('timeupdate', onTimeUpdate);
    audioPlayer.addEventListener('ended', onEnded);
    audioPlayer.addEventListener('play', onPlay);
    audioPlayer.addEventListener('pause', onPause);
}

export function playAudio(url) {
    if (!url) {
        console.error('No preview URL available');
        return false;
    }
    
    audioPlayer.src = url;
    return audioPlayer.play()
        .catch(error => {
            console.error('Playback failed:', error);
            return false;
        });
}

export function pauseAudio() {
    audioPlayer.pause();
}

export function setVolume(value) {
    audioPlayer.volume = value;
}

export function toggleMute() {
    audioPlayer.muted = !audioPlayer.muted;
    return audioPlayer.muted;
}

export function seekTo(time) {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = time;
    }
}

export function getCurrentTime() {
    return audioPlayer.currentTime;
}

export function getDuration() {
    return audioPlayer.duration;
}

export function isPlaying() {
    return !audioPlayer.paused;
}