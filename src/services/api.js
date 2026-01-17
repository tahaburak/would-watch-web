import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API request failed: ${response.status}`);
  }

  return response.json();
}

export const sessionAPI = {
  createSession: async () => {
    return apiRequest('/api/sessions', {
      method: 'POST',
    });
  },

  getSession: async (sessionId) => {
    return apiRequest(`/api/sessions/${sessionId}`);
  },

  vote: async (sessionId, mediaId, vote) => {
    return apiRequest(`/api/sessions/${sessionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({
        media_id: mediaId,
        vote: vote,
      }),
    });
  },
};

export const mediaAPI = {
  searchMovies: async (query) => {
    return apiRequest(`/api/media/search?query=${encodeURIComponent(query)}`);
  },
};
