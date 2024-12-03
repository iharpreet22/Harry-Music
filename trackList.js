export function createTrackList(tracks, onTrackClick) {
    const list = document.createElement('div');
    list.className = 'tracks-list';

    tracks.forEach((track, index) => {
        const trackElement = createTrackElement(track, index, onTrackClick);
        list.appendChild(trackElement);
    });

    return list;
}

function createTrackElement(track, index, onTrackClick) {
    const div = document.createElement('div');
    div.className = 'track-item';
    
    // Safely access nested properties
    const imageUrl = track.album?.images?.[0]?.url || 
                    track.images?.[0]?.url || 
                    '/placeholder.png';
    
    div.innerHTML = `
        <span class="track-number">${index + 1}</span>
        <img src="${imageUrl}" alt="${track.name}" class="track-image">
        <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="track-artist">${track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}</div>
        </div>
        <div class="track-duration">${formatTime(track.duration_ms)}</div>
    `;

    div.addEventListener('click', () => onTrackClick(track, index));

    return div;
}

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000) / 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}