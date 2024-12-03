// Spotify API service
export async function fetchFromSpotify(endpoint, options = {}) {
    const accessToken = localStorage.getItem('spotify_access_token');
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...options.headers
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('spotify_access_token');
            window.location.reload();
        }
        throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
}

export async function searchSpotify(query, types = ['track', 'album']) {
    const data = await fetchFromSpotify(
        `/search?q=${encodeURIComponent(query)}&type=${types.join(',')}&limit=20`
    );
    return data;
}

export async function getAlbumTracks(albumId) {
    const data = await fetchFromSpotify(`/albums/${albumId}/tracks`);
    return data.items;
}

export async function getNewReleases() {
    const data = await fetchFromSpotify('/browse/new-releases?limit=20');
    return data.albums.items;
}

export async function getFeaturedPlaylists() {
    const data = await fetchFromSpotify('/browse/featured-playlists?limit=20');
    return data.playlists.items;
}

export async function getPlaylistTracks(playlistId) {
    const data = await fetchFromSpotify(`/playlists/${playlistId}/tracks`);
    return data.items.map(item => item.track);
}

export async function getGenrePlaylists(genre) {
    const data = await fetchFromSpotify(
        `/browse/categories/${genre}/playlists?limit=20`
    );
    return data.playlists.items;
}

export async function getRecommendations(genre) {
    const data = await fetchFromSpotify(
        `/recommendations?seed_genres=${genre}&limit=20`
    );
    return data.tracks;
}