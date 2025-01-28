import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const userApis = {
    checkUsername(username: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/users/validate-username?username=${username}`);
    },

    addUser(user: CraeteUser) {
        return axiosInstance.post('/users', user);
    },

    async getUserByToken(access_token: string) {
        const {
            data: { user },
        } = await axiosInstance.get('/users/user-token', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return user;
    },

    updateUser(id: string, user: Partial<CraeteUser>) {
        return axiosInstance.put(`/users/${id}`, user);
    },

    getUserById(id: string) {
        return axiosInstance.get(`/users/${id}`);
    },
};

export default userApis;
