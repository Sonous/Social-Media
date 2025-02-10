import axiosInstance from '@/configs/axios.config';

const postApis = {
    async addPost(post: { content: string; medias: MediaType[]; userId: string }) {
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
    }
};

export default postApis;
