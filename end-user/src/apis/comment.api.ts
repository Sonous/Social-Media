import axiosInstance from '@/configs/axios.config';

const commentApis = {
    async addComment(comment: Partial<CustomComment>) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        return await axiosInstance.post('/comments', comment, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
        });
    },

    async removeComment(comment_id: string) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        await axiosInstance.delete(`/comments/${comment_id}`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
        });
    },

    async getParentComments(post_id: string, page: number) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get(`/comments/`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
            params: {
                post_id,
                page,
            },
        });

        return data;
    },

    async getChildComments(parent_comment_id: string, page: number) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        const { data } = await axiosInstance.get(`/comments/children`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
            params: {
                parent_comment_id,
                page,
            },
        });

        return data;
    },

    async heartComment(user_id: string, comment_id: string) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        await axiosInstance.post(`/comments/heart-comment`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
            params: {
                user_id,
                comment_id,
            },
        });
    },

    async deleteHearted(user_id: string, comment_id: string) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        await axiosInstance.delete(`/comments/heart-comment`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
            params: {
                user_id,
                comment_id,
            },
        });
    },

    async getCommentById(comment_id: string) {
        const auth_info = JSON.parse(localStorage.getItem('auth_info') || '{}');

        return await axiosInstance.get(`/comments/${comment_id}`, {
            headers: {
                Authorization: `Bearer ${auth_info?.access_token}`,
            },
        }); 
    }
};

export default commentApis;
