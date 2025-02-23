import axiosInstance from '@/configs/axios.config';

const postApis = {
    async addPost(post: { content: string; medias: MediaType[]; user_id: string }) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        return await axiosInstance.post<{ message: string }>('/posts', post, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
        });
    },

    getPostsByUserId(id: string, page: number){
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return axiosInstance.get(`/posts/users/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                page
            }
        })
    },

    getAllPosts(page: number){
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')
        
        return axiosInstance.get(`/posts`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                page
            }
        })
    },

    async addInteraction(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')

        await axiosInstance.post('/posts/interactions', {
            post_id,
            user_id
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
    },

    async removeInteraction(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')

        await axiosInstance.delete('/posts/interactions', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                post_id,
                user_id
            }
        })
    },

    async checkInteraction(post_id: string, user_id: string) {
        const { access_token } = JSON.parse(localStorage.getItem('auth_info') || '{}')

        return await axiosInstance.get<{ isExists: boolean }>('/posts/check-interaction', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                post_id,
                user_id
            }
        })
    }
};

export default postApis;
