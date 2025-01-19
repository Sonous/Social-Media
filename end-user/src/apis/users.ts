import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const userApis = {
    checkUsername(username: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/users/validate-username?username=${username}`);
    },
};

export default userApis;
