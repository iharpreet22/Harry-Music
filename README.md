# Spotify Web Player

## Setup Instructions

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add your application's domain (e.g., `localhost:5173`) to the list of Redirect URIs in your Spotify application settings
4. Copy your Client ID and replace `YOUR_CLIENT_ID` in `auth.js` with your actual Client ID

## Development

```bash
npm run dev
```

## Features

- Browse new releases and featured playlists
- Search for tracks and albums
- Play track previews
- Control playback (play/pause, next/previous, volume)
- Responsive design