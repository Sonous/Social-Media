import axiosInstance from '@/configs/axios.config';
import { AxiosResponse } from 'axios';

const userApis = {
    checkUsername(username: string): Promise<AxiosResponse<{ isValid: boolean }>> {
        return axiosInstance.get(`/users/validate-username?username=${username}`);
    },

    addUser(user: User) {
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
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');
        await axiosInstance.post(
            '/users/relation',
            {
                currentUserId,
                otherUserId,
            },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        );
    },

    async removeRelation(currentUserId: string, otherUserId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');
        await axiosInstance.delete(`/users/relation`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                currentUserId,
                otherUserId
            }
        });
    },

    async getRelations(userId: string, page: number, searchString: string = '', type: 'followers' | 'following', currentUserId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');
        const { data } = await axiosInstance.get(`/users/${userId}/${type}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                page,
                searchString,
                currentUserId
            },
        });

        return data
    },

    async checkRelation(currentUserId: string, otherUserId: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');
        const { data } = await axiosInstance.get(`/users/check-relation`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                currentUserId,
                otherUserId
            }
        });

        return data
    },

    async searchUsers(searchString: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}');
        const { data } = await axiosInstance.get(`/users/search`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                searchString,
            }
        });

        return data;
    }
};

export default userApis;
