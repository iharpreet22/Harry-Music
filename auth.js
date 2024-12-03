// Authentication Configuration
const config = {
    clientId: 'f4767adbf9164340afbf12ac586abbe2',
    redirectUri: 'https://tranquil-parfait-14ab87.netlify.app/callback',
    scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-state',
        'user-modify-playback-state',
        'app-remote-control'
    ]
};

// Handle Authentication
export function initAuth() {
    // Check if we're on the callback route
    if (window.location.pathname === '/callback') {
        // Extract token from hash
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
            // Store token and redirect to home
            localStorage.setItem('spotify_access_token', accessToken);
            window.location.href = '/';
            return accessToken;
        }
    }

    // Check if we have a stored token
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
        return storedToken;
    }

    // If no token, redirect to Spotify auth
    redirectToSpotifyAuth();
    return null;
}

function redirectToSpotifyAuth() {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
        client_id: config.clientId,
        response_type: 'token',
        redirect_uri: config.redirectUri,
        scope: config.scopes.join(' '),
        show_dialog: true
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

// Add a function to check if the token is valid
export async function checkTokenValidity() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return false;

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}
