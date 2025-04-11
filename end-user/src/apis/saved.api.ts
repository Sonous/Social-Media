import axiosInstance from '@/configs/axios.config';

const savedApis = {
    getSavedPostsByUserId(id: string, page: number) {
        return axiosInstance.get(`/saved/users/${id}`, {
            params: {
                page,
            },
        });
    },

    async addSavedPost(post_id: string, user_id: string) {
        await axiosInstance.post(`/saved`, {
            post_id,
            user_id,
        });
    },

    async removeSavedPost(post_id: string, user_id: string) {
        await axiosInstance.delete(`/saved`, {
            params: {
                post_id,
                user_id,
            },
        });
    },

    async checkSavedPost(post_id: string, user_id: string) {
        return await axiosInstance.get<{ isExists: boolean }>(`/saved/check-saved`, {
            params: {
                post_id,
                user_id,
            },
        });
    },
};

export default savedApis;
