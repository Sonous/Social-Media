import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const userApis = {
    checkUsername(username: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/users/validate-username?username=${username}`);
    },

    addUser(user: Partial<User>) {
        return axiosInstance.post('/users', user);
    },

    updateUser(id: string, user: Partial<User>) {
        return axiosInstance.put(`/users/${id}`, user);
    },

    getUserById(id: string) {
        return axiosInstance.get(`/users/${id}`);
    },

    getUserByUsername(username: string) {
        return axiosInstance.get(`/users`, {
            params: {
                username,
            },
        });
    },

    async addRelation(currentUserId: string, otherUserId: string) {
        await axiosInstance.post('/users/relation', {
            currentUserId,
            otherUserId,
        });
    },

    async removeRelation(currentUserId: string, otherUserId: string) {
        await axiosInstance.delete(`/users/relation`, {
            params: {
                currentUserId,
                otherUserId,
            },
        });
    },

    async getRelations(
        userId: string,
        page: number,
        searchString: string = '',
        type: 'followers' | 'following',
        currentUserId: string,
    ) {
        const { data } = await axiosInstance.get(`/users/${userId}/${type}`, {
            params: {
                page,
                searchString,
                currentUserId,
            },
        });

        return data;
    },

    async checkRelation(currentUserId: string, otherUserId: string) {
        const { data } = await axiosInstance.get(`/users/check-relation`, {
            params: {
                currentUserId,
                otherUserId,
            },
        });

        return data;
    },

    async searchUsers(searchString: string) {
        const { data } = await axiosInstance.get(`/users/search`, {
            params: {
                searchString,
            },
        });

        return data;
    },
};

export default userApis;
