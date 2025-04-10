import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const authApis = {
    sendOpt(email: string) {
        return axiosInstance.get(`/auth/signup?email=${email}`);
    },

    checkOtp(otp: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/auth/verify-otp?otp=${otp}`);
    },

    async login(email: string, password: string) {
        const {
            data: { accessToken },
        } = await axiosInstance.post<{ accessToken: string }>('/auth/login', { email, password });

        return accessToken;
    },

    reset(email: string) {
        return axiosInstance.get(`/auth/reset?email=${email}`);
    },

    async refreshToken() {
        const {
            data: { accessToken },
        } = await axiosInstance.get<{ accessToken: string }>('/auth/refresh-token', {
            withCredentials: true,
        });

        return accessToken;
    },
};

export default authApis;
