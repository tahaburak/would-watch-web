import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8080');

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

  getMatches: async (sessionId) => {
    return apiRequest(`/api/sessions/${sessionId}/matches`);
  },
};

export const mediaAPI = {
  searchMovies: async (query) => {
    return apiRequest(`/api/media/search?q=${encodeURIComponent(query)}`);
  },
};

export const profileAPI = {
  getProfile: async () => {
    return apiRequest('/api/me/profile');
  },

  updateProfile: async (data) => {
    return apiRequest('/api/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePrivacy: async (invitePreference) => {
    return apiRequest('/api/me/privacy', {
      method: 'PUT',
      body: JSON.stringify({ invite_preference: invitePreference }),
    });
  },
};

export const socialAPI = {
  searchUsers: async (query) => {
    return apiRequest(`/api/users/search?q=${encodeURIComponent(query)}`);
  },

  follow: async (userId) => {
    return apiRequest(`/api/follows/${userId}`, {
      method: 'POST',
    });
  },

  unfollow: async (userId) => {
    return apiRequest(`/api/follows/${userId}`, {
      method: 'DELETE',
    });
  },

  getFollowing: async () => {
    return apiRequest('/api/me/following');
  },

  getFollowers: async () => {
    return apiRequest('/api/me/followers');
  },
};

export const roomAPI = {
  createRoom: async (name, isPublic, initialMembers = []) => {
    return apiRequest('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({
        name,
        is_public: isPublic,
        initial_members: initialMembers,
      }),
    });
  },

  getRooms: async () => {
    return apiRequest('/api/rooms');
  },

  inviteUser: async (roomId, userId) => {
    return apiRequest(`/api/rooms/${roomId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },
};
