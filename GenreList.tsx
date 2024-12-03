import React from 'react';
import { usePlayerStore } from '../store/playerStore';

const genres = ['Rock', 'Pop', 'Jazz', 'Electronic'];

export const GenreList: React.FC = () => {
  const { setGenre, currentGenre } = usePlayerStore();

  return (
    <div className="playlists">
      <h3>Genres</h3>
      <ul id="playlist-list">
        {genres.map((genre) => (
          <li
            key={genre}
            onClick={() => setGenre(genre.toLowerCase())}
            className={currentGenre === genre.toLowerCase() ? 'active' : ''}
          >
            {genre}
          </li>
        ))}
      </ul>
    </div>
  );
};