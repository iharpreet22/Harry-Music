import { icons } from '../../icons.js';
import { 
    setIsPlaying, 
    updateProgress, 
    setDuration,
    getCurrentTrack,
    getNextTrack,
    getPreviousTrack
} from './playerService.js';

let player;
let deviceId;
let isReady = false;

export async function initSpotifyPlayer(token) {
    await waitForSpotifyWebPlaybackSDK();
    
    player = new Spotify.Player({
        name: 'Web Music Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    setupPlayerListeners();
    await player.connect();
    setupControlButtons();
}

function setupPlayerListeners() {
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceId = device_id;
        isReady = true;
        initializeControls();
    });

    player.addListener('player_state_changed', state => {
        if (state) {
            updatePlayerState(state);
            updateProgress(state.position / 1000);
            setDuration(state.duration / 1000);
        }
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify Premium:', message);
    });

    player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
    });
}

function setupControlButtons() {
    const previousButton = document.getElementById('previous');
    const playPauseButton = document.getElementById('play-pause');
    const nextButton = document.getElementById('next');

    if (previousButton) {
        previousButton.innerHTML = icons.previous;
        previousButton.addEventListener('click', previousTrack);
    }

    if (playPauseButton) {
        playPauseButton.innerHTML = icons.play;
        playPauseButton.addEventListener('click', togglePlay);
    }

    if (nextButton) {
        nextButton.innerHTML = icons.next;
        nextButton.addEventListener('click', nextTrack);
    }
}

export async function playTrack(trackUri) {
    if (!isReady || !deviceId) {
        throw new Error('Spotify Player not ready');
    }

    try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: [trackUri]
            })
        });
        setIsPlaying(true);
    } catch (error) {
        console.error('Playback error:', error);
        throw error;
    }
}

export function togglePlay() {
    if (player && isReady) {
        player.togglePlay();
    }
}

export function nextTrack() {
    const nextTrack = getNextTrack();
    if (nextTrack) {
        playTrack(nextTrack.uri);
    }
}

export function previousTrack() {
    const prevTrack = getPreviousTrack();
    if (prevTrack) {
        playTrack(prevTrack.uri);
    }
}

export function setVolume(value) {
    if (player && isReady) {
        player.setVolume(value);
    }
}

function waitForSpotifyWebPlaybackSDK() {
    return new Promise(resolve => {
        if (window.Spotify) {
            resolve();
        } else {
            window.onSpotifyWebPlaybackSDKReady = resolve;
        }
    });
}

function updatePlayerState(state) {
    setIsPlaying(!state.paused);
    
    if (state.track_window?.current_track) {
        const track = state.track_window.current_track;
        document.getElementById('current-track-name').textContent = track.name;
        document.getElementById('current-track-artist').textContent = track.artists.map(a => a.name).join(', ');
        document.getElementById('current-track-img').src = track.album.images[0].url;
    }
}

function initializeControls() {
    const volumeControl = document.getElementById('volume');
    if (volumeControl) {
        volumeControl.addEventListener('input', (e) => {
            setVolume(e.target.value / 100);
        });
    }

    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const duration = player.getDuration();
            if (duration) {
                player.seek(duration * percent);
            }
        });
    }
}