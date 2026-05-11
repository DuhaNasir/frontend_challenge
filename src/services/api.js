import axios from 'axios';

const BASE_URL = 'https://vi76si8eyj.execute-api.us-east-1.amazonaws.com/dev';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  createPoll: async (pollData) => {
    const response = await apiClient.post('/polls', pollData);
    return response.data;
  },
  getPoll: async (id) => {
    const response = await apiClient.get(`/polls/${id}`);
    return response.data;
  },
  vote: async (id, optionIndex) => {
    const response = await apiClient.post(`/polls/${id}/vote`, { optionIndex });
    return response.data;
  },
  sendResults: async (id) => {
    const response = await apiClient.post(`/polls/${id}/send`);
    return response.data;
  }
};