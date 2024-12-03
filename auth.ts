import { config } from '../config/spotify';

export const initAuth = () => {
    if (window.location.pathname === '/callback') {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
            localStorage.setItem('spotify_access_token', accessToken);
            window.location.href = '/';
            return accessToken;
        }
    }

    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
        return storedToken;
    }

    redirectToSpotifyAuth();
    return null;
};

export const redirectToSpotifyAuth = () => {
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
};

export const checkTokenValidity = async () => {
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
};