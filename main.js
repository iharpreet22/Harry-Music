import { initAuth } from './auth.js';
import { icons } from './icons.js';
import { createAlbumGrid } from './src/components/albumGrid.js';
import { createTrackList } from './src/components/trackList.js';
import { 
    searchSpotify, 
    getNewReleases, 
    getFeaturedPlaylists,
    getAlbumTracks,
    getPlaylistTracks 
} from './src/services/spotify.js';
import {
    initSpotifyPlayer,
    playTrack as playSpotifyTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume as setPlayerVolume
} from './src/services/spotifyPlayer.js';

let currentTrack = null;
let playlist = [];
let currentIndex = 0;

// Initialize application
async function init() {
    try {
        const accessToken = initAuth();
        if (accessToken) {
            await initSpotifyPlayer(accessToken);
            await loadInitialContent();
            setupEventListeners();
            updateVolumeIcon();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        handleError(error);
    }
}

async function loadInitialContent() {
    const content = document.querySelector('.content');
    content.innerHTML = '<h2>Loading...</h2>';

    try {
        const [albums, featuredPlaylists] = await Promise.all([
            getNewReleases(),
            getFeaturedPlaylists()
        ]);

        content.innerHTML = `
            <section class="new-releases">
                <h2>New Releases</h2>
                <div id="albums-grid"></div>
            </section>
            <section class="featured-playlists">
                <h2>Featured Playlists</h2>
                <div id="playlists-grid"></div>
            </section>
        `;

        const albumsGrid = document.getElementById('albums-grid');
        albumsGrid.appendChild(createAlbumGrid(albums, handleAlbumClick));

        const playlistsGrid = document.getElementById('playlists-grid');
        playlistsGrid.appendChild(createAlbumGrid(featuredPlaylists, handlePlaylistClick));

    } catch (error) {
        handleError(error);
    }
}

async function handleAlbumClick(album) {
    try {
        const tracks = await getAlbumTracks(album.id);
        playlist = tracks;
        displayTracks(tracks);
    } catch (error) {
        handleError(error);
    }
}

async function handlePlaylistClick(playlist) {
    try {
        const tracks = await getPlaylistTracks(playlist.id);
        this.playlist = tracks;
        displayTracks(tracks);
    } catch (error) {
        handleError(error);
    }
}

async function playTrack(track, index) {
    try {
        currentTrack = track;
        currentIndex = index;
        await playSpotifyTrack(track.uri);
        updateTrackInfo();
    } catch (error) {
        handleError(error);
    }
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(e.target.value), 500);
    });

    // Player controls
    document.getElementById('play-pause').addEventListener('click', togglePlay);
    document.getElementById('next').addEventListener('click', nextTrack);
    document.getElementById('previous').addEventListener('click', previousTrack);
    
    // Volume control
    const volumeControl = document.getElementById('volume');
    const volumeIcon = document.querySelector('.volume-icon');
    
    volumeControl.addEventListener('input', (e) => {
        setPlayerVolume(e.target.value / 100);
        updateVolumeIcon();
    });

    volumeIcon.addEventListener('click', () => {
        const newVolume = volumeControl.value === '0' ? '50' : '0';
        volumeControl.value = newVolume;
        setPlayerVolume(newVolume / 100);
        updateVolumeIcon();
    });
}

async function handleSearch(query) {
    if (!query.trim()) {
        loadInitialContent();
        return;
    }

    try {
        const results = await searchSpotify(query);
        displaySearchResults(results);
    } catch (error) {
        handleError(error);
    }
}

function displaySearchResults(results) {
    const content = document.querySelector('.content');
    content.innerHTML = `
        <section class="search-results">
            <h2>Search Results</h2>
            <h3>Albums</h3>
            <div id="search-albums-grid"></div>
            <h3>Tracks</h3>
            <div id="search-tracks-list"></div>
        </section>
    `;

    const albumsGrid = document.getElementById('search-albums-grid');
    albumsGrid.appendChild(createAlbumGrid(results.albums.items, handleAlbumClick));

    const tracksList = document.getElementById('search-tracks-list');
    playlist = results.tracks.items;
    tracksList.appendChild(createTrackList(results.tracks.items, (track, index) => playTrack(track, index)));
}

function displayTracks(tracks) {
    const tracksList = document.getElementById('tracks-list');
    if (!tracksList) return;
    
    tracksList.innerHTML = '';
    tracksList.appendChild(createTrackList(tracks, (track, index) => playTrack(track, index)));
}

function updateTrackInfo() {
    if (!currentTrack) return;

    document.getElementById('current-track-name').textContent = currentTrack.name;
    document.getElementById('current-track-artist').textContent = 
        currentTrack.artists.map(artist => artist.name).join(', ');
    document.getElementById('current-track-img').src = 
        currentTrack.album?.images[0]?.url || currentTrack.images?.[0]?.url;
}

function updateVolumeIcon() {
    const volumeControl = document.getElementById('volume');
    const volumeIcon = document.querySelector('.volume-icon');
    volumeIcon.innerHTML = volumeControl.value === '0' ? icons.volumeMuted : icons.volumeHigh;
}

function handleError(error) {
    console.error('Error:', error);
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = error.message || 'An error occurred. Please try again.';
    document.body.appendChild(errorContainer);
    setTimeout(() => errorContainer.remove(), 5000);
}

// Initialize the application
init();