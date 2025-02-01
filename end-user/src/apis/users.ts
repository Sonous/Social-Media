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
                username
            }
        })
    },

    getUserPosts(id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return axiosInstance.get(`/users/${id}/posts`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
    },

    getSavedPosts(id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return axiosInstance.get(`/users/${id}/saved-posts`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
    }
};

export default userApis;
