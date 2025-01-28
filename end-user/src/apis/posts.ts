import axiosInstance from '@/configs/axios.config';

const postApis = {
    async addPost(post: { content: string; medias: string[]; userId: string }) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        return await axiosInstance.post<{ message: string }>('/posts', post, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
        });
    },
};

export default postApis;
