import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 12000 });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('stoken');
  if (t) cfg.headers.Authorization = 'Bearer ' + t;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('stoken');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export const authAPI = {
  register: d => api.post('/auth/register', d),
  login: d => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  updateProfile: d => api.put('/auth/profile', d),
  likeTrack: (id, data) => api.post('/auth/like/' + id, data || {}),
  addHistory: d => api.post('/auth/history', d),
};

export const musicAPI = {
  recommendations: mood => api.get('/music/recommendations/' + mood),
  search: q => api.get('/music/search', { params: { q } }),
  logMood: d => api.post('/moods', d),
  moodHistory: days => api.get('/moods/history', { params: { days } }),
  moodAnalytics: () => api.get('/moods/analytics'),
  moodInsights: () => api.get('/moods/insights/ml'),
};

export const playlistAPI = {
  getAll: () => api.get('/playlists'),
  getPublic: () => api.get('/playlists/public'),
  getOne: id => api.get('/playlists/' + id),
  create: d => api.post('/playlists', d),
  update: (id, d) => api.put('/playlists/' + id, d),
  remove: id => api.delete('/playlists/' + id),
  addTrack: (id, track) => api.post('/playlists/' + id + '/tracks', track),
  removeTrack: (id, trackId) => api.delete('/playlists/' + id + '/tracks/' + trackId),
  like: id => api.post('/playlists/' + id + '/like'),
};

export default api;
