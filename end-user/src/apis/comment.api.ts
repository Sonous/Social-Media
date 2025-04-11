import axiosInstance from '@/configs/axios.config';

const commentApis = {
    async addComment(comment: Partial<CustomComment>) {
        return await axiosInstance.post('/comments', comment);
    },

    async removeComment(comment_id: string) {
        await axiosInstance.delete(`/comments/${comment_id}`);
    },

    async getParentComments(post_id: string, page: number) {
        const { data } = await axiosInstance.get(`/comments/`, {
            params: {
                post_id,
                page,
            },
        });

        return data;
    },

    async getChildComments(parent_comment_id: string, page: number) {
        const { data } = await axiosInstance.get(`/comments/children`, {
            params: {
                parent_comment_id,
                page,
            },
        });

        return data;
    },

    async heartComment(user_id: string, comment_id: string) {
        await axiosInstance.post(`/comments/heart-comment`, {
            params: {
                user_id,
                comment_id,
            },
        });
    },

    async deleteHearted(user_id: string, comment_id: string) {
        await axiosInstance.delete(`/comments/heart-comment`, {
            params: {
                user_id,
                comment_id,
            },
        });
    },

    async getCommentById(comment_id: string) {
        return await axiosInstance.get(`/comments/${comment_id}`);
    },
};

export default commentApis;
