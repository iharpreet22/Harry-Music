import axios from 'axios';
import { config } from '../config/spotify';

class SpotifyService {
  private accessToken: string | null = null;
  private api: any;

  constructor() {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors() {
    axios.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return axios(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  async getGenreTracks(genre: string, limit: number = 20) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: `genre:${genre}`,
          type: 'track',
          limit
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error(`Error fetching ${genre} tracks:`, error);
      return [];
    }
  }

  async getTrackInfo(trackId: string) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching track info:', error);
      return null;
    }
  }

  async searchTracks(query: string) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: query,
          type: 'track',
          limit: 20
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  private async refreshToken() {
    // Implement token refresh logic here
    // For now, we'll just redirect to login
    window.location.href = '/';
  }
}

export const spotifyService = new SpotifyService();