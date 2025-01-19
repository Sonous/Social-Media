import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const authApis = {
    sendOpt(email: string) {
        return axiosInstance.get(`/auth/send-otp?email=${email}`);
    },

    checkOtp(otp: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/auth/verify-otp?otp=${otp}`);
    },
};

export default authApis;
