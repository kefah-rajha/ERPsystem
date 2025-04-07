import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

let memoryAccessToken: string | null = null;
let refreshPromise: Promise<any> | null = null;

export const setMemoryAccessToken = (token: string | null) => {
  memoryAccessToken = token;
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const getMemoryAccessToken = () => memoryAccessToken;

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (!refreshPromise) {
        originalRequest._retry = true;

        refreshPromise = axiosInstance.post('/api/authorization')
          .then(response => {
            const newAccessToken = response.data.accessToken;
            setMemoryAccessToken(newAccessToken); 
            return newAccessToken; 
          })
          .catch(refreshError => {
            setMemoryAccessToken(null);
            console.error("Refresh token failed inside interceptor:", refreshError);
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;