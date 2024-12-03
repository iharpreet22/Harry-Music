import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Player } from './components/Player';
import { GenreList } from './components/GenreList';
import { initAuth } from './utils/auth';

function App() {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="sidebar">
          <div className="logo">
            <h1>Music Player</h1>
          </div>
          <ul className="nav-items">
            <li className="active"><span className="icon">🏠</span> Home</li>
            <li><span className="icon">🔍</span> Search</li>
            <li><span className="icon">📚</span> Library</li>
          </ul>
          <GenreList />
        </nav>
        
        <main className="main-content">
          <header>
            <div className="search-bar">
              <input type="text" placeholder="Search for songs..." />
            </div>
          </header>
          <Routes>
            <Route path="/" element={<div className="content">Welcome to Music Player</div>} />
            <Route path="/callback" element={<div>Loading...</div>} />
          </Routes>
        </main>
      </div>
      <Player />
    </Router>
  );
}

export default App;