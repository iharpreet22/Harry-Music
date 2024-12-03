export function createAlbumGrid(albums, onAlbumClick) {
    const grid = document.createElement('div');
    grid.className = 'album-grid';

    albums.forEach(album => {
        const albumElement = createAlbumElement(album, onAlbumClick);
        grid.appendChild(albumElement);
    });

    return grid;
}

function createAlbumElement(album, onAlbumClick) {
    const div = document.createElement('div');
    div.className = 'album-item';
    div.innerHTML = `
        <img src="${album.images[0]?.url}" alt="${album.name}" class="album-cover">
        <div class="album-info">
            <div class="album-name">${album.name}</div>
            <div class="album-artist">${album.artists[0].name}</div>
        </div>
    `;
    div.addEventListener('click', () => onAlbumClick(album));
    return div;
}