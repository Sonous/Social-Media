import axiosInstance from '@/configs/axios.config';

const authApis = {
    sendOpt(email: string, isReset: boolean) {
        return axiosInstance.get(`/auth/send-otp`, {
            params: {
                email,
                isReset,
            },
        });
    },

    // checkOtp(otp: string): Promise<AxiosResponse<{ isValid: boolean }>> {
    //     return axiosInstance.get(`/auth/verify-otp?otp=${otp}`);
    // },
    async signup(user: Partial<User>, otp: string) {
        await axiosInstance.post('/auth/signup', { user, otp });
    },

    async login(email: string, password: string) {
        const {
            data: { accessToken },
        } = await axiosInstance.post<{ accessToken: string }>('/auth/login', { email, password });

        return accessToken;
    },

    async reset(email: string, otp: string, password: string) {
        return await axiosInstance.post(`/auth/reset`, {
            email,
            otp,
            password,
        });
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
