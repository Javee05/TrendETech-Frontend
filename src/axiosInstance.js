// Developed by: Floren Javee v. Cruz
//                 Adam Jared F. Ranon
//                 March 2025 - June 2025




import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Attach access token to requests, except for /token/ and /token/refresh/
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  
  if (
    token &&
    !config.url.includes('/token/') &&
    !config.url.includes('/token/refresh/')
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// Refresh token on 401 errors
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refresh_token');

    // Avoid retry loops and skip retrying login/refresh endpoints
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/token')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('🔒 Refresh token invalid or expired:', refreshError);
        alert('Your session has expired. Please log in again.');
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    // Fallback: force logout on any other 401/403
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;
