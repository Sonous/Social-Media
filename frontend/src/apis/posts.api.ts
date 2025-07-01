import axiosInstance from '@/configs/axios.config';

const postApis = {
    async addPost(post: { content: string; medias: MediaType[]; user_id: string }) {
        return await axiosInstance.post<{ message: string }>('/posts', post);
    },

    getPostsByUserId(id: string, page: number) {
        return axiosInstance.get(`/posts/users/${id}`, {
            params: {
                page,
            },
        });
    },

    getAllPosts(page: number) {
        return axiosInstance.get(`/posts`, {
            params: {
                page,
            },
        });
    },

    async addInteraction(post_id: string, user_id: string) {
        await axiosInstance.post(
            '/posts/interactions',
            {
                post_id,
                user_id,
            },
            {},
        );
    },

    async removeInteraction(post_id: string, user_id: string) {
        await axiosInstance.delete('/posts/interactions', {
            params: {
                post_id,
                user_id,
            },
        });
    },

    async checkInteraction(post_id: string, user_id: string) {
        return await axiosInstance.get<{ isExists: boolean }>('/posts/check-interaction', {
            params: {
                post_id,
                user_id,
            },
        });
    },
};

export default postApis;
