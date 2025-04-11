import authApis from '@/apis/auth.api';
import useTokenStore from '@/store/useTokenStore';
import axios from 'axios';

enum TokenErrorType {
    EXPIRED = 'EXPIRED',
    INVALID = 'INVALID',
    NOPROVIDED = 'NOPROVIDED',
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Để gửi cookie refreshToken
    headers: {
        'Content-Type': 'application/json',
    },
});

const unauthorizedPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/verify-otp',
    '/auth/reset',
    '/auth/refresh-token',
    '/auth/send-otp',
    '/users/validate-username',
];

// Biến để tránh nhiều requests refresh token cùng lúc
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm để thêm callbacks vào hàng đợi
const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

// Hàm để thực thi tất cả callbacks sau khi refresh token thành công
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(async (config) => {
    if (unauthorizedPaths.some((path) => config.url?.includes(path))) {
        return config;
    }

    const accessToken = useTokenStore.getState().token;
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
            data: { errorType },
        } = error.response;

        if (config.url?.includes('/auth/refresh-token')) {
            useTokenStore.getState().clearToken();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (
            status === 401 &&
            [TokenErrorType.INVALID, TokenErrorType.NOPROVIDED, TokenErrorType.EXPIRED].includes(errorType)
        ) {
            console.log('Token expired, refreshing...', isRefreshing);
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        config.headers['Authorization'] = `Bearer ${token}`;
                        resolve(axiosInstance(config));
                    });
                });
            }

            isRefreshing = true;
            try {
                const newAccessToken = await authApis.refreshToken();
                useTokenStore.getState().setToken(newAccessToken);

                onRefreshed(newAccessToken);
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(config);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
