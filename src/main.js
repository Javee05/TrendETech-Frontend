// Developed by: Floren Javee v. Cruz
//                 Adam Jared F. Ranon
//                 March 2025 - June 2025




import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Inject token before every request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Auto refresh access token if expired
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Mount Vue app
const app = createApp(App);
app.use(router);
app.mount('#app');
