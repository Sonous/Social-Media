import authApis from '@/apis/auth.api';
import useTokenStore from '@/store/useTokenStore';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Để gửi cookie refreshToken
    headers: {
        'Content-Type': 'application/json',
    },
});

const unauthorizedPaths = ['/auth/login', '/auth/signup', '/auth/verify-otp', '/auth/reset', '/auth/refresh-token', 'auth/send-otp', '/users/validate-username'];

axiosInstance.interceptors.request.use(async (config) => {
    if (unauthorizedPaths.some((path) => config.url?.includes(path))) {
        return config;
    }

    let accessToken = useTokenStore.getState().token;
    if (!accessToken) {
        accessToken = await authApis.refreshToken();
    }
    config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            return Promise.reject(error); // Lỗi mạng hoặc lỗi không có response
        }

        const {
            status,
            config,
            data: { name },
        } = error.response;

        if (config.url?.includes('/auth/refresh-token')) {
            useTokenStore.getState().clearToken();
            window.location.href = '/login';
        } else {
            if (status === 401 && name === 'TokenExpiredError') {
                const newAccessToken = await authApis.refreshToken();
                useTokenStore.getState().setToken(newAccessToken);
                return axiosInstance(config);
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
