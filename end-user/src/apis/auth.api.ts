import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';
import userApis from './users.api';

const authApis = {
    sendOpt(email: string) {
        return axiosInstance.get(`/auth/signup?email=${email}`);
    },

    checkOtp(otp: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/auth/verify-otp?otp=${otp}`);
    },

    async login(email: string, password: string) {
        const { data: { access_token } } = await axiosInstance.post<{ access_token: string }>('/auth/login', { email, password });

        const user = await userApis.getUserByToken(access_token)

        localStorage.setItem('auth_info', JSON.stringify({
            access_token,
            isLogged: true,
        }));
        return user
    },

    reset(email: string) {
        return axiosInstance.get(`/auth/reset?email=${email}`);
    }
};

export default authApis;
