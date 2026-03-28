import axios from 'axios';
import { FeedItem } from '../types';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const feedAPI = {
  getFeed: async (page = 0, limit = 10): Promise<FeedItem[]> => {
    const { data } = await api.get('/feed', { params: { page, limit } });
    return data;
  },

  likeTrack: async (trackId: string, userId: string): Promise<void> => {
    await api.post('/track/like', { trackId, userId });
  },

  unlikeTrack: async (trackId: string, userId: string): Promise<void> => {
    await api.delete('/track/like', { data: { trackId, userId } });
  },

  saveTrack: async (trackId: string, userId: string): Promise<void> => {
    await api.post('/track/save', { trackId, userId });
  },

  getComments: async (trackId: string) => {
    const { data } = await api.get(`/track/${trackId}/comments`);
    return data;
  },

  postComment: async (trackId: string, userId: string, text: string) => {
    const { data } = await api.post(`/track/${trackId}/comments`, { userId, text });
    return data;
  },
};
